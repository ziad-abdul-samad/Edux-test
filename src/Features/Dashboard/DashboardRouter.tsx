import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDashboard from "./UserDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  User,
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen,
  FolderOpen,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const DashboardRouter = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username"); // or "name" if that's the key
    if (!storedRole) {
      navigate("/login");
    } else {
      setRole(storedRole);
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const renderNavItems = () => {
    switch (role) {
      case "user":
        return (
          <>
            <Button
              variant="default"
              className="justify-start w-full text-right"
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard className="ml-2 rtl-flip" />
              لوحة التحكم
            </Button>
          </>
        );
      case "teacher":
        return (
          <>
            <Button
              variant="default"
              className="justify-start w-full text-right"
              onClick={() => navigate("/dashboard/teacher")}
            >
              <LayoutDashboard className="ml-2 rtl-flip" />
              لوحة التحكم
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-right"
              onClick={() => navigate("/dashboard/students")}
            >
              <Users className="ml-2 rtl-flip" />
              الطلاب
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-right"
              onClick={() => navigate("/dashboard/quizzes/manage")}
            >
              <BookOpen className="ml-2 rtl-flip" />
              الاختبارات
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-right"
              onClick={() => navigate("/dashboard/files")}
            >
              <FolderOpen className="ml-2 rtl-flip" />
              مكتبة الملفات
            </Button>
          </>
        );
      case "student":
        return (
          <>
            <Button
              variant="default"
              className="justify-start w-full text-right"
              onClick={() => navigate("/dashboard/student")}
            >
              <LayoutDashboard className="ml-2 rtl-flip" />
              الرئيسية
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-right"
              onClick={() => navigate("/dashboard/quizzes")}
            >
              <BookOpen className="ml-2 rtl-flip" />
              الاختبارات
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-right"
              onClick={() => navigate("/dashboard/results")}
            >
              <BookOpen className="ml-2 rtl-flip" />
              النتائج السابقة
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-right"
              onClick={() => navigate("/dashboard/my-teachers")}
            >
              <Users className="ml-2 rtl-flip" />
              الاشتراكات
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-right"
              onClick={() => navigate("/dashboard/library")}
            >
              <FolderOpen className="ml-2 rtl-flip" />
              مكتبة الملفات
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  const renderDashboardComponent = () => {
    switch (role) {
      case "user":
        return <UserDashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "student":
        return <StudentDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-l w-full lg:w-64 p-4 lg:min-h-screen"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="font-bold text-xl text-purple-700">Edux</div>
        </div>

        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2 mb-4 p-2 bg-purple-50 rounded-lg">
            <User className="rtl-flip text-purple-700" />
            <div>
              <p className="font-medium">{username || "User"}</p>
              <p className="text-sm text-muted-foreground">
                {role === "user"
                  ? "مدير النظام"
                  : role === "teacher"
                  ? "معلم"
                  : "طالب"}
              </p>
            </div>
          </div>

          <Separator className="my-4" />
          <nav className="space-y-1">{renderNavItems()}</nav>
        </div>

        <div className="mt-auto pt-6">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="ml-2 rtl-flip" size={18} />
            تسجيل الخروج
          </Button>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 p-6"
      >
        {renderDashboardComponent()}
      </motion.main>
    </div>
  );
};

export default DashboardRouter;
