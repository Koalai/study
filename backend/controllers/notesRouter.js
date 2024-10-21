const Contact = require('../models/note')

const notesRouter = require('express').Router()

// GET all contacts
notesRouter.get('/', async (request, response) => {
  const contacts = await Contact.find({});
  response.json(contacts);
});

// GET information about the phonebook
notesRouter.get('/info', async (request, response) => {
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
notesRouter.get('/:id', async (request, response) => {
  const { id } = request.params;
  const person = await Contact.findById(id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: 'Person not found' });
  }
});

// DELETE a contact by ID
notesRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await Contact.findByIdAndDelete(id);
  response.status(204).end();
});

notesRouter.put('/:id', async (request, response, next) => {
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
notesRouter.post('/', async (request, response, next) => {
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

module.exports = notesRouter