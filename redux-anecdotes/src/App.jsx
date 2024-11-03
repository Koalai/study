import { useSelector, useDispatch } from 'react-redux';
import { addVote, createNote } from './reducers/anecdoteReducer';
import AnecdoteForm from './components/AnecdoteForm';
import AnecdoteList from './components/AnecdoteList';

const App = () => {
  const anecdotes = useSelector((state) =>
    [...state].sort((a, b) => b.votes - a.votes)
  );

  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(addVote(id));
  };

  const handleCreateNote = (event) => {
    event.preventDefault();
    const content = event.target.note.value;
    dispatch(createNote(content));
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList anecdotes={anecdotes} vote={vote} />
      <AnecdoteForm handleCreateNote={handleCreateNote} />
    </div>
  );
};

export default App;
