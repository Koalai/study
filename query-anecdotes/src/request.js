import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

export const getAllNotes = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createNote = async (newNote) => {
  if (newNote.content === '' || newNote.content.length < 5) {
    console.error('Content must be at least 5 characters long.');
  }

  try {
    const response = await axios.post(baseUrl, newNote);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateNote = async (updatedNote) => {
  try {
    const response = await axios.put(
      `${baseUrl}/${updatedNote.id}`,
      updatedNote
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  getAllNotes,
  createNote,
  updateNote,
};
