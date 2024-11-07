import { useContext, createContext, useReducer } from "react"

const notiReducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, errorMessage: action.payload }
    case "SET_SUCCESS":
      return { ...state, successMessage: action.payload }
    case "CLEAR":
      return { errorMessage: null, successMessage: null }
    default:
      return state
  }
}

const NotiContext = createContext()

export const useNoti = () => {
  return useContext(NotiContext)
}

export const NotiProvider = ({ children }) => {
  const [noti, dispatch] = useReducer(notiReducer, {
    errorMessage: null,
    successMessage: null,
  })

    const setError = (message) => dispatch({ type: "SET_ERROR", payload: message })
    const setSuccess = (message) => dispatch({ type: 'SET_SUCCESS', payload: message })
    const clearNoti = () => dispatch({type: "CLEAR"})

  return (
    <NotiContext.Provider value={{ setError, setSuccess, clearNoti, noti }}>
      {children}
    </NotiContext.Provider>
  )
}
