import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, GET_DATABASE } from '../queries/queries' 

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])


  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    onCompleted: () => {
      setTitle('')
      setAuthor('')
      setPublished('')
      setGenres([])
      setGenre('')
    },
    refetchQueries: [{ query: GET_DATABASE }], 
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    try {
      await addBook({
        variables: {
          title,
          author,
          published: parseInt(published), 
          genres,
        },
      })
      console.log('Book added successfully!')
    } catch (err) {
      console.error('Error adding book:', err)
    }
  }

const addGenre = () => {
  if (genre && !genres.includes(genre)) {
    setGenres([...genres, genre]);
    setGenre(''); 
  } else {
    console.log('Genre already added or empty input');
  }
};

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button type="button" onClick={addGenre}>
            Add Genre
          </button>
        </div>
        <div>Genres: {genres.join(' ')}</div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding book...' : 'Create Book'}
        </button>
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      </form>
    </div>
  )
}

export default NewBook
