import { ApiResponse, post } from "@/lib/apiClient";
import { StudentResultsByTeacherResponse } from "../types/Subscriptions";

export const GetSubs = async (): Promise<StudentResultsByTeacherResponse> => {
  const response = await post<StudentResultsByTeacherResponse>("/students/Subscriptions");
  return response.data;
};
