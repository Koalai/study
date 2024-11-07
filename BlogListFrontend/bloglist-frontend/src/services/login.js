import axios from 'axios';
const baseUrl = 'http://localhost:3000/api';

const login = async (credentials) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getUser = async () => {
  const response = await axios.get('/api/users');
  return response.data;
};
export default { login, getUser };
