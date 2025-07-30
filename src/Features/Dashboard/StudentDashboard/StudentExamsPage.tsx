// src/Features/Student/StudentExamsPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GetActiveExams } from "./services/GetActiveExams";
import { BookOpen, Search, Clock, Timer, Lock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const StudentExamsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isPending, error } = useQuery({
    queryKey: ["studentsExams"],
    queryFn: GetActiveExams,
  });

  const getExamStatus = (exam) => {
    if (exam.is_scheduled !== 1) return 'available';
    
    const now = new Date();
    const startDate = new Date(exam.start_at);
    const endDate = new Date(exam.end_at);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'expired';
    return 'available';
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

  if (error) {
    return <div className="text-red-500 text-center mt-10">حدث خطأ أثناء جلب البيانات</div>;
  }

  const exams = data?.data.exams || [];
  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-1 md:p-4">
      <h1 className="text-3xl font-bold">الاختبارات المتاحة</h1>
      <p className="text-gray-600">اختر اختباراً للبدء.</p>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="بحث عن اختبار..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExams.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            لا يوجد اختبارات متاحة حالياً
          </div>
        ) : (
          filteredExams.map((exam, index) => {
            const status = getExamStatus(exam);
            const available = status === 'available';
            
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`p-4 hover:shadow-md transition-shadow ${!available ? 'opacity-80' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100">
                      {status === 'upcoming' && <Clock className="h-5 w-5 text-purple-700" />}
                      {status === 'available' && <BookOpen className="h-5 w-5 text-purple-700" />}
                      {status === 'expired' && <Lock className="h-5 w-5 text-purple-700" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{exam.title}</h3>
                        {exam.duration_minutes && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
                          >
                            <Timer className="h-3 w-3" /> {exam.duration_minutes} دقيقة
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {exam.questions_count} سؤال | {exam.teacher?.name ?? "المعلم"}
                      </p>
                      {exam.description && (
                        <p className="text-sm text-gray-500 mt-2">
                          {exam.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        المحاولات المسموحة: {exam.attempt_limit}
                      </p>
                      <p className="text-sm text-gray-500">
                        المحاولات المنجزة: {exam.attemptsCount}
                      </p>
                      {exam.is_scheduled === 1 && exam.start_at && (
                        <div className="mt-2 flex items-start text-sm flex-col">
                          {status === 'upcoming' && (
                            <>
                              <span className="text-purple-700">الاختبار مجدول</span>
                              <span className="text-gray-600">يبدأ في {new Date(exam.start_at).toLocaleString()}</span>
                              <span className="text-gray-600">ينتهي في {new Date(exam.end_at).toLocaleString()}</span>
                              <span className="text-yellow-600 mt-1">لم يبدأ بعد</span>
                            </>
                          )}
                          {status === 'available' && (
                            <>
                              <span className="text-green-700">الاختبار متاح الآن</span>
                              <span className="text-gray-600">ينتهي في {new Date(exam.end_at).toLocaleString()}</span>
                              <span className="text-green-600 mt-1">متاح للبدء</span>
                            </>
                          )}
                          {status === 'expired' && (
                            <>
                              <span className="text-purple-700">الاختبار منتهي</span>
                              <span className="text-gray-600">كان من {new Date(exam.start_at).toLocaleString()}</span>
                              <span className="text-gray-600">إلى {new Date(exam.end_at).toLocaleString()}</span>
                              <span className="text-red-500 mt-1">انتهى وقت الاختبار</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() => navigate(`/dashboard/exams/take/${exam.id}`)}
                      className={`${available ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400'}`}
                      disabled={!available}
                    >
                      {status === 'upcoming' && 'لم يبدأ بعد'}
                      {status === 'available' && 'بدء الاختبار'}
                      {status === 'expired' && 'انتهى الوقت'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentExamsPage;