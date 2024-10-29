import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import "./index.css"
import Notification from "./components/Notification"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem("loggedUser", JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
      setErrorMessage(null)
    } catch (exception) {
      if (exception.response && exception.response.status === 401) {
        setErrorMessage("Wrong username or password")
      } else {
        setErrorMessage("Login failed")
      }

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser")
    setUser(null)
  }

  const createBlog = async (e) => {
    e.preventDefault() 

    if (!title || !author || !url) {
      setErrorMessage("All fields must be filled");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return;
    }

    try {
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      setSuccessMessage(
        `A new blog '${newBlog.title}' by ${newBlog.author} added`
      )
      setTitle("")
      setAuthor("")
      setUrl("")

      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage("Failed to add the blog")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div className="ml-12 my-12 font-mono ">
      <h1 className="text-4xl font-bold">
        {user === null ? `log in to application` : `blogs`}
      </h1>
      <Notification
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
      {user === null ? (
        <form className="flex flex-col w-52" onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="border"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="border"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <button
            className="bg-slate-400 mx-auto mt-2 text-white px-2 py-1 rounded-md"
            type="submit"
          >
            Login
          </button>
        </form>
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
          <div>
            <h2 className="font-bold text-4xl">Create new</h2>
            <form className="flex flex-col w-52" onSubmit={createBlog}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="border"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
              <label htmlFor="author">Author</label>
              <input
                type="text"
                className="border"
                value={author}
                onChange={({ target }) => setAuthor(target.value)}
              />
              <label htmlFor="url">URL</label>
              <input
                type="text"
                className="border"
                value={url}
                onChange={({ target }) => setUrl(target.value)}
              />
              <button
                className="bg-slate-400 px-2 py-1 text-white rounded-md mx-auto my-4"
                type="submit"
              >
                Create
              </button>
            </form>
          </div>
          {blogs.map((blog) => (
            <p key={blog._id}>
              {blog.title} is written by {blog.author}
            </p>
          ))}
        </>
      )}
    </div>
  )
}

export default App
