import { ApiResponse, post } from "@/lib/apiClient";
import { GetExamsResponse } from "../types/Exams";

export const GetExams = async (): Promise<GetExamsResponse> => {
  const response = await post<GetExamsResponse>("/exams/index");
  return response.data;
};
