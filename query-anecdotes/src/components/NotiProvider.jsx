import { createContext, useReducer, useContext } from 'react';
import { notificationReducer } from '../reducer/Notification'; 

const NotiContext = createContext();

export const NotiContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, { message: '' });
  return (
    <NotiContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotiContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotiContext);
};
