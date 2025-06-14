import ApiClient from "@/lib/apiClient";
import { DeleteTeacherResponse } from "@/Features/Dashboard/AdminDashboard/types/Teachers"; // Ensure correct path

export const deleteTeacher = async (teacherId: number): Promise<DeleteTeacherResponse> => {
  try {
    const response = await ApiClient.post<DeleteTeacherResponse>(`/teachers/delete/${teacherId}`);
    return response.data;
  } catch (error) {
    throw new Error((error ).response?.data?.message || "Failed to delete teacher");
  }
};
