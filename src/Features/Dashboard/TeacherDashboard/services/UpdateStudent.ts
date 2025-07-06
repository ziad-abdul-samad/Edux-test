import { ApiResponse, post } from "@/lib/apiClient";
import { UpdateStudentRequest, UpdateStudentResponse } from "../types/UpdateStudent";

export const UpdateStudent = async (
  data: UpdateStudentRequest & { id: number }
): Promise<ApiResponse<UpdateStudentResponse>> => {
  const response = await post<ApiResponse<UpdateStudentResponse>, UpdateStudentRequest>(
    `/students/update/${data.id}`,
    {
      name: data.name,
      username: data.username,
    }
  );
  return response.data;
};
