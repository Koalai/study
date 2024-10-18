const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('dotenv').config();



if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}


const password = process.argv[2];
const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});


const Contact = mongoose.model('Contact', personSchema);


if (process.argv.length === 5) {
  const person = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });

 
  person
    .save()
    .then(() => {
      console.log(`added ${person.name} number ${person.number} to phonebook`);
      mongoose.connection.close(); 
    })
    .catch((error) => {
      console.error('Error saving the contact:', error.message);
      mongoose.connection.close();
    });
} else {

  app.get('/api/persons', (request, response) => {
    Contact.find({})
      .then((people) => {
        response.json(people);
      })
      .catch((error) => {
        response.status(500).send({ error: 'Error fetching contacts' });
      });
  });

 
  const PORT = process.env.PORT ; 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
