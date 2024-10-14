import { useState } from 'react';
import Filter from './components/exercise2/Filter';
import ContactForm from './components/exercise2/ContactForm';
import Person from './components/exercise2/Person';

const App = () => {
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [person, setPerson] = useState([]);
  const [filterName, setFilterName] = useState('');

  const filteredPerson = filterName
    ? person.filter((p) => p.name === filterName)
    : person;

  return (
    <>
      <h1>Phonebook</h1>
      <Filter filterName={filterName} setFilterName={setFilterName} />
      <h1>Add a new contact</h1>
      <ContactForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        setPerson={setPerson}
        person={person}
      />
      <h1>Contact</h1>
      <Person person={filteredPerson}/>
    </>
  );
};

export default App;
