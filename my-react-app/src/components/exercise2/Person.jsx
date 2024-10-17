import React from 'react';
import axios from 'axios';

function Person({ person, setPerson }) {
  const handleChangeImportant = (id) => {
    const url = `http://localhost:3001/persons/${id}`;
    const personSelected = person.find((p) => p.id === id);
    const changedImportant = {
      ...personSelected,
      important: !personSelected.important,
    };

    axios
      .put(url, changedImportant)
      .then((response) => {
        setPerson(person.map((p) => (p.id === id ? response.data : p)));
      })
      .catch((error) => {
        console.error('Error updating important', error);
        alert('Failed to update important. Please try again.');
      });
  };

  const handleDelete = (id, name) => {
    window.confirm(`Delete ${name} ?`);
    axios.delete(`http://localhost:3001/persons/${id}`).then((response) => {
      setPerson(person.filter((p) => p.id !== id));
    });
  };

  return (
    <>
      {person.map((p) => (
        <div key={p.id}>
          <p>
            {p.name} {p.number}
          </p>
          <button onClick={() => handleChangeImportant(p.id)}>
            Change important
          </button>
          <button onClick={() => handleDelete(p.id, p.name)}>Delete</button>
        </div>
      ))}
    </>
  );
}

export default Person;
