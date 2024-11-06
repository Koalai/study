import { useEffect, useState } from "react"
import blogService from "./services/blogs"
import "./index.css"
import Notification from "./components/Notification"
import LoginForm from "./components/LoginForm"
import BlogForm from "./components/BlogForm"
import { useDispatch, useSelector } from "react-redux"
import { setUser, logOut } from "./reducers/userReducer"
import { initializeBlogs } from "./reducers/blogReducer"
import UserDetail from "./components/UserDetail"
import Users from "./components/Users"
import { Route, Routes } from "react-router-dom"
import Menu from "./components/Menu"
import Blogs from "./components/Blogs"
import loginService from "./services/login"
import BlogDetail from "./components/BlogDetail"

const App = () => {
  const dispatch = useDispatch()
  const [users, setUsers] = useState([])

  const { errorMessage, successMessage } = useSelector((state) => state.noti)
  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)
  useEffect(() => {
    const getAllUser = async () => {
      const allUsers = await loginService.getUser()
      setUsers(allUsers)
    }
    getAllUser()
  }, [])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser")
    dispatch(logOut())
  }

  return (
    <div className="ml-12 my-12 font-mono ">
      <Menu />
      <h1 className="text-4xl font-bold mt-4">
        {user === null ? `log in to application` : `blogs`}
      </h1>

      <Notification
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
      {user === null ? (
        <>
          <LoginForm user={user} />
        </>
      ) : (
        <>
          <div className="flex gap-4 items-center mb-4">
            <h2>{user.name} is logged in</h2>
            <button
              className="bg-slate-400 px-2 py-1 text-white rounded-md"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
          <Routes>
            <Route path="/create" element={<BlogForm />}></Route>
            <Route
              path="/blogs"
              element={<Blogs blogs={blogs} user={user} />}
            ></Route>
            <Route path="/users" element={<Users users={users} />}></Route>
            <Route
              path="/users/:id"
              element={<UserDetail users={users} />}
              ></Route>
              <Route path="/blogs/:id" element={<BlogDetail blogs={blogs} />}></Route>
          </Routes>
        </>
      )}
    </div>
  )
}

export default App
