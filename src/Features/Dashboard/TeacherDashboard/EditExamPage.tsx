import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Trash,
  Plus,
  Check,
  ArrowRight,
  Timer,
  EyeIcon,
  EyeOffIcon,
  CalendarClock,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { updateExam } from "./services/UpdateExam";
import { UpdateExamRequest } from "./types/UpdateExam";
import { ShowExam } from "./services/ShowExam";

const EditExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing exam data
  const { data: existingExam } = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => ShowExam(Number(examId!)),
    enabled: !!examId,
  });

  // Form state
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [allowReview, setAllowReview] = useState(true);
  const [scheduleQuiz, setScheduleQuiz] = useState(false);
  const [availableFrom, setAvailableFrom] = useState<Date | undefined>();
  const [availableUntil, setAvailableUntil] = useState<Date | undefined>();
  const [attemptLimit, setAttemptLimit] = useState<string>("1");
  type QuestionType = {
  id: string;
  text: string;
  imageUrl: string;
  imageFile: File | null;
  imagePreview: string;
  deleteImage?: boolean;  // Add this line!
  choices: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
};

const [questions, setQuestions] = useState<QuestionType[]>([
  {
    id: "q1",
    text: "",
    imageUrl: "",
    imageFile: null,
    imagePreview: "",
    deleteImage: false,  // initialize it here optionally
    choices: [
      { id: "q1-c1", text: "", isCorrect: true },
      { id: "q1-c2", text: "", isCorrect: false },
    ],
  },
]);


  // Initialize form with existing data
  useEffect(() => {
    if (existingExam?.data) {
      const exam = existingExam.data;
      setQuizTitle(exam.title);
      setQuizDescription(exam.description || "");
      setIsVisible(exam.is_active === 1);
      setTimeLimit(
        exam.duration_minutes ? Number(exam.duration_minutes) : null
      );
      setAllowReview(exam.allow_review === 1);
      setScheduleQuiz(exam.is_scheduled === 1);
      setAvailableFrom(exam.start_at ? new Date(exam.start_at) : undefined);
      setAvailableUntil(exam.end_at ? new Date(exam.end_at) : undefined);
      setAttemptLimit(exam.attempt_limit?.toString() || "1");
      setQuestions(
        exam.questions.map((q) => ({
          id: `q${q.id}`,
          text: q.text,
          imageUrl: q.image || "",
          imageFile: null,
          imagePreview: q.image ? `https://edux.site/${q.image}` : "",
          deleteImage: false,
          choices: q.answers.map((a) => ({
            id: `q${q.id}-c${a.id}`,
            text: a.text,
            isCorrect: a.is_correct,
          })),
        }))
      );
    }
  }, [existingExam]);

  // Update mutation
  const mutation = useMutation({
    mutationFn: updateExam,
    onSuccess: () => {
      toast({ title: "✅ تم تحديث الاختبار بنجاح!" });
      queryClient.invalidateQueries({ queryKey: ["examsData"] });
      navigate("/dashboard/exams");
    },
    onError: () => {
      toast({
        title: "❌ حدث خطأ أثناء تحديث الاختبار",
        variant: "destructive",
      });
    },
  });

  const handleAddQuestion = () => {
    const newQId = `new-q${Date.now()}`;
    setQuestions([
      ...questions,
      {
        id: newQId,
        text: "",
        imageUrl: "",
        imageFile: null,
        imagePreview: "",
        choices: [
          { id: `${newQId}-c1`, text: "", isCorrect: true },
          { id: `${newQId}-c2`, text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (qid: string) => {
    if (questions.length === 1) {
      toast({
        title: "لا يمكن حذف السؤال",
        description: "يجب أن يحتوي الاختبار على سؤال واحد على الأقل",
        variant: "destructive",
      });
      return;
    }
    setQuestions(questions.filter((q) => q.id !== qid));
  };

  const handleQuestionChange = (qid: string, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qid
          ? {
              ...q,
              text,
            }
          : q
      )
    );
  };

  const handleAddChoice = (qid: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qid) return q;
        const newCId = `${qid}-c${Date.now()}`;
        return {
          ...q,
          choices: [...q.choices, { id: newCId, text: "", isCorrect: false }],
        };
      })
    );
  };

  const handleRemoveChoice = (qid: string, cid: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qid) return q;
        if (q.choices.length === 1) {
          toast({
            title: "لا يمكن حذف الاختيار",
            description: "يجب أن يحتوي السؤال على اختيار واحد على الأقل",
            variant: "destructive",
          });
          return q;
        }
        const removed = q.choices.filter((c) => c.id !== cid);
        // if we removed the correct one, make first choice correct
        if (!removed.some((c) => c.isCorrect)) {
          removed[0].isCorrect = true;
        }
        return { ...q, choices: removed };
      })
    );
  };

  const handleChoiceChange = (qid: string, cid: string, text: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qid) return q;
        return {
          ...q,
          choices: q.choices.map((c) =>
            c.id === cid
              ? {
                  ...c,
                  text,
                }
              : c
          ),
        };
      })
    );
  };

  const handleCorrectAnswerChange = (qid: string, cid: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qid) return q;
        return {
          ...q,
          choices: q.choices.map((c) => ({
            ...c,
            isCorrect: c.id === cid,
          })),
        };
      })
    );
  };

  const handleImageChange = (
    qid: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setQuestions(
        questions.map((q) =>
          q.id === qid
            ? {
                ...q,
                imageFile: file,
                imagePreview: reader.result as string,
                imageUrl: "",
              }
            : q
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (qid: string) => {
  setQuestions(
    questions.map((q) =>
      q.id === qid
        ? {
            ...q,
            imageFile: null,
            imagePreview: "",
            imageUrl: "",
            deleteImage: true, // 👈 Mark for deletion
          }
        : q
    )
  );
};


  // Final submit
  const handleSubmit = () => {
    if (!quizTitle.trim()) {
      toast({
        title: "حقل مطلوب",
        description: "يرجى إدخال عنوان الاختبار",
        variant: "destructive",
      });
      return;
    }
    if (
      timeLimit !== null &&
      (isNaN(Number(timeLimit)) || Number(timeLimit) <= 0)
    ) {
      toast({
        title: "وقت غير صالح",
        description: "أدخل مدة صالحة أو اتركها فارغة",
        variant: "destructive",
      });
      return;
    }
    if (isNaN(Number(attemptLimit)) || Number(attemptLimit) < 1) {
      toast({
        title: "عدد المحاولات غير صالح",
        description: "يرجى إدخال عدد محاولات صحيح (1 أو أكثر)",
        variant: "destructive",
      });
      return;
    }
    if (scheduleQuiz) {
      if (!availableFrom || !availableUntil) {
        toast({
          title: "تاريخ مطلوب",
          description: "يرجى تحديد تاريخ البدء والانتهاء",
          variant: "destructive",
        });
        return;
      }
      if (availableFrom >= availableUntil) {
        toast({
          title: "تواريخ غير صالحة",
          description: "يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء",
          variant: "destructive",
        });
        return;
      }
    }

    let valid = true;
    questions.forEach((q, qi) => {
      if (!q.text.trim()) {
        toast({
          title: "حقل مطلوب",
          description: `يرجى إدخال نص السؤال رقم ${qi + 1}`,
          variant: "destructive",
        });
        valid = false;
      }
      if (!q.choices.some((c) => c.isCorrect)) {
        toast({
          title: "إجابة صحيحة مطلوبة",
          description: `يرجى تحديد الإجابة الصحيحة للسؤال رقم ${qi + 1}`,
          variant: "destructive",
        });
        valid = false;
      }
      q.choices.forEach((c, ci) => {
        if (!c.text.trim()) {
          toast({
            title: "حقل مطلوب",
            description: `يرجى إدخال نص الإجابة ${ci + 1} للسؤال رقم ${qi + 1}`,
            variant: "destructive",
          });
          valid = false;
        }
      });
    });
    if (!valid) return;
    function formatDateForBackend(date: Date): string {
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const day = `${date.getDate()}`.padStart(2, "0");
      const hours = `${date.getHours()}`.padStart(2, "0");
      const minutes = `${date.getMinutes()}`.padStart(2, "0");
      const seconds = `${date.getSeconds()}`.padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // Map to UpdateExamRequest
    const payload: UpdateExamRequest = {
      id: examId!,
      title: quizTitle,
      description: quizDescription,
      duration_minutes: timeLimit,
      is_active: isVisible,
      allow_review: allowReview,
      is_scheduled: scheduleQuiz,
      start_at: scheduleQuiz
        ? availableFrom
          ? formatDateForBackend(availableFrom)
          : null
        : null,
      end_at: scheduleQuiz
        ? availableUntil
          ? formatDateForBackend(availableUntil)
          : null
        : null,
      attempt_limit: Number(attemptLimit),
      questions: questions.map((q) => {
        // Determine if this is an existing question (has numeric ID) or new question
        const isExistingQuestion = !q.id.startsWith("new-");

        return {
          ...(isExistingQuestion ? { id: Number(q.id.replace("q", "")) } : {}), // Only include ID for existing questions
          text: q.text,
          type: "multiple_choice",
          image: q.imageFile,
          deleteImage: q.deleteImage ?? false,
          answers: q.choices.map((c) => {
            // Determine if this is an existing answer (has numeric ID) or new answer
            const answerIdParts = c.id.split("-c");
            const isExistingAnswer = isExistingQuestion && answerIdParts.length > 1 && !isNaN(Number(answerIdParts[1]));

            return {
              ...(isExistingAnswer ? { id: Number(answerIdParts[1]) } : {}), // Only include ID for existing answers
              text: c.text,
              is_correct: c.isCorrect,
            };
          }),
        };
      }),
    };

    mutation.mutate(payload);
  };

  function formatTimeForInput(date: Date): string {
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">تعديل الاختبار</h1>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="quizTitle">عنوان الاختبار</Label>
            <Input
              id="quizTitle"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="أدخل عنوان الاختبار"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="quizDescription">وصف الاختبار (اختياري)</Label>
            <Textarea
              id="quizDescription"
              placeholder="أدخل وصفاً للاختبار"
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Visibility & Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <EyeIcon className="h-4 w-4" />
                إظهار الاختبار للطلاب
              </Label>
              <div className="flex items-center gap-2">
                <Switch checked={isVisible} onCheckedChange={setIsVisible} />
                <span className="text-sm text-gray-500">
                  {isVisible ? "مرئي" : "مخفي"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                مدة الاختبار بالدقائق (اختياري)
              </Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                placeholder="مثال: 60 دقيقة"
                value={timeLimit ?? ""}
                onChange={(e) =>
                  setTimeLimit(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                حد المحاولات (عدد المحاولات المسموح بها للطالب)
              </Label>
              <Input
                id="attemptLimit"
                type="number"
                min="1"
                placeholder="مثال: 1"
                value={attemptLimit}
                onChange={(e) => setAttemptLimit(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                جدولة الاختبار
              </Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={scheduleQuiz}
                  onCheckedChange={setScheduleQuiz}
                />
                <span className="text-sm text-gray-500">
                  {scheduleQuiz ? " الاختبار مجدول" : "بدون جدولة"}
                </span>
              </div>
            </div>
          </div>

          {/* Schedule Pickers */}
          {scheduleQuiz && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <Label className="p-1">تاريخ البدء</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      {availableFrom
                        ? format(availableFrom, "PPP", { locale: ar })
                        : "اختر تاريخ البدء"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={availableFrom}
                      onSelect={setAvailableFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {availableFrom && (
                  <div className="flex justify-start mt-2">
                    <Input
                      type="time"
                      className="w-40"
                      value={
                        availableFrom ? formatTimeForInput(availableFrom) : ""
                      }
                      onChange={(e) => {
                        const [h, m] = e.target.value.split(":").map(Number);
                        const d = new Date(availableFrom!);
                        d.setHours(h, m);
                        setAvailableFrom(new Date(d));
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="p-1">تاريخ الانتهاء</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      {availableUntil
                        ? format(availableUntil, "PPP", { locale: ar })
                        : "اختر تاريخ الانتهاء"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={availableUntil}
                      onSelect={setAvailableUntil}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {availableUntil && (
                  <div className="flex justify-start mt-2">
                    <Input
                      type="time"
                      className="w-40"
                      value={
                        availableUntil ? formatTimeForInput(availableUntil) : ""
                      }
                      onChange={(e) => {
                        const [h, m] = e.target.value.split(":").map(Number);
                        const d = new Date(availableUntil!);
                        d.setHours(h, m);
                        setAvailableUntil(new Date(d));
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions & Answers Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">الأسئلة</h2>
        </div>

        {questions.map((q, qi) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">السؤال {qi + 1}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveQuestion(q.id)}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <Label htmlFor={`question-${q.id}`}>نص السؤال</Label>
              <Textarea
                id={`question-${q.id}`}
                value={q.text}
                onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                placeholder="أدخل نص السؤال"
              />
            </div>

            {/* Question Image */}
            <div className="space-y-2">
              <Label>صورة السؤال (اختياري)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(q.id, e)}
              />
              {(q.imagePreview || q.imageUrl) && (
                <div className="relative mt-2">
                  <img
                    src={q.imagePreview || q.imageUrl}
                    alt="صورة السؤال"
                    className="max-h-40 rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveImage(q.id)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Choices */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>الإجابات</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddChoice(q.id)}
                >
                  <Plus className="ml-1 h-3 w-3" />
                  إضافة خيار
                </Button>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                حدد الإجابة الصحيحة بالنقر على الدائرة
              </p>

              {q.choices.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={`w-6 h-6 rounded-full p-0 ${
                      c.isCorrect
                        ? "bg-purple-50 border-purple-600 text-purple-600"
                        : ""
                    }`}
                    onClick={() => handleCorrectAnswerChange(q.id, c.id)}
                  >
                    {c.isCorrect && <Check className="h-3 w-3" />}
                  </Button>
                  <Input
                    className="flex-1"
                    placeholder="نص الإجابة"
                    value={c.text}
                    onChange={(e) =>
                      handleChoiceChange(q.id, c.id, e.target.value)
                    }
                  />
                  {q.choices.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveChoice(q.id, c.id)}
                    >
                      <Trash className="h-3 w-3 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex justify-between lg:flex-row flex-col gap-2">
        <Button onClick={handleAddQuestion} variant="outline">
          <Plus className="ml-2 rtl-flip" size={16} />
          إضافة سؤال
        </Button>
        <div className="flex lg:justify-end">
          <Button
            size="lg"
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={mutation.isPending} // Disable button during submission
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                حفظ التعديلات
                <ArrowRight className="mr-2 rtl-flip" size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditExamPage;