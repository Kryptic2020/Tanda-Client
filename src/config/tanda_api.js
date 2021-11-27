import axios from 'axios';

const tandaAPI = axios.create({
  baseURL:'http://localhost:3000'
})

export default tandaAPI;