import ApiClient from "@/lib/apiClient";
import { DeleteFileResponse } from "../types/DeleteFile";

export const deleteFile = async (fileId: number): Promise<DeleteFileResponse> => {
  try {
    const response = await ApiClient.post<DeleteFileResponse>(`/filesoffice/delete/${fileId}`);
    return response.data;
  } catch (error) {
    throw new Error((error ).response?.data?.message || "Failed to delete teacher");
  }
};
