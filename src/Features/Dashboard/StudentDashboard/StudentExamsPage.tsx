// src/Features/Student/StudentExamsPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GetActiveExams } from "./services/GetActiveExams";
import { BookOpen, Search, Clock, Timer } from "lucide-react";

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

  if (isPending) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">حدث خطأ أثناء جلب البيانات</div>;
  }

  const exams = data?.data.exams.data || [];

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4">
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
          filteredExams.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100">
                    <BookOpen className="h-5 w-5 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{exam.title}</h3>
                      {exam.duration_minutes && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
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
                    {exam.is_scheduled === 1 && exam.start_at && (
                      <div className="mt-2 flex items-center text-sm">
                        <Clock className="h-3 w-3 text-purple-700 mr-1" />
                        <span className="text-purple-700">الاختبار مجدول من {exam.start_at} إلى {exam.end_at}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => navigate(`/dashboard/exams/take/${exam.id}`)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    بدء الاختبار
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentExamsPage;
