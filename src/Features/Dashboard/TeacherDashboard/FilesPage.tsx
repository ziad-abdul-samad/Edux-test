import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Search,
  File,
  FileText,
  FileImage,
  FileVideo,
  Plus,
  Trash2,
  Edit,
  Loader2,
  AlertTriangle,
  Cog,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
import { addNewCategory } from "./services/categoryMutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UpdateCategory } from "./services/UpdateCategory";
import { DeleteCategory } from "./services/DeleteCategory";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { addNewFile } from "./services/AddNewFile";
import { deleteFile } from "./services/DeleteFile";
import { UpdateFileCat } from "./services/UpdateFileCat";
import { Progress } from "@/components/ui/progress";

const FilesLibrary = () => {
  //Add Category
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const { mutate } = useMutation({
    mutationFn: addNewCategory,
    onSuccess: () => {
      setIsAddCategoryOpen(false);
      queryClient.invalidateQueries({ queryKey: ["libraryCategories"] });
    },
    onError: (e) => {
      console.error("Error adding student:", e);
    },
  });
  //manage category
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDialogOpenId, setEditDialogOpenId] = useState<number | null>(null);
  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: UpdateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryCategories"] });
      toast({
        title: "تم التحديث",
        description: "تم تعديل بيانات التصنيف بنجاح",
      });
      setEditDialogOpenId(null);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تعديل بيانات التصنيف",
        variant: "destructive",
      });
    },
  });
  // Delete students mutation
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const { mutate: removeCategoty } = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryCategories"] });
      setCategoryToDelete(null);
      toast({
        title: "تم حذف التصنيف",
        description: "تم حذف التصنيف وجميع ملفاته من النظام بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة حذف التصنيف",
        variant: "destructive",
      });
    },
  });
  const FILES_BASE_URL = "https://edux.site/";
  const queryClient = useQueryClient();

  // Fetch categories and files
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isPending,
  } = useQuery({
    queryKey: ["libraryCategories"],
    queryFn: getLibraryCategories,
  });

  const { data: filesData, isLoading: filesLoading } = useQuery({
    queryKey: ["publishedFiles"],
    queryFn: getPublishedFiles,
  });
  //Add file
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedUploadCategoryId, setSelectedUploadCategoryId] = useState<
    number | null
  >(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutate: addingFile } = useMutation({
    mutationFn: (data: {
      formData: FormData;
      onProgress: (progress: number) => void;
    }) => {
      setIsUploading(true);
      setUploadProgress(0);
      return addNewFile(data.formData, (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          data.onProgress(progress);
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishedFiles"] });
      setIsUploading(false);
      setUploadProgress(0);
      setIsUploadDialogOpen(false);
      toast({
        title: "تم رفع الملف بنجاح",
        description: "تمت إضافة الملف إلى المكتبة",
      });
    },
    onError: () => {
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "خطأ في الرفع",
        description: "فشل في رفع الملف",
        variant: "destructive",
      });
    },
  });

  const [editFileCat, setEditFileCat] = useState<number | null>(null);
  const [editFileDialogOpenId, setEditFileDialogOpenId] = useState<
    number | null
  >(null);

  const { mutate: updateFileCat } = useMutation({
    mutationFn: UpdateFileCat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishedFiles"] });
      toast({
        title: "تم التحديث",
        description: "تم تعديل تصنيف الملف",
      });
      setEditFileDialogOpenId(null);
      setEditFileCat(null);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تعديل تصنيف الملف",
        variant: "destructive",
      });
    },
  });
  //delete file
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);
  const { mutate: removeFile } = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishedFiles"] });
      setFileToDelete(null);
      toast({
        title: "تم حذف الملف",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة حذف الملف",
        variant: "destructive",
      });
    },
  });
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
        <div className="flex items-center gap-1 md:flex-row flex-col">
          <div className="flex items-center gap-1 ">
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              {" "}
              رفع ملف
              <Plus />{" "}
            </Button>
          </div>

          <Button variant="outline" onClick={() => setIsManageDialogOpen(true)}>
            إدارة التصنيفات <Cog />
          </Button>
        </div>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setFileToDelete(file.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditFileCat(file.category_id);
                        setEditFileDialogOpenId(file.id);
                      }}
                    >
                      <Edit size={16} />
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
                        <h3 className="font-medium">
                          {" "}
                          {cleanFileName(file.file)}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                            {file.files_category?.name}
                          </span>
                          <span>
                            تم الرفع:{" "}
                            {new Date(file.created_at).toLocaleDateString(
                              "EG-ar"
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
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة طالب جديد</DialogTitle>
            <DialogDescription>
              ابحث عن طالب موجود أو قم بإنشاء طالب جديد
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutate({
                name,
              });
            }}
            className="space-y-4 py-2"
          >
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                placeholder="أدخل اسم التصنيف"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "جاري الإضافة..." : "إضافة التصنيف"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right mt-3">
              إدارة التصنيفات
            </DialogTitle>
            <DialogDescription className="text-right mt-3">
              عرض جميع التصنيفات المضافة
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setIsAddCategoryOpen(true)}>
            <Plus className="ml-2 rtl-flip" size={16} />
            إضافة تصنيف جديد
          </Button>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">لا توجد تصنيفات حالياً</p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between border rounded-md px-3 py-2 text-sm bg-muted/5 hover:bg-muted/50"
                >
                  <span>{category.name}</span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setCategoryToDelete(category.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditName(category.name);
                        setEditDialogOpenId(category.id);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsManageDialogOpen(false)}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={editDialogOpenId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditDialogOpenId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل اسم التصنيف</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="edit-name">اسم التصنيف</Label>
              <Input
                className="mt-2"
                id="edit-name"
                placeholder={editName}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              disabled={isUpdating}
              onClick={() => {
                if (!editName || editDialogOpenId === null) return;
                updateCategory({
                  name: editName,
                  id: editDialogOpenId,
                });
              }}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={categoryToDelete !== null}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف التصنيف؟</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              سيتم حذف جميع الملفات التي تنتمي إلى هذا التصنيف أيضًا. هل تريد
              التأكيد؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                if (categoryToDelete) {
                  removeCategoty(categoryToDelete);
                }
              }}
            >
              <AlertTriangle className="ml-2 h-4 w-4" />
              حذف التصنيف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={isUploadDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isUploading) {
            setIsUploadDialogOpen(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفع ملف جديد</DialogTitle>
            <DialogDescription>
              اختر الملف والتصنيف الذي ينتمي إليه
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">اختر الملف</Label>
              <Input
                type="file"
                id="file"
                required
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setSelectedFile(file || null);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">اختر التصنيف</Label>
              <Select
                onValueChange={(value) =>
                  setSelectedUploadCategoryId(Number(value))
                }
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر تصنيفًا" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>جاري الرفع...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  if (!isUploading) {
                    setIsUploadDialogOpen(false);
                  }
                }}
                disabled={isUploading}
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (!selectedFile || !selectedUploadCategoryId) {
                    toast({
                      title: "خطأ",
                      description: "يرجى اختيار الملف والتصنيف",
                      variant: "destructive",
                    });
                    return;
                  }

                  const formData = new FormData();
                  formData.append("file", selectedFile);
                  formData.append(
                    "category_id",
                    String(selectedUploadCategoryId)
                  );

                  addingFile({
                    formData,
                    onProgress: setUploadProgress,
                  });
                }}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  "رفع"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={fileToDelete !== null}
        onOpenChange={(open) => !open && setFileToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              تأكيد حذف الملف
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                if (fileToDelete) {
                  removeFile(fileToDelete);
                }
              }}
            >
              <AlertTriangle className=" h-4 w-4" />
              حذف الملف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={editFileDialogOpenId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditFileDialogOpenId(null);
            setEditFileCat(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل تصنيف الملف</DialogTitle>
            <DialogDescription>اختر تصنيفًا جديدًا للملف</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="file-category">التصنيف</Label>
              <Select
                value={editFileCat ? String(editFileCat) : ""}
                onValueChange={(value) => setEditFileCat(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر تصنيفًا جديدًا" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              onClick={() => {
                if (editFileDialogOpenId && editFileCat) {
                  updateFileCat({
                    id: editFileDialogOpenId,
                    category_id: editFileCat,
                  });
                }
              }}
            >
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilesLibrary;
