import { ApiResponse, post } from "@/lib/apiClient";
import { StudentExamAnswersResponse } from "../types/Results";

export const GetResults = async (): Promise<StudentExamAnswersResponse> => {
  const response = await post<StudentExamAnswersResponse>("/exams/getStudentAnswers");
  return response.data;
};
