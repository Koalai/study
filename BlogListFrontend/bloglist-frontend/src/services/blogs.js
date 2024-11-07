import axios from 'axios';
const baseUrl = 'http://localhost:3000/api/blogs';
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const create = async (newObject) => {
  console.log(token);
  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
  } catch (error) {
    console.error(
      'Error creating blog:',
      error.response ? error.response.data : error.message
    );
  }
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const update = async (id, newObject) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, newObject);
    return response.data;
  } catch (error) {
    console.error('Failed to update blog:', error);
    throw error;
  }
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  await axios.delete(`${baseUrl}/${id}`, config);
};

export default { getAll, setToken, create, update, remove };
