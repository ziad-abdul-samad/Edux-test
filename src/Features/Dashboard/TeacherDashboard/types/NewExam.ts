// types/Exams/CreateExam.ts

export type CreateExamRequest = {
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
    text: string;
    type?: "multiple_choice"; // can be extended in the future
    image?: File | null;
    answers: {
      text: string;
      is_correct?: boolean;
    }[];
  }[];
};

export type CreateExamResponse = {
  data: {
    id: number;
    title: string;
    description: string;
    duration_minutes: string;
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
      type: string;
      image: string | null;
      exam_id: number;
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
