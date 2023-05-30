import axios from 'axios';

const instance = axios.create({
    // baseURL: process.env.REACT_APP_BACKEND_URL,
    baseURL: "http://localhost:5001",
});
instance.interceptors.response.use(
    res => res,
    err =>  {
        throw new Error(err.response.data.msg);
    }
)

export default instance;
