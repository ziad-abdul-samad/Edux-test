import { ApiResponse, post } from "@/lib/apiClient";
import { PublishedFilesResponse } from "../types/PublishedFilesResponse";

export const getPublishedFiles = async (): Promise<PublishedFilesResponse[]> => {
  const response = await post<PublishedFilesResponse[]>("/filesoffice/index");
  return response.data;
};
