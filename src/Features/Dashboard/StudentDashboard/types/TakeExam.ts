export interface Answer {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: number;
  text: string;
  image: string | null;
  exam_id: number;
  type: string;
  created_at: string;
  updated_at: string;
  answers: Answer[];
}

export interface TakeExamResponse {
  data: {
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
    questions: Question[];
  };
  message: string;
  status: number;
}
