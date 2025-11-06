// src/api/authApi.ts
import axios from "axios";
import type { LoginPayload, RegisterPayload } from "@/types/apiPayloads";
import type { User, LoginResponse } from "@/types/apiResponse";

// Django backend base URL
const BASE_URL = "http://127.0.0.1:8000/api";

// --------------------------- AXIOS INSTANCE ---------------------------

export const authApi = axios.create({
  baseURL: `${BASE_URL}/auth/`,
  headers: { "Content-Type": "application/json" },
});

// --------------------------- API CALLS ---------------------------

// Login → returns { key }
export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const { data } = await authApi.post<LoginResponse>("login/", payload);
  return data;
};

// Registration
export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await authApi.post("registration/", payload);
  return data;
};

// Fetch current logged-in user (requires Token in Authorization header)
export const fetchUser = async (): Promise<User> => {
  const token = localStorage.getItem("token");
  const { data } = await authApi.get<User>("user/", {
    headers: token ? { Authorization: `Token ${token}` } : {},
  });
  return data;
};

// Logout (optional — just delete token client-side)
export const logoutUser = async (): Promise<void> => {
  await authApi.post("logout/");
};
