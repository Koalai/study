import { useSelector } from 'react-redux';

const AnecdoteList = ({ vote, anecdotes }) => {

  return (
    <ul>
      {anecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          {anecdote.content}
          <button onClick={() => vote(anecdote.id)}>vote</button>
        </li>
      ))}
    </ul>
  );
};

export default AnecdoteList;
