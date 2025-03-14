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
      userId : string
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

interface Question {
    QuestionID : string,
    QuestionType : string,
    Content1 : string,
    Content2 : string,
    ImagePath1 : string,
    ImagePath2 : string,
    Question1 : string,
    Question2 : string,
    Question3 : string,
    PreparationTime : number,
    ResponseTime : number,
    Suggestion1 : string,
    Suggestion2 : string
}

interface AnswerSP {
    UserID : string
    QuestionID : string,
    RecordingPath : string,
    ContentOfSpeaking : string
}

interface AnswerWR {
    UserID : string
    QuestionID : string,
    Content : string,
    Feedback : string
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

const getQuestionSPApi = async (questionid:any): Promise<Question> => {
    const URL_API = "v1/api/question/speaking";
    return await axios.get(URL_API, { params: { QuestionID: questionid } });
}

const getAnswerSPApi = async (userID:any, questionID:any) : Promise<AnswerSP> => {
    const URL_API = "v1/api/answer/speaking";
    return await axios.get(URL_API, { params: { UserID: userID,QuestionID: questionID } });
}

const saveAnswerSPApi = async (UserID:any,QuestionID:any,RecordingPath:any,ContentOfSpeaking:any) => {
    const URL_API = "v1/api/answer/create/speaking";
    return axios.post(URL_API,{UserID,QuestionID,RecordingPath,ContentOfSpeaking})
}

const getQuestionWRApi = async (questionid:any): Promise<Question> => {
    const URL_API = "v1/api/question/writing";
    return await axios.get(URL_API, { params: { QuestionID: questionid } });
}

const getAnswerWRApi = async (userID:any, questionID:any) : Promise<AnswerWR> => {
    const URL_API = "v1/api/answer/writing";
    return await axios.get(URL_API, { params: { UserID: userID,QuestionID: questionID } });
}

const saveAnswerWRApi = async (UserID:any,QuestionID:any,Content:any,Feedback:any) => {
    const URL_API = "v1/api/answer/create/writing";
    return axios.post(URL_API,{UserID,QuestionID,Content,Feedback})
}

export {
    createUserApi,loginApi,getUserApi,getQuestionSPApi,getAnswerSPApi,saveAnswerSPApi,getQuestionWRApi,getAnswerWRApi,saveAnswerWRApi
}