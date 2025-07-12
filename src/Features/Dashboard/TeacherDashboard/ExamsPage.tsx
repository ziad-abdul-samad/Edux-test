import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Eye,
  EyeOff,
  Clock,
  Edit,
  Calendar,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetExams } from "./services/GetExams";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Exam } from "./types/Exams";
import { ShowExam } from "./services/ShowExam";
import { DeleteExam } from "./services/DeleteExam";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ExamsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [isExamDetailsOpen, setIsExamDetailsOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<number | null>(null);
  // Delete exam mutation
  const queryClient = useQueryClient();
  const IMAGE_BASE_URL = "https://edux.site/uploads/questions_images/";

  const { mutate: removeExam } = useMutation({
    mutationFn: DeleteExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examsData"] });
      setExamToDelete(null);
      toast({
        title: "تم حذف الطالب",
        description: "تم حذف الطالب وجميع بياناته من النظام بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة حذف الطالب",
        variant: "destructive",
      });
    },
  });
  const {
    data: examsData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["examsData"],
    queryFn: GetExams,
  });

  const { data: examDetails } = useQuery({
    queryKey: ["examsData", selectedExamId],
    queryFn: () => (selectedExamId ? ShowExam(selectedExamId) : null),
    enabled: !!selectedExamId,
  });

  const exams = examsData?.data?.exams?.data || [];
  const exam = examDetails?.data;

  const getExamStatus = (exam: Exam) => {
    const now = new Date();
    const endDate = exam.end_at ? new Date(exam.end_at) : null;
    const startDate = exam.start_at ? new Date(exam.start_at) : null;

    if (endDate && endDate < now) {
      return {
        status: "expired",
        label: "منتهي",
        bgClass: "bg-gray-100 text-gray-700",
      };
    }

    if (exam.is_scheduled === 1 && startDate && startDate > now) {
      return {
        status: "scheduled",
        label: "مجدول",
        bgClass: "bg-blue-100 text-blue-700",
      };
    }

    if (exam.is_active === 0) {
      return {
        status: "hidden",
        label: "مخفي",
        bgClass: "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      status: "active",
      label: "نشط",
      bgClass: "bg-green-100 text-green-700",
    };
  };

  const handleViewExamDetails = (examId: number) => {
    setSelectedExamId(examId);
    setIsExamDetailsOpen(true);
  };

  if (isPending) {
    return (
      <div className="py-8 flex justify-center items-center h-full w-full rounded-md max-w-md mx-auto">
        <svg
          className="animate-spin h-10 w-10 text-purple-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) return <div>حدث خطأ أثناء جلب البيانات</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة الاختبارات</h1>
        <Button
          onClick={() => navigate("/dashboard/exams/create")}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="ml-2 rtl-flip" size={16} />
          إنشاء اختبار جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            لم تقم بإنشاء اختبارات بعد!
          </div>
        ) : (
          exams.map((exam, index) => {
            const examStatus = getExamStatus(exam);

            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{exam.title}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${examStatus.bgClass}`}
                        >
                          {examStatus.label}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 absolute left-3  hover:text-red-700 hover:bg-red-50 self-start"
                          onClick={() => setExamToDelete(exam.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {exam.questions_count} سؤال |{" "}
                        {new Date(exam.created_at).toLocaleDateString("EG-ar")}
                      </p>
                      {exam.duration_minutes && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{exam.duration_minutes} دقيقة</span>
                        </div>
                      )}
                      {exam.is_scheduled === 1 &&
                        (exam.start_at || exam.end_at) && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {exam.start_at &&
                                format(new Date(exam.start_at), "dd/MM/yyyy", {
                                  locale: ar,
                                })}
                              {exam.start_at && exam.end_at && " - "}
                              {exam.end_at &&
                                format(new Date(exam.end_at), "dd/MM/yyyy", {
                                  locale: ar,
                                })}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleViewExamDetails(exam.id)}
                    >
                      تفاصيل
                    </Button>
                    <Button
                      variant="default"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() =>
                        navigate(`/dashboard/quizzes/edit/${exam.id}`)
                      }
                    >
                      <Edit className="ml-2 h-4 w-4" />
                      تعديل
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      <Dialog open={isExamDetailsOpen} onOpenChange={setIsExamDetailsOpen}>
        {exam && (
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-right mt-5">
                {exam.title}
              </DialogTitle>
              <DialogDescription className="text-right">
                تفاصيل الاختبار
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-medium text-sm">الوصف</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {exam.description || "لا يوجد وصف"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">الحالة</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {exam.is_active ? "منشور" : "مخفي"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">عدد الأسئلة</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {exam.questions.length}
                  </p>
                </div>

                {exam.duration_minutes && (
                  <div>
                    <h3 className="font-medium text-sm">مدة الاختبار</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {exam.duration_minutes} دقيقة
                    </p>
                  </div>
                )}

                {exam.start_at && (
                  <div>
                    <h3 className="font-medium text-sm">تاريخ البدء</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(exam.start_at), "PPP", { locale: ar })}
                    </p>
                  </div>
                )}

                {exam.end_at && (
                  <div>
                    <h3 className="font-medium text-sm">تاريخ الانتهاء</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(exam.end_at), "PPP", { locale: ar })}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-sm">مراجعة الإجابات</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {exam.allow_review ? "مسموح" : "غير مسموح"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">تاريخ الإنشاء</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(new Date(exam.created_at), "PPP", { locale: ar })}
                  </p>
                </div>
              </div>

              {exam.questions.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">الأسئلة</h3>
                  <div className="space-y-4">
                    {exam.questions.map((question, index) => (
                      <div key={question.id} className="border rounded-md p-3">
                        <p className="font-medium">
                          سؤال {index + 1}: {question.text}
                        </p>

                        {question.image && (
                          <div className="my-2">
                            <img
                              src={`${IMAGE_BASE_URL}${question.image}`}
                              alt={`صورة للسؤال ${index + 1}`}
                              className="max-h-40 rounded-md"
                            />
                          </div>
                        )}

                        <div className="mt-2 space-y-1">
                          {question.answers.map((answer, answerIndex) => (
                            <div
                              key={answer.id}
                              className={`text-sm p-2 rounded-md ${
                                answer.is_correct
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-50"
                              }`}
                            >
                              {answerIndex + 1}. {answer.text}
                              {answer.is_correct && " ✓"}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsExamDetailsOpen(false)}
              >
                إغلاق
              </Button>
              <Button
                onClick={() =>
                  navigate(`/dashboard/quizzes/edit/${selectedExamId}`)
                }
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Edit className="ml-2 h-4 w-4" />
                تحرير الاختبار
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      <AlertDialog
        open={examToDelete !== null}
        onOpenChange={(open) => !open && setExamToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              تأكيد حذف الاختبار
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من أنك تريد حذف هذا الاختبار من قائمة اختباراتك؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                if (examToDelete) {
                  removeExam(examToDelete);
                }
              }}
            >
              <AlertTriangle className="ml-2 h-4 w-4" />
              حذف الاختبار
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamsPage;
