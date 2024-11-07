import { Link } from "react-router-dom"

function Menu() {
  return (
    <div className="flex gap-8">
      <Link
        to="/users"
        className="bg-slate-400 px-2 py-1 text-white rounded-md"
      >
        All User
      </Link>
      <Link
        to="/create"
        className="bg-slate-400 px-2 py-1 text-white rounded-md"
      >
        Create
      </Link>
      <Link
        to="/"
        className="bg-slate-400 px-2 py-1 text-white rounded-md"
      >
        Blog list
      </Link>
    </div>
  )
}

export default Menu
