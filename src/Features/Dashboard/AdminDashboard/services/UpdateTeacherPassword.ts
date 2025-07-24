import { ApiResponse, post } from "@/lib/apiClient";
import { UpdatePassRequest, UpdatePassResponse } from "../types/UpdatePassword";

export const changeTeacherPassword = async (
  teacherId: number,
  data: UpdatePassRequest
): Promise<ApiResponse<UpdatePassResponse>> => {
  const response = await post<ApiResponse<UpdatePassResponse>, UpdatePassRequest>(
    `/teachers/update-password/${teacherId}`,
    data
  );
  return response.data;
};
