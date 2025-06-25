import ApiClient from "@/lib/apiClient";
import { DeleteStudentResponse } from "../types/TeacherDash";

export const deleteStudent = async (studentId: number): Promise<DeleteStudentResponse> => {
  try {
    const response = await ApiClient.post<DeleteStudentResponse>(`/students/delete/${studentId}`);
    return response.data;
  } catch (error) {
    throw new Error((error ).response?.data?.message || "Failed to delete teacher");
  }
};
