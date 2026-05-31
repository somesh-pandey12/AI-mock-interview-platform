import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000', // Our backend Express server port
    withCredentials: true // Crucial! Allows sending cookies/sessions over cross-origin requests
});

export default API;