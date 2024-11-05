import PropTypes from 'prop-types'

function Anecdote({anecdote}) {
  return (
      <div>
          <h1>{anecdote.content}</h1>
          <h2>{anecdote.author}</h2>
          <h3>{anecdote.info}</h3>
    </div>
  )
}

export default Anecdote

Anecdote.propTypes = {
    anecdote: PropTypes.object.isRequired
}