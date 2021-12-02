import axios from 'axios';

const tandaAPI = axios.create({
  //baseURL: 'http://localhost:3000'
  baseURL:'https://tanda-express.herokuapp.com'
})

export default tandaAPI;
