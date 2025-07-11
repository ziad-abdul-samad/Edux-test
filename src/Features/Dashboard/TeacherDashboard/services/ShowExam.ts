import { post } from "@/lib/apiClient";
import { ExamDetailResponse } from "../types/ShowExam";

export const ShowExam = async (id: number): Promise<ExamDetailResponse> => {
  const response = await post<ExamDetailResponse>(`/exams/show/${id}`);
  return response.data;
};
