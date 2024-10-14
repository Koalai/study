import React from 'react';

function ContactForm({
  person,
  setPerson,
  setNewName,
  setNewNumber,
  newName,
  newNumber,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      person.length > 0 &&
      person.some((p) => p.name === newName || p.number === newNumber)
    ) {
      alert('error');
      return;
    }

    setPerson((prev) => [
      ...prev,
      { name: newName, id: self.crypto.randomUUID(), number: newNumber },
    ]);
    setNewName("")
    setNewNumber("")
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
            type='number'
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Add</button>
      </form>
    </div>
  );
}

export default ContactForm;
