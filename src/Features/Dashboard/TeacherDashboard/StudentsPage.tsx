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
  Edit,
} from "lucide-react";
import { Label } from "@/components/ui/label";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
import { addNewStudent } from "./services/AddNewStudent";
import { AssignStudent } from "./services/AssignSTT";
import { UpdateStudent } from "./services/UpdateStudent";

const StudentPage = () => {
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editDialogOpenId, setEditDialogOpenId] = useState<number | null>(null);
  const [isExistingStudent, setIsExistingStudent] = useState(false);
  const [existingUsername, setExistingUsername] = useState("");
  const queryClient = useQueryClient();

  // Fetch students
  const { data, isPending, error } = useQuery({
    queryKey: ["teachersDash"],
    queryFn: GetStudents,
  });

  const { mutate: updateStudent, isPending: isUpdating } = useMutation({
    mutationFn: UpdateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachersDash"] });
      toast({
        title: "تم التحديث",
        description: "تم تعديل بيانات الطالب بنجاح",
      });
      setEditDialogOpenId(null);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تعديل بيانات المعلم",
        variant: "destructive",
      });
    },
  });
  // Delete students mutation
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

  //Add Student
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password_confirmation, setCPassword] = useState<string>("");
  const [is_active, setIsActive] = useState(true);
  const { mutate, isPending: isAddingNewStudent } = useMutation({
    mutationFn: addNewStudent,
    onSuccess: () => {
      setIsAddStudentOpen(false);
      queryClient.invalidateQueries({ queryKey: ["teachersDash"] });
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة الطالب الجديد بنجاح",
      });
      setName("");
      setUsername("");
      setPassword("");
      setCPassword("");
    },
    onError: (e) => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة الطالب الجديد",
        variant: "destructive",
      });
      console.error("Error adding student:", e);
    },
  });
  const { mutate: assign, isPending: isAssigning } = useMutation({
    mutationFn: AssignStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachersDash"] });
      setIsAddStudentOpen(false);
      setExistingUsername("");
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة الطالب الموجود بنجاح",
      });
    },
    onError: (e) => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة الطالب الموجود تأكد من اسم المستخدم الخاص به",
        variant: "destructive",
      });
      console.error("Error assigning student:", e);
    },
  });

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  if (error) {
    return <div>حدث خطأ: {(error as Error).message}</div>;
  }

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
        <Button onClick={() => setIsAddStudentOpen(true)}>
          <Plus className="ml-2 rtl-flip" size={16} />
          إضافة طالب جديد
        </Button>
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
                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setStudentToDelete(student.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditName(student.name);
                        setEditUsername(student.username);
                        setEditDialogOpenId(student.id);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
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

      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة طالب</DialogTitle>
            <DialogDescription>
              اختر بين إضافة طالب جديد أو إضافة طالب موجود مسبقاً
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant={isExistingStudent ? "outline" : "default"}
              onClick={() => setIsExistingStudent(false)}
              className="flex-1"
            >
              طالب جديد
            </Button>
            <Button
              variant={isExistingStudent ? "default" : "outline"}
              onClick={() => setIsExistingStudent(true)}
              className="flex-1"
            >
              طالب موجود
            </Button>
          </div>

          {isExistingStudent ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                assign({ username: existingUsername });
              }}
              className="space-y-4 py-2"
            >
              <div className="space-y-2">
                <Label htmlFor="existing-username">اسم المستخدم</Label>
                <Input
                  id="existing-username"
                  placeholder="أدخل اسم مستخدم الطالب"
                  value={existingUsername}
                  onChange={(e) => setExistingUsername(e.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={isAssigning}>
                  {isAssigning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    "إضافة الطالب"
                  )}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutate({
                  name,
                  username,
                  password,
                  password_confirmation,
                  is_active,
                });
              }}
              className="space-y-4 py-2"
            >
              <div className="space-y-2">
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  placeholder="أدخل اسم الطالب"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  placeholder="أدخل اسم مستخدم للطالب"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة مرور للمعلم"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Cpassword">تأكيد كلمة المرور</Label>
                <Input
                  id="Cpassword"
                  type="password"
                  placeholder="أدخل كلمة مرور للطالب مرة ثانية"
                  value={password_confirmation}
                  onChange={(e) => setCPassword(e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={isAddingNewStudent}>
                  {isAddingNewStudent ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    "إضافة الطالب"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={studentToDelete !== null}
        onOpenChange={(open) => !open && setStudentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف الطالب</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من أنك تريد حذف هذا الطالب من قائمة طلابك؟ <br /> لن
              يتمكن الطالب من الوصول إلى اختباراتك بعد الآن.
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

      {/* Edit Teacher Dialog */}
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
            <DialogTitle>تعديل بيانات الطالب</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="edit-name">اسم الطالب</Label>
              <Input
                className="mt-2"
                id="edit-name"
                placeholder={editName}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-username">اسم المستخدم</Label>
              <Input
                className="mt-2"
                id="edit-username"
                placeholder={editUsername}
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              disabled={isUpdating}
              onClick={() => {
                if (!editName || !editUsername || editDialogOpenId === null)
                  return;
                updateStudent({
                  name: editName,
                  username: editUsername,
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
    </div>
  );
};

export default StudentPage;