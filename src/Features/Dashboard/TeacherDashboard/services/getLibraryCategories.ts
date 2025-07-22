import { ApiResponse, post } from "@/lib/apiClient";
import { LibraryCategoryResponse } from "../types/LibraryCategoryResponse";

export const getLibraryCategories =
  async (): Promise<LibraryCategoryResponse> => {
    const response = await post<LibraryCategoryResponse>(
      "/filescategory/indexTeacher"
    );
    return response.data;
  };
