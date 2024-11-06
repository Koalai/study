import { useState } from "react"
import PropTypes from "prop-types"
import { updateLike, removeBlog} from "../reducers/blogReducer"
import { useDispatch } from "react-redux"

const Blogs = ({ blogs, user }) => {
  const [viewBlog, setViewBlog] = useState({})
  const dispatch = useDispatch()
  console.log(user)

  const handleView = (id) => {
    setViewBlog((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }
  const incrementLikes = async (id) => {
    try {
      const blogToUpdate = blogs.find((b) => b._id === id)
      if (!blogToUpdate) {
        console.error("Blog not found")
        return
      }

      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
      console.log(updatedBlog)
      dispatch(updateLike(updatedBlog))
    } catch (error) {
      console.error("Failed to update likes:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        dispatch(removeBlog(id))
      } catch (error) {
        console.error("Failed to delete blog:", error)
      }
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <>
      {sortedBlogs.map((blog) => {
        return (
          <div
            key={blog._id}
            className="border px-4 w-2/3 my-2 py-2 flex flex-col"
          >
            <div className="flex " data-testid="blog-test">
              <p>
                {blog.title} {blog.author}
              </p>
              <button
                data-testid={`${blog._id}-showBtn`}
                className="ml-8 bg-slate-400 px-2 py-1 text-white rounded-md"
                onClick={() => handleView(blog._id)}
              >
                {viewBlog[blog._id] ? "Hide" : "Show"}
              </button>
            </div>
            {viewBlog[blog._id] && (
              <div className="mt-2">
                <p>User: {blog.user.name}</p>
                <p>URL: {blog.url}</p>
                <div>
                  <span
                    role="button"
                    data-testid={`${blog._id}-likes`}
                    className="mb-2 bg-slate-400 px-2 py-1 text-white rounded-md"
                    onClick={() => incrementLikes(blog._id)}
                  >
                    Likes: {blog.likes}
                  </span>
                </div>
                {user.id === blog.user.id && (
                  <button
                    className="bg-slate-400 px-2 py-1 text-white rounded-md"
                    onClick={() => handleDelete(blog._id)}
                  >
                    Delete blog
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

export default Blogs

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
}
