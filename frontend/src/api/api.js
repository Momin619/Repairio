import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4500/api",
  withCredentials: true,
});

export const setToken = (token) => {
  if (token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete API.defaults.headers.common["Authorization"];
};
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // always up-to-date
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default API;
