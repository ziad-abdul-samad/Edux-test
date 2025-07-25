import { post } from "@/lib/apiClient";
import { AxiosProgressEvent } from "axios";

// Update the file service to accept progress callback
export const addNewFile = async (
  formdata: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  return post("/filesoffice/store", formdata, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
};