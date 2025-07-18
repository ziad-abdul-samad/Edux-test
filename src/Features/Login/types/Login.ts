import { ApiResponse } from "@/lib/apiClient";

export interface LoginResponseData {
  token: string;
  type: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
