import axios from 'axios'

const request = axios.create({
  baseURL: `https://652d5bcef9afa8ef4b275214.mockapi.io`,
  timeout: 20000,

})

export default request