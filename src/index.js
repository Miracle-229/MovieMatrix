import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContextProvider } from './Context/AuthContext';
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));
let failedQueue = [];
let isRefreshing = false;
axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    originalRequest.headers = JSON.parse(
      JSON.stringify(originalRequest.headers || {})
    );
    const refreshToken = localStorage.getItem('refreshToken');

    if (
      refreshToken &&
      error.response?.status === 401 &&
      originalRequest?.url !== 'http://localhost:8080/api/auth/refresh' &&
      originalRequest?._retry !== true
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      isRefreshing = true;
      originalRequest._retry = true;
      originalRequest._retry = true;
      return axios
        .post('http://localhost:8080/api/auth/refresh', {
          refreshToken: refreshToken,
        })
        .then((res) => {
          localStorage.setItem('accessToken', res?.data['accessToken']);
          localStorage.setItem('refreshToken', res?.data['refreshToken']);

          return axios(originalRequest);
        })
        .catch(() => {
          window.location.href = '/';
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    if (error.response?.status === 401) {
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
