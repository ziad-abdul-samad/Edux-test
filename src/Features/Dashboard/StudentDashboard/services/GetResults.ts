import { post } from "@/lib/apiClient";
import { ResultsResponse } from "../types/Results";

export const getResults = async (): Promise<ResultsResponse> => {
  const response = await post<ResultsResponse>("/exams/getStudentAnswers");
  return response.data;
};
