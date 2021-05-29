import axios from 'axios';

const instance = axios.create({
    baseURL:"https://mern-stack-whatsapp.herokuapp.com/",
})

export default instance;