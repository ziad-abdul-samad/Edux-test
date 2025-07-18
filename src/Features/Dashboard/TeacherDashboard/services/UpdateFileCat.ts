import { ApiResponse, post } from "@/lib/apiClient";
import { UpdateFileCatRequest, UpdateFileCatResponse } from "../types/UpdateFileCat";

export const UpdateFileCat = async (
  data: UpdateFileCatRequest & { id: number }
): Promise<ApiResponse<UpdateFileCatResponse>> => {
  const response = await post<ApiResponse<UpdateFileCatResponse>, UpdateFileCatRequest>(
    `/filesoffice/update/${data.id}`,
    {
      category_id: data.category_id,
    }
  );
  return response.data;
};
