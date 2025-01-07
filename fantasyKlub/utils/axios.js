import axios from 'axios';

const axio = axios.create({
  baseURL: 'http://192.168.1.27:3000', // Cambia esto por la URL de tu servidor
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axio;