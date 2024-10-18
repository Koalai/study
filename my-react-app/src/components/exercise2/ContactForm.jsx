import React, { useState } from 'react';
import axios from 'axios';

function ContactForm({ person, setPerson }) {
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [priority, setPriority] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (person.length > 0 && person.some((p) => p.name === newName)) {
      window.confirm(
        `${newName} is already added to phonebook, do you want to replace the old number with a new one ?`
      );

      const personSelected = person.find((p) => p.name === newName);
      const numberChanged = { ...personSelected, number: newNumber };

      axios
        .put(
          `http://localhost:3001/api/persons/${personSelected.id}`,
          numberChanged
        )
        .then((response) => {
          setPerson(
            person.map((p) => (p.name === newName ? response.data : p))
          );
        });
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      important: priority,
      id: self.crypto.randomUUID(),
    };

    axios
      .post('http://localhost:3001/api/persons', newPerson)
      .then((response) => {
        setPerson(person.concat(response.data));
      })
      .catch((error) => {
        console.error('Error adding new person', error);
        alert('Failed to add person. Please try again.');
      });
    setNewName('');
    setNewNumber('');
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          name:{' '}
          <input
            type='text'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </div>
        <div>
          number:{' '}
          <input
            type='tel'
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type='checkbox'
            onChange={(e) => setPriority(e.target.checked)}
          />
        </div>
        <button type='submit'>Add</button>
      </form>
    </div>
  );
}

export default ContactForm;
