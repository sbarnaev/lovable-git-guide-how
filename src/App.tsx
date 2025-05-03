
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CalculationsProvider } from "./contexts/CalculationsContext";
import AuthLayout from "./components/AuthLayout";
import MainLayout from "./components/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CalculationsPage from "./pages/CalculationsPage";
import BasicCalculationForm from "./pages/BasicCalculationForm";
import PartnershipCalculationForm from "./pages/PartnershipCalculationForm";
import TargetCalculationForm from "./pages/TargetCalculationForm";
import CalculationResult from "./pages/CalculationResult";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CalculationsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="login" element={<Login />} />
              
              <Route path="/" element={<AuthLayout />}>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  
                  <Route path="calculations" element={<CalculationsPage />} />
                  <Route path="calculations/new/basic" element={<BasicCalculationForm />} />
                  <Route path="calculations/new/partnership" element={<PartnershipCalculationForm />} />
                  <Route path="calculations/new/target" element={<TargetCalculationForm />} />
                  <Route path="calculations/:id" element={<CalculationResult />} />
                  
                  <Route path="history" element={<HistoryPage />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CalculationsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
