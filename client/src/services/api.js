import axios from 'axios';

const API = axios.create({
  // Uses the env variable if it exists, otherwise falls back to localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor to attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/** * AUTH ENDPOINTS */
export const sendOtp = (data) => API.post('/auth/send-otp', data);
export const signIn = (data) => API.post('/auth/login', data);
export const verifyLoginOtp = (data) => API.post('/auth/verify-login-otp', data); 
export const signUp = (data) => API.post('/auth/register', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const changePassword = (data) => API.post('/auth/change-password', data);
export const getUserProfile = () => API.get('/auth/me');

/** * TRANSACTION ENDPOINTS */
export const getTransactions = (params) => {
  return API.get('/transactions', { params });
};
export const postTransaction = (data) => API.post('/transactions', data);

export default API;