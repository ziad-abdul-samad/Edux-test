export interface Teacher {
  id: number;
  name: string;
  username: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  students_count: number;
  exams_count: number;
  exams: [];
  students: [];
}

export interface TeachersPagination {
  current_page: number;
  data: Teacher[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface GetTeachersResponse {
  data: {
    teachers: TeachersPagination;
    totalTeachers: number;
  };
  message: string;
  status: number;
}
export interface AddTeacherRequest {
  name: string;
  username: string;
  password: string;
  password_confirmation: string;
  is_active: boolean;
}
export interface AddTeacherResponse {
  message: string;
  status: number;
}
export interface DeleteTeacherResponse {
  message: string;
  status: number;
}
export interface ChangeActiveTeacher {
  data: Teacher;
  message: string;
  status: number;
}
export interface UpdateTeacherResponse {
  message:string;
  status: number;
}
export interface UpdateTeacherRequest {
  name:string;
  username: string;
}