import React from 'react';

function AnecdoteForm({handleCreateNote}) {
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleCreateNote}>
        <div>
          <input name='note' />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  );
}

export default AnecdoteForm;
