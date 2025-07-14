import { ApiResponse, post } from "@/lib/apiClient";
import { ActiveExamsResponse } from "../types/ActiveExams";

export const GetActiveExams = async (): Promise<ActiveExamsResponse> => {
  const response = await post<ActiveExamsResponse>("/exams/ActiveExams");
  return response.data;
};
