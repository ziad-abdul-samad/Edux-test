// export interface Pivot {
//   teacher_id: number;
//   student_id: number;
// }

// export interface Student {
//   id: number;
//   name: string;
//   username: string;
//   is_active: number;
//   created_at: string;
//   updated_at: string;
//   pivot: Pivot;
// }



export interface ApiResponseData {
  studentCount: number;
//   students: Student[];
  examCount: number;
}

export interface ApiResponse {
  data: ApiResponseData;
  message: string;
  status: number;
}
