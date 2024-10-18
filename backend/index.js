const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();

let contacts = [
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

app.use(cors())
app.use(express.json());
app.use(morgan('tiny'));

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :body')
);

app.get('/api/persons', (request, response) => {
  response.json(contacts);
});

app.get('/info', (request, response) => {
  response.send(`
  <div>
   <h1>Phonebook has info for ${contacts.length} contacts</h1>
   </br>
   <h1>${new Date()}</h1>
  </div>
  `);
});

app.get('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  const person = contacts.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: 'Person not found' });
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  contacts = contacts.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const { body } = request;

  if (!body.name || !body.number) {
    response.status(404).json({ error: 'name or number missing' });
  }

  const nameExists = contacts.some((person) => person.name === body.name);
  if (nameExists) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: crypto.randomUUID(),
  };

  contacts = contacts.concat(newPerson);
  response.json(contacts);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
