import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <div className="bg-red-600 min-h-screen flex flex-col items-center justify-center">
      <div>داش بورد</div>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-white text-red-600 font-semibold rounded hover:bg-gray-200"
      >
        تسجيل خروج
      </button>
    </div>
  );
};

export default Dashboard;
