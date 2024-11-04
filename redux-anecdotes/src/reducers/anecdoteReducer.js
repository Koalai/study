import { createSlice } from '@reduxjs/toolkit';
import noteService from '../services/note';

export const getId = () => (100000 * Math.random()).toFixed(0);

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVote(state, action) {
      const note = state.find(
        (n) => n.id === action.payload.id
      );
      if (note) {
        note.votes += 1;
      }
    },
    appendNote(state, action) {
      state.push(action.payload);
    },
    setNote(state, action) {
      return action.payload;
    },
  },
});

export const { addVote, appendNote, setNote } = anecdotesSlice.actions;

export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll();
    console.log(notes)
    dispatch(setNote(notes))
  };
};

export const createNote = (content) => {
  return async (dispatch) => {
    const newNote = await noteService.createNew(content);
    console.log(newNote)
    dispatch(appendNote(newNote));
  };
};

export const noteVote = (id, note) => {
  return async dispatch => {
    const updateNote = await noteService.update(id, note)
    dispatch(addVote(updateNote))
  }
}
export default anecdotesSlice.reducer;
