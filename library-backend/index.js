const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const Author = require('./models/Author');
const Book = require('./models/Book');
const User = require('./models/User');
const mongoose = require('mongoose');
const { GraphQLError } = require('graphql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
console.log('connecting to MONGODB');

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MONGODB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });


const typeDefs = `
type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String]!
}
type Author {
    name: String!
    born: Int
    bookCount: Int!
}
type User{
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token{
  value: String!
}

type Mutation {
    addBook(title: String!, author: String!, published: Int!, genres: [String]!): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
}


type Query {
    authorCount: Int!
    bookCount: Int!
    allBook(author: String, genre: String): [Book!]!
    allAuthor: [Author]!
    me: User
    createUser( username: String! favoriteGenre: String!): User
    login( username: String! password: String! ): Token
  }
`;

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

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
        return books;
      } catch (error) {
        console.error(error);
      }
    },
    allAuthor: async () => {
      const authors = await Author.find({});
      const authorsWithBookCount = [];

      for (const author of authors) {
        const bookCount = await Book.countDocuments({ author: author.name });
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
    createUser: async (root, { username, favoriteGenre }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new GraphQLError('Username already exists', {
          extensions: { code: 'USER_ALREADY_EXISTS' },
        });
      }

      const user = new User({
        username,
        favoriteGenre,
        passwordHash: bcrypt.hashSync('dangkhoa', 10),
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

      const token = generateToken(user);
      return { value: token };
    },
    addBook: async (root, { title, author, published, genres }) => {
      const book = new Book({
        title,
        author,
        published,
        genres,
      });

      try {
        await book.save();
        return book;
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
