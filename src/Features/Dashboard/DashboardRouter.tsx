import { useEffect, useState } from "react";
import { Routes, useNavigate, Route, useLocation } from "react-router-dom";
import UserDashboard from "./AdminDashboard/UserDashboard";
import TeacherDashboard from "./TeacherDashboard/TeacherDashboard";
import StudentDashboard from "./StudentDashboard/StudentDashboard";
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
import TeachersPage from "./AdminDashboard/TeachersPage";
import StudentsPage from "./TeacherDashboard/StudentsPage";
import ExamsPage from "./TeacherDashboard/ExamsPage";
import { useQuery } from "@tanstack/react-query";
import { LoginInfo } from "../Login/services/LoginInfo";
import CreateExamPage from "./TeacherDashboard/CreateExamPage";
import EditExamPage from "./TeacherDashboard/EditExamPage";
import StudentExamsPage from "./StudentDashboard/StudentExamsPage";
import TakeExam from "./StudentDashboard/TakeExam";
import Subscriptionspage from "./StudentDashboard/Subscriptionspage";

const DashboardRouter = () => {
  // const { data } = useQuery({
  //     queryKey: ["logininfo"],
  //     queryFn: LoginInfo,
  //   });
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      navigate("/login");
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const isExact = (path: string) => location.pathname === path;

  const renderNavItems = () => {
    switch (role) {
      case "user":
        return (
          <>
            <Button
              variant={isExact("/dashboard") ? "default" : "ghost"}
              className={`justify-start w-full text-right ${
                isExact("/dashboard")
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : ""
              }`}
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard className="ml-2 rtl-flip" />
              لوحة التحكم
            </Button>
            <Button
              variant={isActive("/dashboard/teachers") ? "default" : "ghost"}
              className={`justify-start w-full text-right ${
                isActive("/dashboard/teachers")
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : ""
              }`}
              onClick={() => navigate("/dashboard/teachers")}
            >
              <Users className="ml-2 rtl-flip" />
              المعلمين
            </Button>
          </>
        );
      case "teacher":
        return (
          <>
            <Button
              variant={isExact("/dashboard") ? "default" : "ghost"}
              className={`justify-start w-full text-right ${
                isExact("/dashboard")
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : ""
              }`}
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard className="ml-2 rtl-flip" />
              لوحة التحكم
            </Button>
            <Button
              variant={isActive("/dashboard/students") ? "default" : "ghost"}
              className={`justify-start w-full text-right ${
                isActive("/dashboard/students")
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : ""
              }`}
              onClick={() => navigate("/dashboard/students")}
            >
              <Users className="ml-2 rtl-flip" />
              الطلاب
            </Button>
            <Button
              variant={isActive("/dashboard/exams") ? "default" : "ghost"}
              className={`justify-start w-full text-right ${
                isActive("/dashboard/exams")
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : ""
              }`}
              onClick={() => navigate("/dashboard/exams")}
            >
              <BookOpen className="ml-2 rtl-flip" />
              الاختبارات
            </Button>
            <Button
              variant={isActive("/dashboard/files") ? "default" : "ghost"}
              className={`justify-start w-full text-right ${
                isActive("/dashboard/files")
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : ""
              }`}
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
              variant={isActive("/dashboard") ? "default" : "ghost"}
              className={`justify-start w-full text-right ${
                isActive("/dashboard/student")
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : ""
              }`}
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard className="ml-2 rtl-flip" />
              الرئيسية
            </Button>
            <Button
              variant={isActive("/dashboard/exams") ? "default" : "ghost"}
              className={`justify-start w-full text-right ${
                isActive("/dashboard/quizzes")
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : ""
              }`}
              onClick={() => navigate("/dashboard/exams")}
            >
              <BookOpen className="ml-2 rtl-flip" />
              الاختبارات
            </Button>
            <Button
              variant={isActive("/dashboard/results") ? "default" : "ghost"}
              className={`justify-start w-full text-right ${
                isActive("/dashboard/results")
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : ""
              }`}
              onClick={() => navigate("/dashboard/results")}
            >
              <BookOpen className="ml-2 rtl-flip" />
              النتائج السابقة
            </Button>
            <Button
              variant={isActive("/dashboard/subscriptions") ? "default" : "ghost"}
              className={`justify-start w-full text-right ${
                isActive("/dashboard/my-teachers")
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : ""
              }`}
              onClick={() => navigate("/dashboard/subscriptions")}
            >
              <Users className="ml-2 rtl-flip" />
              الاشتراكات
            </Button>
            <Button
              variant={isActive("/dashboard/library") ? "default" : "ghost"}
              className={`justify-start w-full text-right ${
                isActive("/dashboard/library")
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : ""
              }`}
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
        return (
          <Routes>
            <Route path="/" element={<UserDashboard />} />
            <Route path="teachers" element={<TeachersPage />} />
          </Routes>
        );
      case "teacher":
        return (
          <Routes>
            <Route path="/" element={<TeacherDashboard />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="exams/create" element={<CreateExamPage />} />
            <Route path="exams/edit/:examId" element={<EditExamPage />} />
          </Routes>
        );
      case "student":
        return (
          <Routes>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="exams" element={<StudentExamsPage />} />
            <Route path="exams/take/:examId" element={<TakeExam />} />
            <Route path="subscriptions" element={<Subscriptionspage />} />
          </Routes>
        );

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
        initial={{ x: 100, opacity: 0 }}
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
              <p className="font-medium">{"User"}</p>
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
