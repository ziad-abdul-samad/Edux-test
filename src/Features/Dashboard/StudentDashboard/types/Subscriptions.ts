export interface StudentResultsByTeacherResponse {
  data: {
    student_id: number;
    results_by_teacher: TeacherResult[];
  };
  message: string;
  status: number;
}

export interface TeacherResult {
  teacher_id: number;
  teacher_name: string;
  exam_stats: ExamStat[];
  best_result: ExamStat;
  average_percentage: number;
}

export interface ExamStat {
  exam_id: number;
  exam_title: string;
  score: number;
  total_questions: number;
  percentage: number;
  exam_details: ExamDetails;
}

export interface ExamDetails {
  title: string;
  description: string;
  start_at: string | null;
  end_at: string | null;
  duration_minutes: number;
  is_visible: boolean | null;
}
