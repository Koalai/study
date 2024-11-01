import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/blogs'
let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const create = async (newObject) => {
  const config = {
    headers: {Authorization : token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const update = async (id, newObject) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, newObject);
    console.log("Update response:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Failed to update blog:", error);
    throw error;
  }
};


const remove = async (id) => {
  const config = {
    headers: { Authorization: token}
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}


export default { getAll, setToken, create, update, remove}