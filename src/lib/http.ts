import axios, { AxiosInstance } from "axios";

const http: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-type": "application/json",
  },
  timeout: 20000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data || "Service Error");
  },
);
export default http;
