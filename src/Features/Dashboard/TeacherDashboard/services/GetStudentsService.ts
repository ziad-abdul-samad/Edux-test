import { ApiResponse, post } from "@/lib/apiClient";
import { ApiResponseData } from "../types/TeacherDash";

export const GetStudents = async (): Promise<ApiResponse<ApiResponseData>> => {
  const response = await post<ApiResponse<ApiResponseData>>("/teachers/dashboard");
  return response.data;
};
