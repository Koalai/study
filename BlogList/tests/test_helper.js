const Blog = require('../models/blog')
const User = require('../models/user')


const nonExistingId = async () => {
  const note = new Blog({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const notesInDb = async () => {
  const notes = await Blog.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  nonExistingId, notesInDb, usersInDb
}