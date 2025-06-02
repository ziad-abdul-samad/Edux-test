// src/Features/Teacher/TeacherDashboard.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default TeacherDashboard;
