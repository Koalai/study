const typeDefs = `
type Author {
    name: String!
    born: Int
    bookCount: Int!
}
type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String]!
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
    createUser( username: String! password: String! favoriteGenre: String!): User
    login( username: String! password: String! ): Token
}


type Query {
    authorCount: Int!
    bookCount: Int!
    allBook(author: String, genre: String): [Book!]!
    allAuthor: [Author]!
    me: User
   
  }
`;

module.exports = typeDefs;
