export interface StudentExamAnswersResponse {
  data: StudentExamAnswer[];
  message: string;
  status: number;
}

export interface StudentExamAnswer {
  id: number;
  student_id: number;
  exam_id: number;
  question_id: number;
  answer_id: number;
  score: string;
  total_questions: string;
  created_at: string;
  updated_at: string;
  student: Student;
  exam: Exam;
  answer: Answer;
}

export interface Student {
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
  questions: Question[];
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

export interface Answer {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
}
