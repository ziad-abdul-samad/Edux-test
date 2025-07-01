import { ApiResponse, post } from "@/lib/apiClient";
import { AssignRequest, AssignResponse } from "../types/AssignSTT";

export const AssignStudent = async (
  AssignData: AssignRequest
): Promise<ApiResponse<AssignResponse>> => {
  const response = await post<
    ApiResponse<AssignResponse>,
    AssignRequest
  >("/students/assignStudentToTeacher", AssignData);
  return response.data;
};
