import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import { EDIT_BIRTHYEAR, GET_DATABASE } from "../queries/queries"

const Authors = ({ show, authors }) => {
  const [selectedAuthor, setSelectedAuthor] = useState("")
  const [birthYear, setBirthYear] = useState("")

  const [editAuthor] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: GET_DATABASE }],
    onError: (error) => {
      console.error("Error updating birth year:", error)
      alert("Error updating birth year. Please try again.")
    },
  })

  if (!show) {
    return null
  }

  if (!authors) {
    return <div>Authors is undefined</div>
  }

  const handleAuthorChange = (event) => {
    setSelectedAuthor(event.target.value)
  }

  const handleBirthYearChange = (event) => {
    setBirthYear(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!selectedAuthor || !birthYear || isNaN(birthYear)) {
      alert("Please select an author and enter a valid birth year.")
      return
    }

    editAuthor({
      variables: {
        name: selectedAuthor,
        setBornTo: parseInt(birthYear, 10),
      },
    })

    setSelectedAuthor("")
    setBirthYear("")
  }

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h1>Set birthyear</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="author">Select Author:</label>
            <select
              id="author"
              value={selectedAuthor}
              onChange={handleAuthorChange}
            >
              <option value="">-- Choose an Author --</option>
              {authors.map((author) => (
                <option key={author.name} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="birthYear">New Birth Year:</label>
            <input
              id="birthYear"
              type="number"
              value={birthYear}
              onChange={handleBirthYearChange}
              placeholder="Enter new birth year"
            />
          </div>

          <button type="submit">Update Birth Year</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
