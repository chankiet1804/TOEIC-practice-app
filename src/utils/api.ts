import axios from './axios.customize'

interface FormData {
    name: string;
    email: string;
    password: string;
}

const createUserApi = (data:FormData) => {
    const URL_API = "v1/api/register";  
    return axios.post(URL_API,data)
}

export {
    createUserApi
}