export type UpdateExamResponse = {
  data: {
    id: number;
    title: string;
    description: string;
    duration_minutes: string | null;
    is_active: string;
    allow_review: string;
    is_scheduled: string;
    start_at: string | null;
    end_at: string | null;
    attempt_limit: string;
    teacher_id: number;
    created_at: string;
    updated_at: string;
    questions: {
      id: number;
      text: string;
      image: string | null;
      exam_id: number;
      type: string;
      created_at: string;
      updated_at: string;
      answers: {
        id: number;
        question_id: number;
        text: string;
        is_correct: boolean;
        created_at: string;
        updated_at: string;
      }[];
    }[];
  };
  message: string;
  status: number;
};

export type UpdateExamRequest = {
  id: string;
  title: string;
  description: string;
  duration_minutes: number | null;
  is_active: boolean;
  allow_review: boolean;
  is_scheduled: boolean;
  start_at: string | null;
  end_at: string | null;
  attempt_limit: number;
  questions: {
    id?: number | string; // Can be string for new questions
    text: string;
    type?: "multiple_choice";
    image?: File | null;
    answers: {
      id?: number | string; // Can be string for new answers
      text: string;
      is_correct?: boolean;
    }[];
  }[];
};