import { post } from "@/lib/apiClient";
import { SubscriptionsResponse } from "../types/Subscriptions";

export const GetSubscriptions = async (): Promise<SubscriptionsResponse> => {
  const response = await post<SubscriptionsResponse>("/students/Subscriptions");
  return response.data;
};
