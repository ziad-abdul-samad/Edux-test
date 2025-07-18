import { ApiResponse, post } from "@/lib/apiClient";
import { AddCategoryRequest, AddCategoryResponse } from "../types/NewCategory";

export const addNewCategory = async (
  categoryData: AddCategoryRequest
): Promise<ApiResponse<AddCategoryResponse>> => {
  const response = await post<
    ApiResponse<AddCategoryResponse>,
    AddCategoryRequest
  >("/filescategory/store", categoryData);
  return response.data;
};
