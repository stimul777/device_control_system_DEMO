import axios from 'axios';
import Qs from 'qs';
const instance = axios.create({
    baseURL: process.env.VUE_APP_SERVER_URL ? process.env.VUE_APP_SERVER_URL : window.location.origin,
    withCredentials: true,
    timeout: 10000,
    headers: {
        accept: 'application/json',
    },
    paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'repeat' }),
});

export default instance;
