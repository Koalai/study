
import useField from "../hooks"

export const CreateNew = ({addNew, notiDispatch}) => {

  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  


    const handleSubmit = (e) => {
      e.preventDefault()
      addNew({
        content: content.value,
        author:author.value,
        info: info.value,
        votes: 0
      })
      console.log()
      notiDispatch({ type: "SET_NOTIFICATION", payload: `${content.value} written by ${author.value} has been created` })
      setTimeout(() => {
        notiDispatch({type: "CLEAR_NOTIFICATION"})
      }, 4000)
    }
  
  const handleReset = () => {
    content.reset();
    author.reset();
    info.reset()
  }
  
    return (
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={handleSubmit}>
          <div>
            content
            <input {...content} />
          </div>
          <div>
            author
            <input {...author} />
          </div>
          <div>
            url for more info
            <input {...info} />
          </div>
          <button type="submit">create</button>
          <button type="button" onClick={handleReset}>reset</button>
        </form>
      </div>
    )
  
  }