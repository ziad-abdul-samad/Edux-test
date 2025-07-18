export interface AddFileRequest {
  file: File;
  category_id: number;
}
export interface AddFileResponse {
  message: string;
  status: number;
}
