export interface AddStudentRequest {
  name: string;
  username: string;
  password: string;
  password_confirmation: string;
  is_active: boolean;
}
export interface AddStudentResponse {
  message: string;
  status: number;
}