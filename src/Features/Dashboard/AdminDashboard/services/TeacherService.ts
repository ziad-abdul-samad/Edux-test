import { get, post } from "@/lib/apiClient";
import { GetTeachersResponse } from "../types/Teachers";

export const getTeachers = async (): Promise<GetTeachersResponse["data"]> => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !role) {
    throw new Error("المستخدم غير مسجل دخول");
  }

  if (role !== "user") {
    throw new Error("غير مصرح لك بعرض هذه البيانات");
  }

  const response = await post<{ data: GetTeachersResponse["data"]; message: string; status: number }>(
    "/teachers/index"
  );

  return response.data.data; // unwrap here, return only the inner `data`
};
