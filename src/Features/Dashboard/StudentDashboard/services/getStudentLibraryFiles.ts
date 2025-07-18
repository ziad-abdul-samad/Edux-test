import { ApiResponse,  post } from "@/lib/apiClient";
import { GetStudentLibraryFilesResponse } from "../types/GetStudentLibraryFiles";

export const getStudentLibraryFiles = async (): Promise<ApiResponse<GetStudentLibraryFilesResponse>> => {
  const response = await post<ApiResponse<GetStudentLibraryFilesResponse>>("/filesoffice/index");
  return response.data;
};
