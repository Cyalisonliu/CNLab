import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});
instance.interceptors.response.use(
    res => res,
    err =>  {
        throw new Error(err.response.data.msg);
    }
)

export default instance;
