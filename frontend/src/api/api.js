import axios from "axios";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_BASE_URL;

const API = axios.create({
  baseURL: baseURL,
  withCredentials: true, // keeps cookies sent automatically if backend sets them
});

// ✅ Axios interceptor to attach token from js-cookie
API.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // get token from js-cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // attach it to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
