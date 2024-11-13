const { GraphQLError } = require('graphql');
const Author = require('./models/Author');
const Book = require('./models/Book');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const resolvers = {
  Query: {
    authorCount: () => Author.countDocuments(),
    bookCount: () => Book.countDocuments(),
    allBook: async (root, { author, genre }) => {
      const query = {};
      if (author) {
        query.author = author;
      }

      if (genre) {
        query.genres = { $in: [genre] };
      }
      try {
        const books = await Book.find(query);
  
        const result = await Promise.all(
          books.map(async (book) => {
            const authorDoc = await Author.findById(book.author);
            const bookCount = await Book.countDocuments({
              author: book.author,
            });

            return {
              title: book.title,
              published: book.published,
              genres: book.genres,
              id: book.id,
              author: {
                name: authorDoc.name,
                born: authorDoc.born,
                bookCount: bookCount,
              },
            };
          })
        );
        return result; 
      } catch (error) {
        console.error(error);
      }
    },
    allAuthor: async () => {
      const authors = await Author.find({});
      const authorsWithBookCount = [];

      for (const author of authors) {
        const bookCount = await Book.countDocuments({ author: author._id });
        authorsWithBookCount.push({
          name: author.name,
          born: author.born,
          bookCount,
        });
      }

      return authorsWithBookCount;
    },
    me: (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }
      return context.currentUser;
    },
  },
  Mutation: {
    createUser: async (root, { username, password, favoriteGenre }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new GraphQLError('Username already exists', {
          extensions: { code: 'USER_ALREADY_EXISTS' },
        });
      }

      const user = new User({
        username,
        favoriteGenre,
        passwordHash: bcrypt.hashSync(password, 10),
      });

      try {
        const savedUser = await user.save();
        return savedUser;
      } catch (error) {
        throw new GraphQLError('Error creating user', {
          extensions: { code: 'CREATE_USER_ERROR', error: error.message },
        });
      }
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'INVALID_CREDENTIALS' },
        });
      }
      const userForToken = { id: user._id, username: user.username };

      return {
        value: jwt.sign(userForToken, process.env.JWT_SECRET, {
          expiresIn: '1d',
        }),
      };
    },
    addBook: async (root, { title, author, published, genres }) => {
      let authorDoc = await Author.findOne({ name: author });
      const newAuthor = new Author({
        name: author,
        born: null,
      });
      console.log(authorDoc);
      console.log({ title, author, published, genres });

      if (!authorDoc) {
        const result = await newAuthor.save();
        console.log(result);
        authorDoc = result;
      }

      const book = new Book({
        title,
        author: authorDoc ? authorDoc._id : newAuthor._id,
        published,
        genres,
      });

      try {
        await book.save();
        return {
          title: book.title,
          published: book.published,
          genres: book.genres,
          id: book.id,
          author: {
            name: authorDoc.name,
            born: authorDoc.born,
            bookCount: await Book.countDocuments({ author: authorDoc._id }),
          },
        };
      } catch (error) {
        if (error.name === 'ValidationError') {
          if (error.errors.title && error.errors.title.kind === 'unique') {
            throw new GraphQLError(
              `The book title "${title}" is already taken.`,
              {
                extensions: {
                  code: 'DUPLICATE_BOOK_TITLE',
                  invalidArgs: { title, author, genres },
                },
              }
            );
          }

          throw new GraphQLError('Validation error when adding book', {
            extensions: {
              code: 'BAD_BOOK_INPUTS',
              invalidArgs: { title, author, genres },
              error: error.message,
            },
          });
        }

        throw new GraphQLError('Error saving book', {
          extensions: {
            code: 'UNKNOWN_ERROR',
            error: error.message,
          },
        });
      }
    },

    editAuthor: async (root, { name, setBornTo }) => {
      try {
        const author = await Author.findOne({ name });
        if (!author) {
          throw new GraphQLError(`Author ${name} not found`, {
            extensions: {
              code: 'AUTHOR_NOT_FOUND',
            },
          });
        }

        author.born = setBornTo;

        try {
          await author.save();
          return author;
        } catch (saveError) {
          if (saveError.name === 'ValidationError') {
            if (
              saveError.errors.name &&
              saveError.errors.name.kind === 'unique'
            ) {
              throw new GraphQLError(
                `The author name "${name}" already exists.`,
                {
                  extensions: {
                    code: 'DUPLICATE_AUTHOR_NAME',
                    invalidArgs: { name, setBornTo },
                  },
                }
              );
            }

            throw new GraphQLError('Validation error when updating author', {
              extensions: {
                code: 'BAD_INPUTS',
                invalidArgs: { setBornTo },
                error: saveError.message,
              },
            });
          }

          throw new GraphQLError('Error saving author', {
            extensions: {
              code: 'UNKNOWN_ERROR',
              error: saveError.message,
            },
          });
        }
      } catch (error) {
        console.log('Error updating author:', error);
        throw new GraphQLError('Error fetching author', {
          extensions: {
            code: 'AUTHOR_FETCH_ERROR',
            error: error.message,
          },
        });
      }
    },
  },
};

module.exports = resolvers;
