import axios from './axios.customize'

interface FormData {
    name: string;
    email: string;
    password: string;
}

interface LoginResponse {
    EC: number;
    access_token: string;
    user: {
      email: string;
      name: string;
    };
  }

const createUserApi = (data:FormData) => {
    const URL_API = "v1/api/register";  
    return axios.post(URL_API,data)
}

const loginApi = (data: FormData): Promise<LoginResponse> => {
    const {email,password} = data;
    const URL_API = "v1/api/login";
    return axios.post(URL_API,{email,password})
}

export {
    createUserApi,loginApi
}