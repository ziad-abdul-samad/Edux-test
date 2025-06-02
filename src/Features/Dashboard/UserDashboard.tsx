// src/Features/User/UserDashboard.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="p-4 bg-red-600">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default UserDashboard;
