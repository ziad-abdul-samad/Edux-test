import ApiClient from "@/lib/apiClient";
import { DeleteExamResponse } from "../types/DeleteExam";

export const DeleteExam = async (examId: number): Promise<DeleteExamResponse> => {
  try {
    const response = await ApiClient.post<DeleteExamResponse>(`/exams/delete/${examId}`);
    return response.data;
  } catch (error) {
    throw new Error((error ).response?.data?.message || "Failed to delete teacher");
  }
};
