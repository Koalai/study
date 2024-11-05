import { useReducer, useState } from "react"
import { Menu } from "./components/Menu"
import { AnecdoteList } from "./components/AnecdoteList"
import { About } from "./components/About"
import { CreateNew } from "./components/CreateNew"
import { Footer } from "./components/Footer"
import {
  Routes,
  Route,
  useMatch,
} from "react-router-dom"
import Anecdote from "./components/Anecdote"
import Notification from "./components/Notification"
import { notificationReducer } from "./reducers/notification"

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1,
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2,
    },
  ])

  const match = useMatch("/anecdotes/:id")
  const anecdote = match
    ? anecdotes.find((a) => a.id === Number(match.params.id))
    : {}
  const [noti, notiDispatch] = useReducer(notificationReducer, { message: '' })
  

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    }

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)))
  }

  return (
    <>
      <div>
        <h1>Software Anecdotes</h1>
        <Menu />
        <Notification noti={noti.message} />
        <Routes>
          <Route
            path="/anecdotes"
            element={<AnecdoteList anecdotes={anecdotes} />}
          />
          <Route path="/create" element={<CreateNew addNew={addNew} notiDispatch={notiDispatch} />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/anecdotes/:id"
            element={<Anecdote anecdote={anecdote} />}
          />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
