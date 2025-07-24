import { ApiResponse } from "@/lib/apiClient";

export interface Student {
  id: number;
  name: string;
  username: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: number;
  name: string;
  username: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponseData {
  token: string;
  type: "student" | "teacher" | "user";
  student?: Student;
  teacher?: Teacher;
  user?: AdminUser;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
