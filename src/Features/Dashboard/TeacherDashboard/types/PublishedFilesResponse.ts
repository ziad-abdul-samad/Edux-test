export interface PublishedFilesResponse {
  data: PublishedFile[];
  message: string;
  status: number;
}

export interface PublishedFile {
  id: number;
  teacher_id: number;
  category_id: number;
  file: string;
  created_at: string;
  updated_at: string;
  files_category: FilesCategory;
}

export interface FilesCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
