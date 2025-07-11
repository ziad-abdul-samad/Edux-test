export interface Exam {
  id: number;
  title: string;
  attempt_limit: string;
  description: string;
  duration_minutes: number | null;
  is_active: number;
  allow_review: number;
  is_scheduled: number;
  start_at: string;
  end_at: string;
  teacher_id: number;
  created_at: string;
  updated_at: string;
  questions_count: number;
}

export interface GetExamsResponse {
  data: {
    exams: {
      data: Exam[];
    };
  };
  message: string;
  status: number;
}
