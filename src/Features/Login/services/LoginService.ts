// src/Features/Login/services/LoginService.ts
import { get, post } from "@/lib/apiClient";
import { LoginRequest, LoginResponse } from "../types/Login";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await post<LoginResponse, LoginRequest>("/auth/login", data);
  const { token, type , username } = response.data.data;

  localStorage.setItem("token", token);
  localStorage.setItem("role", type);
  localStorage.setItem("username", username);

  return response.data;
};

export const logout = async (): Promise<void> => {
  await get("/logout");
  localStorage.clear();
};
