import { useEffect, useState } from 'react';
import Filter from './components/exercise2/Filter';
import ContactForm from './components/exercise2/ContactForm';
import Person from './components/exercise2/Person';
import axios from 'axios';

const App = () => {
  const [person, setPerson] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/persons')
      .then((response) => {
        setPerson(response.data);
      })
      .catch((error) => {
        console.error('Error get person data', error);
        alert('Failed to upload person data. Please try again.');
      });
  }, []);

  const filteredPerson = filterName
    ? person.filter((p) => p.name === filterName)
    : person;

  return (
    <>
      <h1>Phonebook</h1>
      {error && (
        <p style={{color: 'red'}}>{error}</p>
      )}
      <Filter filterName={filterName} setFilterName={setFilterName} />
      <h1>Add a new contact</h1>
      <ContactForm setPerson={setPerson} person={person} setError={setError} />
      <h1>Contact</h1>
      <Person person={filteredPerson} setPerson={setPerson} />
    </>
  );
};

export default App;
