import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Key,
  Search,
  Trash2,
  Users,
  Loader2,
  Plus,
  User,
} from "lucide-react";
import { Label } from "@/components/ui/label";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { GetStudents } from "./services/GetStudentsService";
import { deleteStudent } from "./services/DeleteStudent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const StudentPage = () => {
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // Fetch teachers
  const { data, isPending, error } = useQuery({
    queryKey: ["teachersDash"],
    queryFn: GetStudents,
  });

  // Delete teacher mutation
  const { mutate: removeStudent } = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachersDash"] });
      setStudentToDelete(null);
      toast({
        title: "تم حذف الطالب",
        description: "تم حذف الطالب وجميع بياناته من النظام بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة حذف الطالب",
        variant: "destructive",
      });
    },
  });
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  if (error) {
    return <div>حدث خطأ: {(error as Error).message}</div>;
  }

  if (isPending) {
    return (
      <div className="py-8 flex justify-center items-center h-full w-full   rounded-md max-w-md mx-auto">
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

  const students = data?.data.students ?? [];
  const filteredStudents = students.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة الطلاب</h1>
        <Link to="/dashboard/manage-passwords">
          <Button onClick={() => setIsAddStudentOpen(true)}>
            <Plus className="ml-2 rtl-flip" size={16} />
            إضافة طالب جديد
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="بحث عن طالب..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            لا يوجد طلاب مسجلين حالياً
          </div>
        ) : (
          filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-500">
                        {student.username}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setStudentToDelete(student.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  {/* To DO : Add Exams counts for each student  */}
                  <span>{0} اختبار مكتمل</span>
                  <span>
                    تم الإضافة:{" "}
                    {new Date(student.created_at).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
{/* 
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة طالب جديد</DialogTitle>
            <DialogDescription>
              ابحث عن طالب موجود أو قم بإنشاء طالب جديد
            </DialogDescription>
          </DialogHeader>

          {!isSearching ? (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="ابحث عن طالب بالاسم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleSearchStudents} type="button">
                  بحث
                </Button>
              </div>
              <div className="text-center text-sm text-gray-500">أو</div>
              <div className="space-y-2">
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  placeholder="أدخل اسم الطالب"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  placeholder="أدخل اسم مستخدم للطالب"
                  value={newStudent.username}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة مرور للطالب"
                  value={newStudent.password}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, password: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <Button
                variant="outline"
                className="mb-4"
                onClick={() => {
                  setIsSearching(false);
                  setSelectedStudent(null);
                  setSearchResults([]);
                }}
              >
                العودة إلى إنشاء طالب جديد
              </Button>

              {searchResults.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  لم يتم العثور على طلاب. يمكنك إنشاء طالب جديد.
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">اختر طالب من القائمة:</p>
                  {searchResults.map((student) => (
                    <div
                      key={student.id}
                      className={`p-3 border rounded-md cursor-pointer flex items-center justify-between ${
                        selectedStudent?.id === student.id
                          ? "bg-purple-50 border-purple-200"
                          : ""
                      }`}
                      onClick={() => handleSelectStudent(student)}
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">
                            {student.username}
                          </p>
                        </div>
                      </div>
                      {students.some((s) => s.id === student.id) && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          مضاف بالفعل
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddStudentOpen(false);
                setIsSearching(false);
                setSelectedStudent(null);
                setSearchResults([]);
                setNewStudent({ username: "", password: "", name: "" });
              }}
            >
              إلغاء
            </Button>
            <Button onClick={handleAddStudent}>
              {selectedStudent ? "إضافة الطالب المحدد" : "إنشاء طالب جديد"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <AlertDialog
        open={studentToDelete !== null}
        onOpenChange={(open) => !open && setStudentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف الطالب</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من أنك تريد حذف هذا الطالب من قائمة طلابك؟ <br /> لن يتمكن
              الطالب من الوصول إلى اختباراتك بعد الآن.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                if (studentToDelete) {
                  removeStudent(studentToDelete);
                }
              }}
            >
              <AlertTriangle className="ml-2 h-4 w-4" />
              حذف الطالب
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentPage;
