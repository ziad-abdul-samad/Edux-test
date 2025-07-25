// src/lib/apiClient.ts
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
    AxiosProgressEvent,
} from "axios";

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

const apiClient = axios.create({
  baseURL: "https://edux.site/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error) => {
    return Promise.reject(error);
  }
);



export const post = <T, U = unknown>(
  url: string,
  data?: U,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => apiClient.post<T>(url, data, config);

export interface ProgressConfig extends AxiosRequestConfig {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export default {
  post
};
