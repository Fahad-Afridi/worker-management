import axios, { Axios } from "axios";
import { error } from "console";
import { response } from "express";

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Request Interceptor 
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('access_token');
    if(token){
        config.headers.Authorization= `Bearer ${token}`;
    }
    return config;
});

//Response Interceptor
api.interceptors.response.use(
    (response)=> response,
    (error) =>{
        if(error.response?.status === 401){
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login'; //redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;