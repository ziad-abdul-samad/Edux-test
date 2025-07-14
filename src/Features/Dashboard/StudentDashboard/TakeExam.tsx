import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GetTakeExam } from "./services/GetTakeExam";
import { Clock } from "lucide-react";

const TakeExam = () => {
  const { examId } = useParams();
  const { toast } = useToast();

  const { data, isPending, isError } = useQuery({
    queryKey: ["takeExam", examId],
    queryFn: () => GetTakeExam(Number(examId!)),
  });

  const exam = data?.data;

  if (isPending)
    return <div className="text-center py-12">جاري التحميل...</div>;

  if (isError || !exam) {
    toast({
      title: "خطأ",
      description: "لم يتم العثور على الاختبار",
      variant: "destructive",
    });
    // console.log(error);
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-6 space-y-6 text-center">
          <h1 className="text-3xl font-bold mb-2">{exam?.title}</h1>
          {exam?.description && (
            <p className="text-gray-600">{exam.description}</p>
          )}

          <div className="bg-purple-50 p-4 rounded-lg text-purple-800 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">تفاصيل الاختبار:</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm w-full max-w-md">
              <div>عدد الأسئلة:</div>
              <div className="font-medium">{exam?.questions.length} سؤال</div>

              {exam?.duration_minutes && (
                <>
                  <div>الوقت المتاح:</div>
                  <div className="font-medium">
                    {exam.duration_minutes} دقيقة
                  </div>
                </>
              )}

              <div>رقم المحاولة:</div>
              <div className="font-medium text-purple-700">
                {exam.attempt_limit}
              </div>
            </div>
          </div>

          {exam?.duration_minutes && (
            <div className="text-yellow-700 bg-yellow-50 p-3 rounded-lg text-sm">
              <strong>ملاحظة:</strong> بمجرد بدء الاختبار، سيبدأ المؤقت
              تلقائياً. في حال انتهاء الوقت، سيتم إنهاء الاختبار وتسليم إجاباتك
              تلقائياً.
            </div>
          )}

          <Button
            className="bg-purple-600 hover:bg-purple-700 mt-4 w-full max-w-xs mx-auto"
            size="lg"
          >
            بدء الاختبار الآن
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TakeExam;
