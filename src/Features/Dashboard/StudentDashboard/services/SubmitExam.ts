import { SubmitAnswerPayload, SubmitExamResponse } from "../types/SubmitExam";
import { post } from "@/lib/apiClient";

export const submitExam = async (
  examId: number,
  payload: SubmitAnswerPayload
): Promise<SubmitExamResponse> => {
  const formData = new FormData();

  payload.questions.forEach((question, qIndex) => {
    formData.append(`questions[${qIndex}][id]`, String(question.id));

    if (question.answers && question.answers.length > 0) {
      question.answers.forEach((answer, aIndex) => {
        formData.append(
          `questions[${qIndex}][answers][${aIndex}][id]`,
          String(answer.id)
        );
      });
    } else {
      // 👇 إرسال عنصر فارغ للإشارة إلى مصفوفة فاضية
      formData.append(`questions[${qIndex}][answers][0][id]`, '');
    }
  });

  const response = await post<SubmitExamResponse>(
    `/exams/submitExam/${examId}`,
    formData
  );

  return response.data;
};
