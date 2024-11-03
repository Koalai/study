import { useSelector } from 'react-redux';

const AnecdoteList = ({ vote }) => {
  const anecdotes = useSelector((state) => state.note);
  const currentFilter = useSelector((state) => state.filterNote);

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(currentFilter.toLowerCase())
  );

  return (
    <ul>
      {filteredAnecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          {anecdote.content}
          <button onClick={() => vote(anecdote.id)}>vote</button>
        </li>
      ))}
    </ul>
  );
};

export default AnecdoteList;
