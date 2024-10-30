import { useState } from "react"
import blogService from "../services/blogs"
import PropTypes from "prop-types"

const Blog = ({ blogs, setBlogs }) => {
  const [viewBlog, setViewBlog] = useState({})

  const handleView = (id) => {
    setViewBlog((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }
  const incrementLikes = async (id) => {
    try {
      // Lấy blog đã được cập nhật từ blogs mới nhất
      const blogToUpdate = blogs.find((b) => b._id === id)
      if (!blogToUpdate) {
        console.error("Blog not found")
        return
      }

      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
      console.log("UpdatedBlog", updatedBlog)

      const response = await blogService.update(id, updatedBlog)
      console.log("Response after update:", response)

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => (blog._id === id ? response : blog))
      )
    } catch (error) {
      console.error("Failed to update likes:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter((blog) => blog._id !== id))
      } catch (error) {
        console.error("Failed to delete blog:", error)
      }
    }
  }

  return (
    <>
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="border px-4 w-2/3 my-2 py-2 flex flex-col"
        >
          <div className="flex">
            <p>
              {blog.title} {blog.author}
            </p>
            <button
              className="ml-8 bg-slate-400 px-2 py-1 text-white rounded-md"
              onClick={() => handleView(blog._id)}
            >
              {viewBlog[blog._id] ? "Hide" : "Show"}
            </button>
          </div>
          {viewBlog[blog._id] && (
            <div className="mt-2">
              <p>User: {blog.user && blog.user.name}</p>
              <p>URL: {blog.url}</p>
              <div>
                <span
                  role="button"
                  data-testid={`${blog._id}-likes`}
                  className=" bg-slate-400 px-2 py-1 text-white rounded-md"
                  onClick={() => incrementLikes(blog._id)}
                >
                  Likes: {blog.likes}
                </span>
              </div>
              <button
                className="bg-slate-400 px-2 py-1 text-white rounded-md"
                onClick={() => handleDelete(blog._id)}
              >
                Delete blog
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  )
}

export default Blog

Blog.propTypes = {
  blogs: PropTypes.array.isRequired,
  setBlogs: PropTypes.func.isRequired,
}
