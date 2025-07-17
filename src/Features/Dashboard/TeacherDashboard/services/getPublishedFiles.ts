import { ApiResponse, post } from "@/lib/apiClient";
import { PublishedFilesResponse } from "../types/PublishedFilesResponse";

export const getPublishedFiles = async (): Promise<ApiResponse<PublishedFilesResponse>> => {
  const response = await post<ApiResponse<PublishedFilesResponse>>("/filesoffice/index");
  return response.data;
};
