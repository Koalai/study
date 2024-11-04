import axios from 'axios'
import { getId } from '../reducers/anecdoteReducer'
const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
 const response = await axios.get(baseUrl)
 return response.data 
}

const createNew = async (content) => {
 const newObject = {
  content: content,
  id : getId(),
  votes: 0
 }
 const response = await axios.post(baseUrl, newObject)
 return response.data
}

const update = async (id, note) => {
 const updatedObject = {
  ...note,
  votes: note.votes + 1
 }

 const response = await axios.put(`${baseUrl}/${id}`, updatedObject)
 return response.data
}

export default {getAll, update, createNew}