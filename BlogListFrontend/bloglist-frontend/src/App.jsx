import { useState, useEffect } from "react"
import blogService from "./services/blogs"
import loginService from "./services/login"
import "./index.css"
import Notification from "./components/Notification"
import LoginForm from "./components/LoginForm"
import BlogForm from "./components/BlogForm"
import Blogs from "./components/Blog"

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
  const [blogFormVisible, setBlogFormVisible] = useState(false)

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
      setErrorMessage("")
    } catch (exception) {
      if (exception.response && exception.response.status === 401) {
        setErrorMessage("Wrong username or password")
      } else {
        setErrorMessage("Login failed")
      }

      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser")
    setUser(null)
  }

  const createBlog = async (blogData) => {
    if (!blogData.title || !blogData.author || !blogData.url) {
      setErrorMessage("All fields must be filled");
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return;
    }
  
    try {
      const newBlog = await blogService.create(blogData);
      setBlogs(blogs.concat(newBlog));
      setSuccessMessage(`A new blog '${newBlog.title}' by ${newBlog.author} added`);
      setTitle("");
      setAuthor("");
      setUrl("");
      setBlogFormVisible(false);
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      setErrorMessage("Failed to add the blog");
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleCancel = () => {
    setBlogFormVisible(false)
    setTitle("")
    setAuthor("")
    setUrl("")
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
        <>
          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
          />
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
          {!blogFormVisible ? (
            <button type="button" className="bg-slate-400 px-2 py-1 text-white rounded-md mx-auto my-4" onClick={() => setBlogFormVisible(true)}>
              Add blog
            </button>
          ) : (
            <BlogForm
              title={title}
              author={author}
              url={url}
              createBlog={createBlog}
              handleTitleChange={({ target }) => setTitle(target.value)}
              handleAuthorChange={({ target }) => setAuthor(target.value)}
              handleUrlChange={({ target }) => setUrl(target.value)}
              handleCancel={handleCancel}
            />
          )}
            <Blogs blogs={blogs} setBlogs={setBlogs} />
        </>
      )}
    </div>
  )
}

export default App
