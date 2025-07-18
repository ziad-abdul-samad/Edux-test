import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./Features/Login/LoginPage";
import { CheckAuth, PrivateRoute } from "./lib/PrivateRoute";
import DashboardRouter from "./Features/Dashboard/DashboardRouter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster/>
      <Sonner/>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <CheckAuth>
                <LoginPage />
              </CheckAuth>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardRouter />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
