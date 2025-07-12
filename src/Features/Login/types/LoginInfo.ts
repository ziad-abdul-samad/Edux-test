export interface UserInfoResponse {
  data: {
    token: string;
    type: string;
    [key: string]: string; // allows keys like "0" to exist without error
  };
  message: string;
  status: number;
}

export interface UserData {
  id: number;
  name: string;
  username: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}
