import { get, post } from "@/lib/apiClient";
import { LoginRequest, LoginResponse } from "../types/Login";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await post<LoginResponse, LoginRequest>("/login", data);
  // TODO:: REMOVE
  console.log(response.data);
  localStorage.setItem("token", response.data.data.token);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await get("/logout");
  // localStorage.clear();
};
