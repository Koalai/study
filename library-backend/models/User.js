const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true, 
  },
  favoriteGenre: {
    type: String,
    required: true,
  }, 
  passwordHash: {
   type: String
  }
});

const User = mongoose.model('User', schema);

module.exports = User;
