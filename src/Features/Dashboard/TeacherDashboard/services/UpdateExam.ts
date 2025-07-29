import { ApiResponse, post } from "@/lib/apiClient"; // Using post with _method=PUT
import { UpdateExamRequest, UpdateExamResponse } from "../types/UpdateExam";

export const updateExam = async (
  examData: UpdateExamRequest
): Promise<ApiResponse<UpdateExamResponse>> => {
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
    if (question.id && typeof question.id === "number") {
      formData.append(`questions[${qIndex}][id]`, question.id.toString());
    }
    formData.append(`questions[${qIndex}][text]`, question.text);
    if (question.type) {
      formData.append(`questions[${qIndex}][type]`, question.type);
    }
    if (question.image) {
      formData.append(`questions[${qIndex}][image]`, question.image);
    }
    if (question.deleteImage !== undefined) {
      formData.append(
        `questions[${qIndex}][delete_image]`,
        question.deleteImage ? "1" : "0"
      ); // ✅ Laravel-friendly boolean
    }

    question.answers.forEach((answer, aIndex) => {
      if (answer.id) {
        formData.append(
          `questions[${qIndex}][answers][${aIndex}][id]`,
          answer.id.toString()
        );
      }
      formData.append(
        `questions[${qIndex}][answers][${aIndex}][text]`,
        answer.text
      );
      formData.append(
        `questions[${qIndex}][answers][${aIndex}][is_correct]`,
        answer.is_correct ? "1" : "0"
      );
    });
  });

  const response = await post<ApiResponse<UpdateExamResponse>>(
    `/exams/update/${examData.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
