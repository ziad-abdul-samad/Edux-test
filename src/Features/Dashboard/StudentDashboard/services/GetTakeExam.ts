// src/Features/Student/services/GetTakeExam.ts
import { ApiResponse, post } from "@/lib/apiClient";
import { TakeExamResponse } from "../types/TakeExam";

export const GetTakeExam = async (id: number): Promise<TakeExamResponse> => {
  const response = await post<TakeExamResponse>(`/exams/startExam/${id}`);
  return response.data;
};
