import axios from 'axios';

const instance = axios.create({
  baseURL: "https://eko-gas-stations.firebaseio.com"
});

export default instance;