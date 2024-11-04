import { useNotification } from './NotiProvider';

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };
  const [state] = useNotification();
  //  console.log(state)

  return <div style={style}>{state.message}</div>;
};

export default Notification;
