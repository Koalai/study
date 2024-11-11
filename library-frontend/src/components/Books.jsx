import { useState } from "react"
const Books = ({show, books}) => {
  
  const [selectedGenre, setSelectedGenre] = useState('')
  
  if (!show) {
    return null
  }

  console.log(selectedGenre)

  const allGenres = Array.from(new Set(books.flatMap(book => book.genres)))
  
  const filteredBooks = (selectedGenre  && selectedGenre !== 'All genre') ? books.filter(book => book.genres.includes(selectedGenre)) : books

  return (
    <div>
      <h1>books</h1>
      <h2>Book filter by genre: {selectedGenre}</h2>
      <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
        <option>All genre</option>
        {allGenres.map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}

      </select>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
