const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const notesRouter = require('./controllers/notesRouter');
const middleware = require('./utils/middleware')

app.use(cors());
app.use(express.json());
app.use('/api/persons', notesRouter)
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :body')
);


mongoose.set('strictQuery', false);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message);
  });



module.exports = app