import { ApiResponse, post } from "@/lib/apiClient";
import { UpdateCategoryRequest, UpdateCategoryResponse } from "../types/UpdateCategory";

export const UpdateCategory = async (
  data: UpdateCategoryRequest & { id: number }
): Promise<ApiResponse<UpdateCategoryResponse>> => {
  const response = await post<ApiResponse<UpdateCategoryResponse>, UpdateCategoryRequest>(
    `/filescategory/update/${data.id}`,
    {
      name: data.name,
    }
  );
  return response.data;
};
