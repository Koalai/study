const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./note');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :body')
);

// GET all contacts
app.get('/api/persons', async (request, response) => {
  const contacts = await Contact.find({});
  response.json(contacts);
});

// GET information about the phonebook
app.get('/info', async (request, response) => {
  const count = await Contact.countDocuments({});
  response.send(`
  <div>
   <h1>Phonebook has info for ${count} contacts</h1>
   <br/>
   <h1>${new Date()}</h1>
  </div>
  `);
});

// GET a specific contact by ID
app.get('/api/persons/:id', async (request, response) => {
  const { id } = request.params;
  const person = await Contact.findById(id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: 'Person not found' });
  }
});

// DELETE a contact by ID
app.delete('/api/persons/:id', async (request, response) => {
  const { id } = request.params;
  await Contact.findByIdAndDelete(id);
  response.status(204).end();
});

app.put('/api/persons/:id', async (request, response, next) => {
  const { id } = request.params;
  const { important } = request.body;

  const updatedPerson = {
    important,
  };

  try {
    const result = await Contact.findByIdAndUpdate(id, updatedPerson, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      return response.status(404).json({ error: 'Person not found' });
    }
    response.json(result);
  } catch (error) {
    next(error);
  }
});

// POST a new contact
app.post('/api/persons', async (request, response, next) => {
  const { body } = request;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' });
  }

  try {
    const nameExists = await Contact.findOne({ name: body.name });
    if (nameExists) {
      return response.status(400).json({ error: 'name must be unique' });
    }

    const newPerson = new Contact({
      name: body.name,
      number: body.number,
      important: body.important,
    });

    const savedPerson = await newPerson.save();
    response.json(savedPerson);
    
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
