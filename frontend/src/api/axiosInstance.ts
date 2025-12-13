import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});
