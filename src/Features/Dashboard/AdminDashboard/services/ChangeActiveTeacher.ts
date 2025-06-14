import { ApiResponse, post } from "@/lib/apiClient";
import { ChangeActiveTeacher } from "../types/Teachers";

export const changeActiveTeacherFunc = async (
  teacherId: number,
  isActive: boolean
): Promise<ApiResponse<ChangeActiveTeacher>> => {
  try {
    const response = await post<ApiResponse<ChangeActiveTeacher>>(
      `/teachers/updateIsActive/${teacherId}`,
      { is_active: isActive }
    );
    return response.data;
  } catch (error) {
    console.error("Error changing teacher active status:", error);
    throw error;
  }
};
