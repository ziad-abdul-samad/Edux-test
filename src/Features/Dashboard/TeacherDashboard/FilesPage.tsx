import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Search, File, FileText, FileImage, FileVideo } from "lucide-react";

import { getLibraryCategories } from "./services/getLibraryCategories";
import { getPublishedFiles } from "./services/getPublishedFiles";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FilesLibrary = () => {
  const FILES_BASE_URL = "https://edux.site/";

  // Fetch categories and files
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["libraryCategories"],
    queryFn: getLibraryCategories,
  });

  const { data: filesData, isLoading: filesLoading } = useQuery({
    queryKey: ["publishedFiles"],
    queryFn: getPublishedFiles,
  });
  console.log(filesData);
  // Local state for filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.isArray(categoriesData?.data?.data)
    ? categoriesData.data.data
    : [];
  const files = Array.isArray(filesData?.data?.data) ? filesData.data.data : [];
  // Filter files based on search and category
  const filteredFiles = files.filter((file) => {
    const filename = file.file || "";
    const categoryName = file.files_category?.name || "";

    const matchesSearch =
      filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (categoriesLoading || filesLoading) {
    return <div>جاري التحميل...</div>;
  }
  const cleanFileName = (fullPath: string) => {
    // Step 1: Get the last part after "/"
    const fileNameWithDate = fullPath.split("/").pop() || fullPath; // e.g. frame_20250715_081049.png

    // Step 2: Split by first underscore
    const underscoreIndex = fileNameWithDate.indexOf("_");

    if (underscoreIndex === -1) {
      // no underscore, return original name
      return fileNameWithDate;
    }

    // Step 3: Extract the prefix before underscore and the extension after the last dot
    const namePart = fileNameWithDate.substring(0, underscoreIndex); // "frame"
    const extension = fileNameWithDate.substring(
      fileNameWithDate.lastIndexOf(".")
    ); // ".png"

    return namePart + extension; // "frame.png"
  };

  // Helper for icon based on file extension
  const getFileIcon = (filePath: string) => {
    const ext = filePath.split(".").pop()?.toLowerCase() || "";
    switch (ext) {
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <FileImage className="h-6 w-6 text-purple-600" />;
      case "mp4":
      case "mov":
      case "avi":
        return <FileVideo className="h-6 w-6 text-blue-600" />;
      case "pdf":
      case "doc":
      case "docx":
        return <FileText className="h-6 w-6 text-amber-600" />;
      default:
        return <File className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">مكتبة الملفات</h1>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 max-w-sm flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن ملف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {categories.length > 0 && (
          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) =>
              setSelectedCategory(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التصنيفات</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
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

        {/* Grid View */}
        <TabsContent value="grid" className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                لا توجد ملفات مطابقة للبحث
              </div>
            ) : (
              filteredFiles.map((file) => (
                <Card
                  key={file.id}
                  className="p-4 hover:shadow-md transition-shadow h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.file)}
                      <div className="flex-1 truncate ">
                        <h3 className="font-medium" title={file.file}>
                          {cleanFileName(file.file)}
                        </h3>

                        <p className="text-xs text-gray-500 truncate">
                          {file.files_category?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-2 flex justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <a
                        href={`${FILES_BASE_URL}${file.file}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        عرض
                      </a>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="w-full">
          <Card>
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                لا توجد ملفات مطابقة للبحث
              </div>
            ) : (
              <div className="divide-y">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.file)}
                      <div>
                        <h3 className="font-medium">{file.file}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                            {file.files_category?.name}
                          </span>
                          <span>
                            تم الرفع:{" "}
                            {new Date(file.created_at).toLocaleDateString(
                              "ar-EG"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`${FILES_BASE_URL}${file.file}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          عرض
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FilesLibrary;
