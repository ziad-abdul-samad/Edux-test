import { useQuery } from "@tanstack/react-query";
import { FileCheck, Users, BookOpen, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { GetSubs } from "./services/GetSubscriptions";

const SubscriptionsPage = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["studentsDash"],
    queryFn: GetSubs,
  });

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

  if (error) {
    console.error("Error loading subscriptions:", error);
    return (
      <div className="text-center text-red-500 mt-10">
        حدث خطأ أثناء تحميل البيانات
      </div>
    );
  }

  if (!data?.data?.results_by_teacher) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl font-medium mb-2">لا يوجد معلمين بعد</h3>
          <p className="text-gray-500">لم يتم تعيين أي معلمين لك بعد</p>
        </CardContent>
      </Card>
    );
  }

  const { results_by_teacher } = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">المعلمين</h1>
      </div>

      <p className="text-gray-600">
        استعرض المعلمين وإحصائيات أدائك في اختباراتهم.
      </p>

      {results_by_teacher.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-medium mb-2">لا يوجد معلمين بعد</h3>
            <p className="text-gray-500">لم يتم تعيين أي معلمين لك بعد</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results_by_teacher.map((teacher, index) => (
            <motion.div
              key={teacher.teacher_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {teacher.teacher_name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="stats" className="w-full">
                    <TabsList className="mb-4 w-full">
                      <TabsTrigger value="stats" className="flex-1">
                        الإحصائيات
                      </TabsTrigger>
                      <TabsTrigger value="quizzes" className="flex-1">
                        الاختبارات
                      </TabsTrigger>
                    </TabsList>

                    {/* الإحصائيات */}
                    <TabsContent value="stats">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-amber-600" />
                            <span className="text-sm font-medium">
                              عدد الاختبارات
                            </span>
                          </div>
                          <p className="text-2xl font-bold">
                            {teacher.exam_stats?.length || 0}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">
                              أفضل نتيجة
                            </span>
                          </div>
                          <p className="text-2xl font-bold">
                            {teacher.best_result?.percentage || 0}%
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <FileCheck className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            متوسط النتائج
                          </span>
                        </div>
                        <p className="text-2xl font-bold">
                          {teacher.average_percentage || 0}%
                        </p>
                      </div>
                    </TabsContent>

                    {/* قائمة الاختبارات */}
                    <TabsContent value="quizzes">
                      {!teacher.exam_stats || teacher.exam_stats.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          لا توجد اختبارات
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {teacher.exam_stats.map((exam) => (
                            <div
                              key={exam.exam_id}
                              className="flex justify-between items-center border-b pb-2 last:border-0"
                            >
                              <div>
                                <p className="font-medium">{exam.exam_title}</p>
                                <p className="text-xs text-gray-500">
                                  المدة: {exam.exam_details?.duration_minutes || 0} دقيقة
                                </p>
                              </div>
                              <div
                                className={`text-right font-bold ${
                                  exam.percentage >= 50
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {exam.score}/{exam.total_questions}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;