import { ApiResponse, post } from "@/lib/apiClient";

export const addNewFile = async (formdata: FormData) => {
  return post("/filesoffice/store", formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
