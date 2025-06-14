import { ApiResponse, post } from "@/lib/apiClient";
import { AddTeacherRequest, AddTeacherResponse } from "../types/Teachers";

export const addNewTeacher = async (
  teacherData: AddTeacherRequest
): Promise<ApiResponse<AddTeacherResponse>> => {
  const response = await post<
    ApiResponse<AddTeacherResponse>,
    AddTeacherRequest
  >("/teachers/register", teacherData);
  return response.data;
};
