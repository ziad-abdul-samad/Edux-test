import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { getStudentLibraryFiles } from "./services/getStudentLibraryFiles";
import { StudentFile } from "./types/GetStudentLibraryFiles";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, FileText, FileImage } from "lucide-react";

const cleanFileName = (fullPath: string) => {
  const fileNameWithDate = fullPath.split("/").pop() || fullPath;
  const underscoreIndex = fileNameWithDate.indexOf("_");

  if (underscoreIndex === -1) {
    return fileNameWithDate;
  }

  const namePart = fileNameWithDate.substring(0, underscoreIndex);
  const extension = fileNameWithDate.substring(
    fileNameWithDate.lastIndexOf(".")
  );
  return namePart + extension;
};

const getFileIcon = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FileText className="h-6 w-6 text-red-600" />;
  if (["png", "jpg", "jpeg", "webp"].includes(ext || ""))
    return <FileImage className="h-6 w-6 text-green-600" />;
  return <FileText className="h-6 w-6 text-gray-600" />;
};

const LibraryPage = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["studentLibraryFiles"],
    queryFn: getStudentLibraryFiles,
  });

  if (error) console.error("API Error:", error);
  console.log("Fetched files data:", data);

  const files: StudentFile[] = Array.isArray(data?.data?.data)
    ? data.data.data
    : [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  // تجميع التصنيفات بدون تكرار
  const categories = [
    { id: 0, name: "جميع التصنيفات" },
    ...Array.from(
      new Map(
        files.map((f) => [f.files_category.id, f.files_category])
      ).values()
    ),
  ];

  // تجميع المعلمين بدون تكرار بناءً على teacher_id
  const teachers = [
    { id: 0, name: "جميع المعلمين" },
    ...Array.from(
      new Map(
        files.map((f) => [
          f.teacher_id,
          { id: f.teacher_id, name: ` ${f.teacher.name}:المعلم` },
        ])
      ).values()
    ),
  ];

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.file
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "0" ||
      file.files_category.id.toString() === selectedCategory;

    const matchesTeacher =
      !selectedTeacher ||
      selectedTeacher === "0" ||
      file.teacher_id.toString() === selectedTeacher;

    return matchesSearch && matchesCategory && matchesTeacher;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">مكتبة الملفات</h1>
      </div>

      <p className="text-gray-600">
        استعرض الملفات التعليمية التي شاركها معلموك
      </p>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن ملف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* فلتر التصنيفات */}
        {categories.length > 1 && (
          <Select
            value={selectedCategory || "0"}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* فلتر المعلمين */}
        {teachers.length > 1 && (
          <Select
            value={selectedTeacher || "0"}
            onValueChange={(value) => setSelectedTeacher(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="المعلم" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">عرض شبكي</TabsTrigger>
          <TabsTrigger value="list">عرض قائمة</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isPending ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                جارٍ تحميل الملفات...
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                لا توجد ملفات مطابقة للبحث
              </div>
            ) : (
              filteredFiles.map((file, index) => {
                const fileUrl = `https://edux.site/backend/public/${file.file}`;

                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow h-full flex flex-col">
                      <div className="mb-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.file)}
                          <div className="flex-1 overflow-hidden">
                            <h3
                              className="font-medium truncate"
                              title={file.file}
                            >
                              {cleanFileName(file.file)}{" "}
                            </h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                                {file.files_category.name}
                              </span>
                              <span className="text-xs bg-gray-50 text-gray-700 px-1.5 py-0.5 rounded">
                                {new Date(file.created_at).toLocaleDateString(
                                  "EG-ar"
                                )}
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                {file.teacher.name}:اسم المعلم
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto pt-2 flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={fileUrl} target="_blank" rel="noreferrer">
                            عرض
                          </a>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            {isPending ? (
              <div className="text-center py-12 text-muted-foreground">
                جارٍ تحميل الملفات...
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                لا توجد ملفات مطابقة للبحث
              </div>
            ) : (
              <div className="divide-y">
                {filteredFiles.map((file, index) => {
                  const fileUrl = `https://edux.site/backend/public/${file.file}`;

                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.file)}
                        <div>
                          <h3 className="font-medium">
                            {cleanFileName(file.file)}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                              {file.files_category.name}
                            </span>
                            <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full hidden lg:block">
                              {new Date(file.created_at).toLocaleDateString(
                                "EG-ar"
                              )}
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              {file.teacher.name}:اسم المعلم
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={fileUrl} target="_blank" rel="noreferrer">
                            عرض
                          </a>
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LibraryPage;
