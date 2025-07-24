import { ApiResponse, post } from "@/lib/apiClient";
import { UpdatePassRequest, UpdatePassResponse } from "../types/UpdateStudentPassword";

export const changeStudentPassword = async (
  studentId: number,
  data: UpdatePassRequest
): Promise<ApiResponse<UpdatePassResponse>> => {
  const response = await post<ApiResponse<UpdatePassResponse>, UpdatePassRequest>(
    `/students/update-password/${studentId}`,
    data
  );
  return response.data;
};
