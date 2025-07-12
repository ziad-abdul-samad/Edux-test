import { ApiResponse, post } from "@/lib/apiClient";
import {  UserInfoResponse } from "../types/LoginInfo";

export const LoginInfo = async (): Promise<UserInfoResponse> => {
  const response = await post<UserInfoResponse>("/auth/login");
  return response.data;
};
