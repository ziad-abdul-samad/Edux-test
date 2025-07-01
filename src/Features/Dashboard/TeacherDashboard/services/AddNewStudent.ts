import { ApiResponse, post } from "@/lib/apiClient";
import { AddStudentRequest, AddStudentResponse } from "../types/NewStudent";

export const addNewStudent = async (
  studentData: AddStudentRequest
): Promise<ApiResponse<AddStudentResponse>> => {
  const response = await post<
    ApiResponse<AddStudentResponse>,
    AddStudentRequest
  >("/students/register", studentData);
  return response.data;
};
