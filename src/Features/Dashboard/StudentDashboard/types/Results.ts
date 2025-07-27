export interface ResultsResponse {
  data: ExamResult[];
  message: string;
  status: number;
}

export interface ExamResult {
  exam: ExamDetails;
  submitted_at: string; // ISO timestamp
  answers: AnswerResult[];
}

export interface ExamDetails {
  id: number;
  title: string;
  attempt_limit: string;
  description: string | null;
  duration_minutes: number | null;
  is_active: number;
  allow_review: number;
  is_scheduled: number;
  start_at: string | null;
  end_at: string | null;
  teacher_id: number;
  created_at: string;
  updated_at: string;
}

export interface AnswerResult {
  question_id: number;
  answer_id: number | null;
  score: string; // it's a string in the API
  total_questions: string;
  created_at: string;
}
