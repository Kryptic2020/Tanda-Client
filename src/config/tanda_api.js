import axios from 'axios';

const tandaAPI = axios.create({
  baseURL:'https://tanda-express.herokuapp.com'
})

export default tandaAPI;