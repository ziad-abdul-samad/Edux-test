import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GetStudentDash } from "./services/GetStudentDash";
import { BookOpen, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const { data, isPending, error } = useQuery({
    queryKey: ["studentsDash"],
    queryFn: GetStudentDash,
  });

  if (isPending) {
    return (
      <div className="py-8 flex  justify-center items-center h-full w-full  rounded-md max-w-md mx-auto">
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

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        حدث خطأ أثناء جلب البيانات
      </div>
    );
  }

  const studentAnswerCount = data?.data.StudentAnswerCount || 0;
  const exams = data?.data.exams || [];
  const pastResults = data?.data.pastResults || [];

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">لوحة الطالب</h1>
      <p className="text-gray-600">
        مرحباً بك، هنا يمكنك رؤية تقدمك واختباراتك.
      </p>

      {/* Completed Exams Count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                الاختبارات المكتملة
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentAnswerCount}</div>
              <p className="text-xs text-muted-foreground">
                عدد الاختبارات التي أكملتها
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">الاختبارات المتاحة</h2>
          <Button onClick={() => navigate("/dashboard/exams")}>
            عرض جميع الاختبارات
          </Button>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          {exams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد اختبارات متاحة حالياً
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">
                استعد للاختبارات القادمة
              </h3>
              <p className="mt-1 text-gray-500">
                يمكنك الوصول إلى جميع الاختبارات المتاحة لك والبدء بها في أي وقت
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/dashboard/exams")}
              >
                استعرض الاختبارات
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">نتائج الاختبارات السابقة</h2>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/results")}
          >
            عرض الأرشيف
          </Button>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          {pastResults.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              لم تقم بإكمال أي اختبارات بعد
            </div>
          ) : (
            <div className="divide-y">
              {pastResults.slice(0, 5).map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        اختبار رقم {result.exam_id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(result.created_at).toLocaleDateString(
                          "EG-ar"
                        )}
                      </p>
                    </div>
                    <div className="text-left">
                      <span className="font-bold">
                        {result.score}/{result.total_questions}
                      </span>
                      <p className="text-sm text-gray-500">النتيجة</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
