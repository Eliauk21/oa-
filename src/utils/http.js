import axios from 'axios';
import storage from './storage';

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000
})

instance.interceptors.request.use(config => {
  config.headers['Authorization'] = storage.get('users')?.accessToken;
  return config
}, error => {
  return Promise.reject(error)
})

let http = {
  get(url, data){
    return instance.get(url, {
      params: data
    });
  },
  post(url, data){
    return instance.post(url, data);
  },
  delete(url, data){
    return instance.delete(url, {
      data
    });
  },
  patch(url, data){
    return instance.patch(url, data);
  }
};

export default http;