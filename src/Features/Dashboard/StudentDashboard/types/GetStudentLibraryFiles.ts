export interface GetStudentLibraryFilesResponse {
  data: StudentFile[];
  message: string;
  status: number;
}

export interface StudentFile {
  id: number;
  teacher_id: number;
  category_id: number;
  file: string;
  created_at: string;
  updated_at: string;
  files_category: FileCategory;
  teacher: Teacher;
}

export interface FileCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface Teacher {
  id: number;
  name: string;
  username: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}