import { ApiResponse, post } from "@/lib/apiClient";
import { StudentDashboardResponse } from "../types/studentDash";

export const GetStudentDash = async (): Promise<StudentDashboardResponse> => {
  const response = await post<StudentDashboardResponse>("/students/dashboard");
  return response.data;
};
