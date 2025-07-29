import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Users } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeachers } from "./services/TeacherService";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addNewTeacher } from "./services/AddNewTeacher";
import { Switch } from "@/components/ui/switch";

const UserDashboard = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password_confirmation, setCPassword] = useState<string>("");
  const [is_active, setIsActive] = useState(true);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isPending: isAdding } = useMutation({
    mutationFn: addNewTeacher,
    onSuccess: () => {
      setIsAddTeacherOpen(false);
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (e) => {
      console.error("Error adding teacher:", e);
    },
  });

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

  const teachers = data?.teachers.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="md:text-3xl font-bold text-base">لوحة تحكم المدير</h1>
        <Button onClick={() => setIsAddTeacherOpen(true)}>
          <Plus className="ml-2 rtl-flip" size={16} />
          إضافة معلم جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المعلمين
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalTeachers}</div>
              <p className="text-xs text-muted-foreground">
                المعلمين المسجلين في المنصة
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">قائمة المعلمين</h2>
        </div>
        <div className="p-4">
          {data?.totalTeachers === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا يوجد معلمين مسجلين حالياً
            </div>
          ) : (
            <div className="divide-y">
              {teachers.map((teacher) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-sm text-gray-500">
                      اسم المستخدم: {teacher.username}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {teacher.students_count || 0} طالب |{" "}
                      {teacher.exams_count || 0} اختبار
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddTeacherOpen} onOpenChange={setIsAddTeacherOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة معلم جديد</DialogTitle>
            <DialogDescription>
              قم بإدخال بيانات المعلم لإضافته إلى المنصة
            </DialogDescription>
          </DialogHeader>
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
                placeholder="أدخل اسم المعلم"
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
                placeholder="أدخل اسم مستخدم للمعلم"
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
                placeholder="أدخل كلمة مرور للمعلم مرة ثانية"
                value={password_confirmation}
                onChange={(e) => setCPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 flex items-center">
              <Label htmlFor="Active">مشترك؟</Label>
              <Switch
                checked={is_active}
                onCheckedChange={setIsActive}
                aria-label="مشترك؟"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddTeacherOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جارٍ الإضافة...
                  </>
                ) : (
                  "إضافة المعلم"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
