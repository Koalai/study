import { configureStore } from '@reduxjs/toolkit';
import noteReducer from './reducers/anecdoteReducer';
import filterReducer from './reducers/filterReducer';
import notificationReducer from './reducers/notificationReducer';

const store = configureStore({
  reducer: {
    note: noteReducer,
    filterNote: filterReducer,
    notification: notificationReducer,
  },
});

export default store
