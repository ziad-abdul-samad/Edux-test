import ApiClient from "@/lib/apiClient";
import { DeleteCategoryResponse } from "../types/DeleteCategory";

export const DeleteCategory = async (categoryId: number): Promise<DeleteCategoryResponse> => {
  try {
    const response = await ApiClient.post<DeleteCategoryResponse>(`/filescategory/delete/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error((error ).response?.data?.message || "Failed to delete teacher");
  }
};
