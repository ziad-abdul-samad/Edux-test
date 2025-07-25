import {  post } from "@/lib/apiClient";
import { LoginRequest, LoginResponse } from "../types/Login";
import axios from "axios";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await post<LoginResponse, LoginRequest>("/auth/login", data);
  const { token, type, student, teacher, user } = response.data.data;

  localStorage.setItem("token", token);
  localStorage.setItem("role", type);

  // Save the corresponding user object
  const userObject = type === "student" ? student : type === "teacher" ? teacher : user;
  localStorage.setItem("user", JSON.stringify(userObject));

  return response.data;
};

export const logout = async (): Promise<void> => {
  await axios.get("/logout");
  localStorage.clear();
};
