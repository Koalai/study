export const notificationReducer = (state, action) => {
    console.log(state, action)
    switch (action.type) {
      case "SET_NOTIFICATION":
        return { message: action.payload};
      case "CLEAR_NOTIFICATION":
        return { message: ""};
      default:
        return state;
    }
  };