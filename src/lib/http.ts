import axios, { type AxiosInstance, type CancelTokenSource } from "axios";

const http: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-type": "application/json",
  },
  timeout: 20000,
});

http.interceptors.request.use((config) => {
  const source: CancelTokenSource = axios.CancelToken.source();
  const originalCancelToken = config.cancelToken;
  const signal = config?.signal;

  if (signal) {
    config.cancelToken = source.token;
    const abortHandler = () => {
      source.cancel("Operation canceled by the user");
      if (signal) {
        signal?.removeEventListener("abort", abortHandler);
      }
    };

    if (signal.aborted) {
      abortHandler();
    } else {
      signal?.addEventListener("abort", abortHandler);
    }
  }
  config.cancelToken = originalCancelToken || config.cancelToken;
  const token = localStorage.getItem("authjs.session-token");
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
