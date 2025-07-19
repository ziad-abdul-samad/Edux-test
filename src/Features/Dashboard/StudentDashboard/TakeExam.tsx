import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";

import { GetTakeExam } from "./services/GetTakeExam";
import { submitExam } from "./services/SubmitExam";
import { Question, TakeExamResponse } from "./types/TakeExam";
import { SubmitAnswerPayload } from "./types/SubmitExam";

const TakeExam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const { examId } = useParams();

  // Fetch exam data
  const {
    data: examData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["takeExam", examId],
    queryFn: () => GetTakeExam(Number(examId!)),
  });
  console.log(examId);
  // Handle API errors
  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل بيانات الاختبار",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Submit exam mutation
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
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  // Timer setup
  useEffect(() => {
    if (quizStarted && examData?.data?.duration_minutes) {
      setTimeRemaining(examData.data.duration_minutes * 60);
    }
  }, [quizStarted, examData?.data?.duration_minutes]);

  // Timer countdown
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
      console.error("Exam data:", examData); // Log exam data
      console.error("Error object:", error); // Log detailed error
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
            <div className="font-medium">
              {examData?.data?.questions.length || 0}
            </div>
            {examData?.data?.duration_minutes && (
              <>
                <div>المدة الزمنية:</div>
                <div className="font-medium">
                  {examData.data.duration_minutes} دقيقة
                </div>
              </>
            )}
            <div>عدد المحاولات:</div>
            <div className="font-medium">
              {examData?.data?.attempt_limit || 0}
            </div>
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

  const renderQuestion = (question: Question) => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{question.text}</h2>
      {question.image && (
        <img
          src={question.image}
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
      <div className="text-4xl font-bold text-blue-700">
        {score}/{questions.length}
      </div>
      <Button className="mt-6" onClick={() => navigate("/dashboard/exams")}>
        العودة إلى الاختبارات
      </Button>
    </motion.div>
  );

  if (isLoading) return <div className="text-center py-20">جار التحميل...</div>;

  if (error)
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold mt-4">فشل تحميل الاختبار</h2>
        <p className="text-gray-600 mt-2">
          تعذر تحميل بيانات الاختبار، يرجى المحاولة مرة أخرى لاحقاً
        </p>
        <Button className="mt-6" onClick={() => navigate("/dashboard/exams")}>
          العودة
        </Button>
      </div>
    );

  if (!quizStarted && !examData?.data)
    return <div className="text-center py-20">لم يتم العثور على الاختبار</div>;
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
                  <Button
                    onClick={handleNext}
                    disabled={!selectedAnswers[currentQuestion.id]}
                  >
                    {currentQuestionIndex === questions.length - 1
                      ? "إرسال الاختبار"
                      : "التالي"}
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
