export interface SubmitAnswerPayload {
  questions: {
    id: number;
    answers: { id: number }[];
  }[];
}

export interface SubmitExamResponse {
  data: {
    exam_id: number;
    student_id: number;
    score: number;
    total_questions: number;
    details: {
      question_id: number;
      question_text: string;
      selected_answer_id: number;
      is_correct: boolean;
      correct_answer_id: number;
      answers: {
        id: number;
        text: string;
        is_correct: boolean;
      }[];
    }[];
  };
  message: string;
  status: number;
}
