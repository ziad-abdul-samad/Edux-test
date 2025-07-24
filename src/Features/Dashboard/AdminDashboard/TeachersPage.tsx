import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Key,
  Search,
  Trash2,
  Users,
  Loader2,
  Edit,
  KeyRound,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeachers } from "./services/TeacherService";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { deleteTeacher } from "./services/DeleteTeacher";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { changeActiveTeacherFunc } from "./services/ChangeActiveTeacher";
import { UpdateTeacher } from "./services/UpdateTeacher";
import { changeTeacherPassword } from "./services/UpdateTeacherPassword";

const TeachersPage = () => {
  const [teacherToDelete, setTeacherToDelete] = useState<number | null>(null);
  const [editDialogOpenId, setEditDialogOpenId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [changingPasswordId, setChangingPasswordId] = useState<number | null>(
    null
  );
  const [openPasswordEditorId, setOpenPasswordEditorId] = useState<
    number | null
  >(null);
  const [passwordSearchQuery, setPasswordSearchQuery] = useState("");
  const [newPasswords, setNewPasswords] = useState<{ [id: number]: string }>(
    {}
  );
  const { mutate: changePassword, isPending: isChangingPassword } = useMutation(
    {
      mutationFn: ({
        id,
        new_password,
      }: {
        id: number;
        new_password: string;
      }) => changeTeacherPassword(id, { new_password }),
      onSuccess: () => {
        setPasswordDialogOpen(false)
        toast({
          title: "تم تغيير كلمة المرور",
          description: "تم تغيير كلمة مرور المعلم بنجاح",
        });
        queryClient.invalidateQueries({ queryKey: ["teachers"] });
        setChangingPasswordId(null);
        setNewPasswords({});
      },
      onError: () => {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تغيير كلمة المرور",
          variant: "destructive",
        });
      },
    }
  );

  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const { mutate: updateTeacher, isPending: isUpdating } = useMutation({
    mutationFn: UpdateTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({
        title: "تم التحديث",
        description: "تم تعديل بيانات المعلم بنجاح",
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
  const { mutate: removeTeacher } = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setTeacherToDelete(null);
      toast({
        title: "تم حذف المعلم",
        description: "تم حذف المعلم وجميع بياناته من النظام بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة حذف المعلم",
        variant: "destructive",
      });
    },
  });

  const { mutate: toggleActive } = useMutation({
    mutationFn: ({
      teacherId,
      isActive,
    }: {
      teacherId: number;
      isActive: boolean;
    }) => changeActiveTeacherFunc(teacherId, isActive),
    onMutate: ({ teacherId }) => {
      setLoadingIds((prev) => [...prev, teacherId]);
    },
    onSettled: (data, error, variables) => {
      setLoadingIds((prev) => prev.filter((id) => id !== variables.teacherId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({
        title: "تم التحديث",
        description: "تم تغيير حالة المعلم بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل تغيير حالة المعلم",
        variant: "destructive",
      });
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
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPasswordTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(passwordSearchQuery.toLowerCase()) ||
      teacher.username.toLowerCase().includes(passwordSearchQuery.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="md:text-3xl text-lg font-bold">إدارة المعلمين</h1>
        <Button variant="outline" onClick={() => setPasswordDialogOpen(true)}>
          <Key className="ml-2 rtl-flip" size={16} />
          إدارة كلمات المرور
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="بحث عن معلم..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
              {filteredTeachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="py-3 flex items-center justify-between md:flex-row flex-col gap-3 md:gap-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[14px] md:text-lg">
                        {teacher.name}
                      </p>
                      <Badge
                        variant={teacher.is_active ? "outline" : "destructive"}
                        className={
                          teacher.is_active
                            ? "bg-green-50 text-green-700 hover:bg-green-50"
                            : ""
                        }
                      >
                        {teacher.is_active ? "نشط" : "متوقف"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      className="cursor-default"
                      variant="outline"
                      size="sm"
                    >
                      <Users className="ml-2 h-4 w-4" />
                      {teacher.students_count} طالب
                    </Button>
                    <div className="relative">
                      <Switch
                        checked={teacher.is_active}
                        disabled={loadingIds.includes(teacher.id)}
                        onCheckedChange={(checked) =>
                          toggleActive({
                            teacherId: teacher.id,
                            isActive: checked,
                          })
                        }
                      />
                      {loadingIds.includes(teacher.id) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded">
                          <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditName(teacher.name);
                        setEditUsername(teacher.username);
                        setEditDialogOpenId(teacher.id);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setTeacherToDelete(teacher.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={teacherToDelete !== null}
        onOpenChange={(open) => !open && setTeacherToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف المعلم</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد حذف هذا المعلم؟ سيتم حذف جميع البيانات
              المرتبطة به، بما في ذلك الطلاب والاختبارات والملفات. هذا الإجراء
              لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                if (teacherToDelete) {
                  removeTeacher(teacherToDelete);
                }
              }}
            >
              <AlertTriangle className="ml-2 h-4 w-4" />
              حذف المعلم
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
            <DialogTitle>تعديل بيانات المعلم</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="edit-name">اسم المعلم</Label>
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
                updateTeacher({
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
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إدارة كلمات مرور المعلمين</DialogTitle>
          </DialogHeader>

          <div className="mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن معلم..."
              value={passwordSearchQuery}
              onChange={(e) => setPasswordSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {filteredPasswordTeachers.length === 0 ? (
              <p className="text-center text-muted-foreground">
                لا يوجد معلمين مطابقين
              </p>
            ) : (
              filteredPasswordTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-lg">{teacher.name}</p>
                    <p className="text-sm text-muted-foreground">
                      اسم المستخدم: {teacher.username}
                    </p>
                  </div>

                  <div>
                    <Button
                      variant="outline"
                      onClick={() => setOpenPasswordEditorId(teacher.id)}
                    >
                      <KeyRound className="w-4 h-4 mr-2" />
                      تغيير كلمة المرور
                    </Button>

                    {/* ⬇️ Password Update Nested Dialog */}
                    <Dialog
                      open={openPasswordEditorId === teacher.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setOpenPasswordEditorId(null);
                          setChangingPasswordId(null);
                        }
                      }}
                    >
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>تغيير كلمة المرور</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                          <Label htmlFor={`password-${teacher.id}`}>
                            كلمة المرور الجديدة لـ {teacher.name}
                          </Label>
                          <Input
                            id={`password-${teacher.id}`}
                            type="password"
                            placeholder="أدخل كلمة المرور الجديدة"
                            value={newPasswords[teacher.id] || ""}
                            onChange={(e) =>
                              setNewPasswords((prev) => ({
                                ...prev,
                                [teacher.id]: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <DialogFooter className="pt-4">
                          <Button
                            onClick={() => {
                              if (!newPasswords[teacher.id]) return;
                              setChangingPasswordId(teacher.id);
                              changePassword({
                                id: teacher.id,
                                new_password: newPasswords[teacher.id],
                              });
                            }}
                            disabled={
                              isChangingPassword &&
                              changingPasswordId === teacher.id
                            }
                          >
                            {isChangingPassword &&
                            changingPasswordId === teacher.id ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <Key className="w-4 h-4 mr-2" />
                            )}
                            تأكيد التغيير
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {/* ⬆️ End Nested Dialog */}
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              
              onClick={() => setPasswordDialogOpen(false)}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachersPage;
