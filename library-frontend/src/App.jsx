import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import BookForm from './components/BookForm';
import { GET_DATABASE } from './queries/queries';
import { useApolloClient, useQuery } from '@apollo/client';
import LoginForm from './components/LoginForm';

const App = () => {
  const [page, setPage] = useState('authors');
  const personResult = useQuery(GET_DATABASE);
  console.log(personResult)
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  if (personResult.loading) {
    return <div>Loading </div>;
  }

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm setToken={setToken} />
      </div>
    );
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      <button onClick={logout}>logout</button>
      <Authors
        show={page === 'authors'}
        authors={personResult.data.allAuthor}
      />

      <Books show={page === 'books'} books={personResult.data.allBook} />

      <BookForm show={page === 'add'} />
    </div>
  );
};

export default App;
