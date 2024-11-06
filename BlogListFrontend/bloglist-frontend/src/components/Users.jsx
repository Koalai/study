import { Link } from "react-router-dom"

function Users({ users }) {
  return (
    <div>
      <h1 className="text-4xl font-black">User</h1>
      <table className="table-auto border-separate w-2/5 ">
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {          
            const url = `/users/${user.id}`           
            return (
              <tr key={user.id}>
                <td>
                  <Link to={`${url}`}>{user.name}</Link>
                </td>
                <td className="text-center">{user.blogs.length}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Users
