import axios, { type AxiosInstance } from "axios";

const http: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

/* ===========================
   Interceptors (INIT ONCE)
=========================== */

let interceptorsInitialized = false;

if (!interceptorsInitialized) {
  // REQUEST
  http.interceptors.request.use((config) => {
    // ✅ Solo en cliente
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("authjs.session-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // ❌ NO CancelToken
    // ❌ NO Abort listeners manuales
    // Axios ya soporta `signal` nativamente

    return config;
  });

  // RESPONSE
  http.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        return Promise.reject(error.response?.data ?? error.message ?? "Service Error");
      }
      return Promise.reject("Service Error");
    },
  );

  interceptorsInitialized = true;
}

export default http;
