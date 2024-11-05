import { useState } from "react"

export const CreateNew = ({addNew, notiDispatch}) => {
    const [content, setContent] = useState('')
    const [author, setAuthor] = useState('')
    const [info, setInfo] = useState('')
  
  
    const handleSubmit = (e) => {
      e.preventDefault()
      addNew({
        content,
        author,
        info,
        votes: 0
      })
      notiDispatch({ type: "SET_NOTIFICATION", payload: `${content} written by ${author} has been created` })
      setTimeout(() => {
        notiDispatch({type: "CLEAR_NOTIFICATION"})
      }, 4000)
    }
  
    return (
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={handleSubmit}>
          <div>
            content
            <input name='content' value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div>
            author
            <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div>
            url for more info
            <input name='info' value={info} onChange={(e)=> setInfo(e.target.value)} />
          </div>
          <button>create</button>
        </form>
      </div>
    )
  
  }