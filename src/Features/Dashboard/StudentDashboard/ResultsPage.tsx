import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetResults } from "./services/GetResults";
import { StudentExamAnswer } from "./types/Results";

interface ApiResponse {
  data: StudentExamAnswer[];
  // Add other response fields if they exist
}

const ResultsPage = () => {
  const { data, isPending, error } = useQuery<ApiResponse>({
    queryKey: ["studentsDash"],
    queryFn: GetResults,
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Debug what we're receiving
  console.log("API Data:", data);

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
    console.error("Error loading results:", error);
    return (
      <div className="text-red-500 text-center mt-10">
        حدث خطأ أثناء تحميل النتائج.
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="text-gray-500 text-center mt-10">
        لا توجد نتائج متاحة.
      </div>
    );
  }

  // Safely get results or default to empty array
  const results = Array.isArray(data.data) ? data.data : [];
  console.log("Processed results:", results);

  // Group results by exam ID
  const groupedResults: Record<string, StudentExamAnswer[]> = {};
  results.forEach((result) => {
    const examId = result.exam.id.toString();
    if (!groupedResults[examId]) {
      groupedResults[examId] = [];
    }
    groupedResults[examId].push(result);
  });

  // Filter by search query (exam title)
  const filteredGroups: Record<string, StudentExamAnswer[]> = {};
  Object.keys(groupedResults).forEach((examId) => {
    const title = groupedResults[examId][0]?.exam.title || "";
    if (title.toLowerCase().includes(searchQuery.toLowerCase())) {
      filteredGroups[examId] = groupedResults[examId];
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">نتائج الاختبارات السابقة</h1>
      <p className="text-gray-600">استعرض نتائج الطلاب في الاختبارات.</p>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="بحث في النتائج..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">سجل النتائج</h2>
        </div>

        {Object.keys(filteredGroups).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            لا يوجد نتائج اختبارات مطابقة
          </div>
        ) : (
          <div className="divide-y">
            {Object.entries(filteredGroups).map(
              ([examId, examResults], index) => {
                const exam = examResults[0].exam;
                const student = examResults[0].student;
                const scoreSum = examResults.reduce(
                  (acc, cur) => acc + parseFloat(cur.score),
                  0
                );
                const total = examResults.reduce(
                  (acc, cur) => acc + parseFloat(cur.total_questions),
                  0
                );
                const percentage = Math.round((scoreSum / total) * 100);

                return (
                  <motion.div
                    key={examId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4"
                  >
                    <div className="mb-2">
                      <h3 className="font-semibold text-lg">
                        اسم الاختبار: {exam.title}
                      </h3>
                      {/* Uncomment if you want to show student info */}
                      {/* <p className="text-sm text-purple-600">
                        الطالب: {student.name} ({student.username})
                      </p> */}
                    </div>

                    <div className="bg-gray-50 rounded-md p-3 mt-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          الأسئلة: {total}
                        </p>
                        <p className="text-sm text-gray-500">
                          النقاط: {scoreSum}
                        </p>
                      </div>
                      <div
                        className={`text-lg font-bold ${
                          percentage >= 50 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {percentage}%
                      </div>
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;