import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaWhatsapp } from "react-icons/fa";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Eye, EyeOff, Info, MessageCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login } from "./services/LoginService";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{
        data: string;
        message: string;
        status: number;
      }>;

      const errorMessage =
        axiosError.response?.data?.data ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        "حدث خطأ أثناء تسجيل الدخول.";

      toast({
        title: "فشل تسجيل الدخول",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-500 p-4 relative">
      {/* Info & WhatsApp Icons */}
      <div className="absolute top-6 right-4 flex gap-3">
        {/* Info Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Info size={22} />
            </Button>
          </DialogTrigger>
          <DialogContent className="text-center">
            <DialogHeader>
              <DialogTitle>: Project Team </DialogTitle>
            </DialogHeader>
            <div className="space-y-2  text-sm font-medium text-[#777]">
              <p>Manager: Abd Alkareem Al Raies</p>
              <p>Back-end Dev: M.Saeed Al Masmoum</p>
              <p>Front-end Dev & UI/UX: M.Ziad Abdul Samad</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* WhatsApp Shortcut */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            window.open("https://wa.me/963997546588", "_blank");
          }}
          className="hover:text-primary hover:bg-white bg-primary text-white"
        >
          <FaWhatsapp size={22}/>
        </Button>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Edux
            </CardTitle>
            <CardDescription>قم بتسجيل الدخول للوصول إلى حسابك</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                mutate({ username, password });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">
                  اسم المستخدم
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  placeholder="أدخل اسم المستخدم"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-2 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-600">
            نظام إدارة الاختبارات والتقييم - جميع الحقوق محفوظة 2025
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
