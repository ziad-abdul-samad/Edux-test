export interface Exam {
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

export interface PastResult {
  id: number;
  student_id: number;
  exam_id: number;
  question_id: number;
  answer_id: number;
  score: string;
  total_questions: string;
  created_at: string;
  updated_at: string;
  exam: Exam;
}

export interface BestOverallResult {
  exam_id: number;
  exam_title: string;
  score: number;
  total_questions: number;
  percentage: number;
}

export interface SubscriptionsResponse {
  data: {
    StudentAnswerCount: number;
    bestOverallResult: BestOverallResult;
    averagePercentage: number;
    pastResults: PastResult[];
  };
  message: string;
  status: number;
}