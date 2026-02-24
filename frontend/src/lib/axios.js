import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api", // Configured in vite.config.js
  withCredentials: true,
});
