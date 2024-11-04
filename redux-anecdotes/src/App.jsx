import { useSelector, useDispatch } from 'react-redux';
import { noteVote, createNote, initializeNotes } from './reducers/anecdoteReducer';
import { setNotification, clearNotification } from './reducers/notificationReducer';
import AnecdoteForm from './components/AnecdoteForm';
import AnecdoteList from './components/AnecdoteList';
import Filter from './components/Filter';
import Notification from './components/Notification';
import { useEffect } from 'react';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeNotes())
  }, [])

  const allAnecdotes = useSelector((state) => state.note);
  console.log(allAnecdotes)

  const currentFilter = useSelector((state) => state.filterNote);


  const filteredAnecdotes = allAnecdotes
    .filter((anecdote) =>
      anecdote.content.toLowerCase().includes(currentFilter.toLowerCase())
    )
    .sort((a, b) => b.votes - a.votes);

  const handleVote = (id) => {
    const anecdoteVoted = allAnecdotes.find(a => a.id === id)
    dispatch(noteVote(id, anecdoteVoted));
    dispatch(setNotification(`Anecdote "${anecdoteVoted.content}" voted!`, 5));
  };

  const handleCreateAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.note.value;
    dispatch(createNote(content));
    dispatch(setNotification(`New anecdote created: "${content}"`));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
    event.target.note.value = '';
  };

  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList anecdotes={filteredAnecdotes} vote={handleVote} />
      <AnecdoteForm handleCreateNote={handleCreateAnecdote} />
    </div>
  );
};

export default App;
