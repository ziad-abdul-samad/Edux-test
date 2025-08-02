import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";

import { GetTakeExam } from "./services/GetTakeExam";
import { submitExam } from "./services/SubmitExam";
import { Question, TakeExamResponse } from "./types/TakeExam";
import { SubmitAnswerPayload } from "./types/SubmitExam";

const TakeExam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { examId } = useParams();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const {
    data: examData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["takeExam", examId],
    queryFn: () => GetTakeExam(Number(examId!)),
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل بيانات الاختبار",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const mutation = useMutation({
    mutationFn: (payload: SubmitAnswerPayload) => {
      if (!examData?.data?.id) {
        throw new Error("Exam ID is not available");
      }
      return submitExam(examData.data.id, payload);
    },
    onSuccess: (res) => {
      setScore(res.data.score);
      setShowResult(true);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الإجابات",
        variant: "destructive",
      });
    },
  });

  const questions = examData?.data?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  useEffect(() => {
    if (quizStarted && examData?.data?.duration_minutes) {
      setTimeRemaining(examData.data.duration_minutes * 60);
    }
  }, [quizStarted, examData?.data?.duration_minutes]);

  useEffect(() => {
    if (!quizStarted || timeRemaining === null) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartExam = () => {
    if (examData) {
      setQuizStarted(true);
    } else {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على الاختبار",
        variant: "destructive",
      });
    }
  };

  const handleSelectAnswer = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const payload: SubmitAnswerPayload = {
      questions: questions.map((q) => ({
        id: q.id,
        answers: selectedAnswers[q.id] ? [{ id: selectedAnswers[q.id] }] : [],
      })),
    };
    mutation.mutate(payload);
  };

  const renderIntro = () => (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-6 text-center space-y-6">
        <h1 className="text-3xl font-bold">{examData?.data?.title}</h1>
        {examData?.data?.description && (
          <p className="text-gray-600">{examData.data.description}</p>
        )}

        <div className="bg-blue-50 p-4 rounded-lg text-blue-800">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
            <div>عدد الأسئلة:</div>
            <div className="font-medium">{questions.length}</div>
            {examData?.data?.duration_minutes && (
              <>
                <div>المدة الزمنية:</div>
                <div className="font-medium">
                  {examData.data.duration_minutes} دقيقة
                </div>
              </>
            )}
            <div>عدد المحاولات:</div>
            <div className="font-medium">{examData?.data?.attempt_limit}</div>
          </div>
        </div>

        {examData?.data?.duration_minutes && (
          <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm">
            ملاحظة: سوف يتم إرسال الاختبار تلقائياً عند انتهاء الوقت
          </div>
        )}
        <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
          الأسئلة التي لم يتم الإجابة عليها سيتم احتسابها كإجابات خاطئة
        </div>
        <Button className="w-full max-w-xs mx-auto" onClick={handleStartExam}>
          بدء الاختبار
        </Button>
      </CardContent>
    </Card>
  );

  const renderQuestionNavigator = () => {
    const totalQuestions = questions.length;
    const currentPage = Math.floor(currentQuestionIndex / 10);
    const questionsPerPage = 10;
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);
    
    const startIndex = currentPage * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, totalQuestions);

    const getQuestionStatus = (questionId: number, index: number) => {
      const isAnswered = !!selectedAnswers[questionId];
      const isVisited = index < currentQuestionIndex && !isAnswered;
      const isCurrent = index === currentQuestionIndex;

      if (isAnswered) return "answered";
      if (isVisited) return "visited";
      if (isCurrent) return "current";
      return "unvisited";
    };

    return (
      <>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {/* Always show first page button if not on first page */}
          {currentPage > 0 && (
            <>
              <button
                onClick={() => setCurrentQuestionIndex(0)}
                className={`w-8 h-8 text-sm rounded-full border ${
                  getQuestionStatus(questions[0].id, 0) === "answered"
                    ? "bg-green-100 text-green-800 border-green-400"
                    : getQuestionStatus(questions[0].id, 0) === "visited"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                    : "bg-white hover:bg-gray-100 text-gray-600 border-gray-300"
                }`}
              >
                1
              </button>
              {currentPage > 1 && (
                <span className="w-8 h-8 flex items-center justify-center">...</span>
              )}
            </>
          )}

          {/* Current page questions */}
          {questions.slice(startIndex, endIndex).map((q, index) => {
            const globalIndex = startIndex + index;
            const status = getQuestionStatus(q.id, globalIndex);

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(globalIndex)}
                className={`w-8 h-8 text-sm rounded-full border transition-all duration-200 ${
                  status === "answered"
                    ? "bg-green-100 text-green-800 border-green-400"
                    : status === "visited"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                    : status === "current"
                    ? "border-blue-500 font-bold bg-white"
                    : "bg-white hover:bg-gray-100 text-gray-600 border-gray-300"
                }`}
              >
                {globalIndex + 1}
              </button>
            );
          })}

          {/* Show last page button if not on last page */}
          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && (
                <span className="w-8 h-8 flex items-center justify-center">...</span>
              )}
              <button
                onClick={() => setCurrentQuestionIndex(totalQuestions - 1)}
                className={`w-8 h-8 text-sm rounded-full border ${
                  getQuestionStatus(questions[totalQuestions - 1].id, totalQuestions - 1) === "answered"
                    ? "bg-green-100 text-green-800 border-green-400"
                    : getQuestionStatus(questions[totalQuestions - 1].id, totalQuestions - 1) === "visited"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                    : "bg-white hover:bg-gray-100 text-gray-600 border-gray-300"
                }`}
              >
                {totalQuestions}
              </button>
            </>
          )}
        </div>

        {/* Page navigation controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => {
                const prevPage = Math.max(0, currentPage - 1);
                setCurrentQuestionIndex(prevPage * questionsPerPage);
              }}
              disabled={currentPage === 0}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              السابق
            </button>
            <span className="px-3 py-1 text-sm">
              الصفحة {currentPage + 1} من {totalPages}
            </span>
            <button
              onClick={() => {
                const nextPage = Math.min(totalPages - 1, currentPage + 1);
                setCurrentQuestionIndex(nextPage * questionsPerPage);
              }}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        )}

        {/* Legend (Arabic) */}
        <div className="flex justify-center gap-4 text-sm text-gray-700 mb-6">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-green-100 border border-green-400" />
            <span>تمت الإجابة</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-400" />
            <span>تم تخطيه</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-white border border-gray-300" />
            <p>لم يتم زيارته</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-white border border-blue-500" />
            <p>السؤال الحالي</p>
          </div>
        </div>
      </>
    );
  };

  const IMAGE_BASE_URL = "https://edux.site/backend/public/";

  const renderQuestion = (question: Question) => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{question.text}</h2>
      {question.image && (
        <img
          src={`${IMAGE_BASE_URL}${question.image}`}
          alt="صورة السؤال"
          className="max-h-64 mx-auto rounded-md"
        />
      )}
      <div className="space-y-3">
        {question.answers.map((answer) => (
          <div
            key={answer.id}
            onClick={() => handleSelectAnswer(question.id, answer.id)}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedAnswers[question.id] === answer.id
                ? "border-blue-500 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedAnswers[question.id] === answer.id
                    ? "bg-blue-500 text-white"
                    : "border-gray-300"
                }`}
              >
                {selectedAnswers[question.id] === answer.id && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>
              <span>{answer.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResult = () => (
    <motion.div
      className="text-center py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
        {score >= questions.length / 2 ? (
          <CheckCircle className="h-12 w-12 text-green-500" />
        ) : (
          <AlertCircle className="h-12 w-12 text-yellow-500" />
        )}
      </div>
      <h2 className="text-2xl font-bold mt-4">تم إرسال الاختبار!</h2>
      <div className="text-4xl font-bold text-blue-700 flex flex-col items-center gap-1">
        <p className="text-[12px] text-[#777] font-normal">الإجابات الصحيحة  :{score} </p>
        <p className="text-[12px] text-[#777] font-normal">من أصل : {questions.length}</p>
      النتيجة:  {score}/{questions.length}
      </div>
      <Button className="mt-6" onClick={() => navigate("/dashboard/exams")}>
        العودة إلى الاختبارات
      </Button>
    </motion.div>
  );

  if (isLoading)
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
  if (error) return renderIntro();
  if (!quizStarted) return renderIntro();

  return (
    <div className="max-w-3xl mx-auto">
      {!showResult && (
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{examData?.data?.title}</h1>
          <div className="flex justify-center items-center gap-4 mt-2 text-sm text-gray-600">
            <span>
              السؤال {currentQuestionIndex + 1} من {questions.length}
            </span>
            {timeRemaining !== null && (
              <div
                className={`flex items-center gap-1 font-mono text-lg ${
                  timeRemaining < 60
                    ? "text-red-600"
                    : timeRemaining < 180
                    ? "text-amber-600"
                    : "text-green-600"
                }`}
              >
                <Clock className="h-4 w-4" />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          <Progress className="mt-4 h-2" value={progress} />
        </div>
      )}

      {!showResult && renderQuestionNavigator()}

      <Card>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentQuestion?.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {currentQuestion && renderQuestion(currentQuestion)}

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    السابق
                  </Button>
                  <Button onClick={handleNext} disabled={mutation.isPending}>
                    {mutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        جارٍ الإرسال...
                      </span>
                    ) : currentQuestionIndex === questions.length - 1 ? (
                      "إرسال الاختبار"
                    ) : (
                      "التالي"
                    )}
        </Button>
                </div>
              </motion.div>
            ) : (
              renderResult()
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default TakeExam;