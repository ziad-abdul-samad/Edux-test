import { ApiResponse, post } from "@/lib/apiClient";
import { UpdateTeacherRequest, UpdateTeacherResponse } from "../types/Teachers";

export const UpdateTeacher = async (
  data: UpdateTeacherRequest & { id: number }
): Promise<ApiResponse<UpdateTeacherResponse>> => {
  const response = await post<ApiResponse<UpdateTeacherResponse>, UpdateTeacherRequest>(
    `/teachers/update/${data.id}`,
    {
      name: data.name,
      username: data.username,
    }
  );
  return response.data;
};
