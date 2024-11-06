
import { useDispatch } from "react-redux"
import { useState } from "react"
import { setUser } from "../reducers/userReducer"
import { setErrorMessage, clearMessage } from "../reducers/notiReducer"
import loginService from '../services/login'
import blogService from '../services/blogs'

function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({username, password})
      blogService.setToken(user.token)
      window.localStorage.setItem("loggedUser", JSON.stringify(user))
      dispatch(setUser(user))
      setUsername("")
      setPassword("")
      dispatch(clearMessage())
    } catch (exception) {
      if (exception.response && exception.response.status === 401) {
        dispatch(setErrorMessage("Wrong username or password"))
      } else {
        dispatch(setErrorMessage("Login failed"))
      }

      setTimeout(() => {
        dispatch(clearMessage())
      }, 5000)
    }
  }

  return (
    <form className={`flex flex-col w-52`} onSubmit={handleLogin}>
      <label htmlFor="username">Username</label>
      <input
        data-testid="username"
        type="text"
        className="border"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        data-testid="password"
        type="password"
        className="border"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-slate-400 mx-auto mt-2 text-white px-2 py-1 rounded-md"
        type="submit"
      >
        Login
      </button>
    </form>
  )
}



export default LoginForm
