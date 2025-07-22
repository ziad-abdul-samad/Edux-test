export interface Teacher {
  id: number;
  name: string;
  username: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Exam {
  id: number;
  title: string;
  attempt_limit: string;
  description: string;
  duration_minutes: number;
  is_active: number;
  allow_review: number;
  is_scheduled: number;
  start_at: string | null;
  end_at: string | null;
  teacher_id: number;
  created_at: string;
  updated_at: string;
  questions_count: number;
  attemptsCount: number;
  teacher: Teacher;
}

export interface ActiveExamsResponse {
  data: {
    exams: Exam[];
  };
  message: string;
  status: number;
}