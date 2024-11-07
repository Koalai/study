
import { useState } from "react"
import { useDispatch } from "react-redux"
import { addNewBlog } from "../reducers/blogReducer"
import { useNoti } from "./NotiProvider"

function BlogForm({createBlogMutation}) {
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const dispatch = useDispatch()
  const [url, setUrl] = useState("")
  const { setError, setSuccess, clearNoti } = useNoti()

  const handleCreateBlog = async (blogData) => {
    if (!blogData.title || !blogData.author || !blogData.url) {
      setError("All fields must be filled")
      setTimeout(() => {
        clearNoti()
      }, 5000)
      return
    }

    try {
      createBlogMutation.mutate(blogData)
      setSuccess(`A new blog '${blogData.title}' by ${blogData.author} added`)
      setTitle("")
      setAuthor("")
      setUrl("")
      setBlogFormVisible(false)
      setTimeout(() => {
        clearNoti()
      }, 5000)
    } catch (error) {
     setError("Failed to add the blog")
      setTimeout(() => {
        clearNoti()
      }, 5000)
    }
  }

  const handleCancel = () => {
    setBlogFormVisible(false)
    setTitle("")
    setAuthor("")
    setUrl("")
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleCreateBlog({ title, author, url })
  }

  return (
    <div>
      {!blogFormVisible ? (
        <button
          type="button"
          className="bg-slate-400 px-2 py-1 text-white rounded-md mx-auto my-4"
          onClick={() => setBlogFormVisible(true)}
        >
          Add blog
        </button>
      ) : (
        <form className="flex flex-col w-52" onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            data-testid="title"
            type="text"
            className="border"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="author">Author</label>
          <input
            id="author"
            data-testid="author"
            type="text"
            className="border"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <label htmlFor="url">URL</label>
          <input
            id="url"
            data-testid="url"
            type="text"
            className="border"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="flex">
            <button
              className="bg-slate-400 px-2 py-1 text-white rounded-md mx-auto my-4"
              type="submit"
            >
              Create
            </button>
            <button
              type="button"
              className="bg-slate-400 px-2 py-1 text-white rounded-md mx-auto my-4"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default BlogForm
