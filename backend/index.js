const express = require('express');
const morgan = require('morgan');
const app = express();

let people = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.use(express.json());
app.use(morgan('tiny'));

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :body')
);

app.get('/api/person', (request, response) => {
  response.json(people);
});

app.get('/info', (request, response) => {
  response.send(`
  <div>
   <h1>Phonebook has info for ${people.length} people</h1>
   </br>
   <h1>${new Date()}</h1>
  </div>
  `);
});

app.get('/api/person/:id', (request, response) => {
  const { id } = request.params;
  const person = people.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: 'Person not found' });
  }
});

app.delete('/api/person/:id', (request, response) => {
  const { id } = request.params;
  people = people.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post('/api/person', (request, response) => {
  const { body } = request;

  if (!body.name || !body.number) {
    response.status(404).json({ error: 'name or number missing' });
  }

  const nameExists = people.some((person) => person.name === body.name);
  if (nameExists) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: crypto.randomUUID(),
  };

  people = people.concat(newPerson);
  response.json(people);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
