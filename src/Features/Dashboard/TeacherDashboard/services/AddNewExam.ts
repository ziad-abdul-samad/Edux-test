import { ApiResponse, post } from "@/lib/apiClient";
import { CreateExamRequest, CreateExamResponse } from "../types/NewExam";

export const addNewExam = async (
  examData: CreateExamRequest
): Promise<ApiResponse<CreateExamResponse>> => {
  const formData = new FormData();

  formData.append("title", examData.title);
  formData.append("description", examData.description);

  if (examData.duration_minutes !== null) {
    formData.append("duration_minutes", examData.duration_minutes.toString());
  }

  formData.append("is_active", examData.is_active ? "1" : "0");
  formData.append("allow_review", examData.allow_review ? "1" : "0");
  formData.append("is_scheduled", examData.is_scheduled ? "1" : "0");
  formData.append("start_at", examData.start_at ?? "");
  formData.append("end_at", examData.end_at ?? "");
  formData.append("attempt_limit", examData.attempt_limit.toString());

  examData.questions.forEach((question, qIndex) => {
    formData.append(`questions[${qIndex}][text]`, question.text);
    if (question.type)
      formData.append(`questions[${qIndex}][type]`, question.type);
    if (question.image)
      formData.append(`questions[${qIndex}][image]`, question.image);

    question.answers.forEach((answer, aIndex) => {
      formData.append(
        `questions[${qIndex}][answers][${aIndex}][text]`,
        answer.text
      );
      if (answer.is_correct !== undefined) {
        formData.append(
          `questions[${qIndex}][answers][${aIndex}][is_correct]`,
          answer.is_correct ? "1" : "0"
        );
      }
    });
  });

  const response = await post<ApiResponse<CreateExamResponse>>(
    "/exams/store",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
