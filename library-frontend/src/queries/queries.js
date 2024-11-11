import { gql } from '@apollo/client';

export const GET_DATABASE = gql`
  query {
    allAuthor {
      name
      born
      bookCount
    }
    allBook {
      title
      published
      author {
        name
        born
      }
      genres
      id
    }
    me {
      username
      favoriteGenre
      id
    }
  }
`;

export const GET_BOOKS_BY_GENRE = gql`
  query GetBooksByGenre($genre: String) {
    allBook(genre: $genre) {
      title
      published
      author {
        name
      }
      genres
      id
    }
  }
`;

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export const EDIT_BIRTHYEAR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

