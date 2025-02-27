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

interface RegisterResponse {
    EC: number;
    userInfor: {
        email: string;
        name: string;
    }
}

interface User {
    _id: string;
    email: string;
    name: string;
    role: string;
  }


const createUserApi = (data:FormData): Promise<RegisterResponse> => {
    const URL_API = "v1/api/register";  
    return axios.post(URL_API,data)
}

const loginApi = (data: FormData): Promise<LoginResponse> => {
    const {email,password} = data;
    const URL_API = "v1/api/login";
    return axios.post(URL_API,{email,password})
}

const getUserApi = async (): Promise<User[]> => {
    const URL_API = "v1/api/user";
    //const response = await axios.get(URL_API);
    return await axios.get(URL_API);
    //console.log("API Response:", response);
};

export {
    createUserApi,loginApi,getUserApi
}