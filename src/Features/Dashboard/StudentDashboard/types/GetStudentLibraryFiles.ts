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
}

export interface FileCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
