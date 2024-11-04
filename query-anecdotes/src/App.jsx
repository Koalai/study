import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllNotes, createNote, updateNote } from './request';
import { useNotification } from './components/NotiProvider';

const App = () => {
  const queryClient = useQueryClient();
  const [state, dispatch] = useNotification();

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAllNotes,
    refetchOnWindowFocus: false,
  });

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: `Anecdote ${newNote.content} created!`,
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });

      dispatch({
        type: 'SET_NOTIFICATION',
        payload: `Anecdote "${updatedNote.content}" voted!`,
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
    onError: (error) => {
      console.error('Error updating note:', error);
    },
  });

  const handleVote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    updateNoteMutation.mutate(updatedAnecdote);
  };

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  const anecdotes = result.data || [];

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm newNoteMutation={newNoteMutation} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
