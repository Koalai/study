import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '', 
  reducers: {
    changeNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return '';
    },
  },
});


export const { changeNotification, clearNotification } = notificationSlice.actions;


export const setNotification = (str, time) => {
  return dispatch => {
    dispatch(changeNotification(str))
    setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000);
  }
}

export default notificationSlice.reducer;
