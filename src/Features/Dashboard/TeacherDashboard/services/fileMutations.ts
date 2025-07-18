import { post } from "@/lib/apiClient";

export const addNewFile = async (data: FormData) => {
  return post("/filesoffice/store", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteFile = async (id: number) => {
  return post(`/filesoffice/delete/${id}`);
};
