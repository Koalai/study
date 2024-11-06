import { useParams, Link } from "react-router-dom"

function UserDetail({ users }) {
  const { id } = useParams()
  const user = users.find((user) => user.id === id)

  if (!user) {
    return <p>User not found.</p>
  } else {
    console.log(user.blogs)
  }

  return (
    <div>
      {user && user.blogs && (
        <>
          <h1 className="text-4xl font-black mb-8">{user.name}</h1>
          <h2 className="text-2xl font-black mb-12">Added blogs</h2>
          <ul>
            {user.blogs.map((blog) => {
              console.log(blog._id)
                return <li key={blog._id}><Link to={`/blogs/${blog._id}`}>{blog.title}</Link></li>
            })}
          </ul>
        </>
      )}
    </div>
  )
}

export default UserDetail
