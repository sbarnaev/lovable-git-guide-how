
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CalculationsProvider } from '@/contexts/calculations';
import { AccessProvider } from './contexts/AccessContext';
import AuthLayout from "./components/AuthLayout";
import MainLayout from "./components/MainLayout";
import { AccessGuard } from "./components/access/AccessGuard";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CalculationsPage from "./pages/CalculationsPage";
import BasicCalculationForm from "./pages/BasicCalculationForm";
import PartnershipCalculationForm from "./pages/PartnershipCalculationForm";
import TargetCalculationForm from "./pages/TargetCalculationForm";
import CalculationResult from "./pages/CalculationResult";
import HistoryPage from "./pages/HistoryPage";
import ArchetypesAdminPage from "./pages/ArchetypesAdminPage";
import ArchetypeImagesPage from "./pages/ArchetypeImagesPage";
import NotesPage from "./pages/NotesPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import LimitedAccessPage from "./pages/LimitedAccessPage";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AccessProvider>
          <CalculationsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="login" element={<Login />} />
                <Route path="reset-password" element={<ResetPassword />} />
                
                <Route path="/" element={<AuthLayout />}>
                  <Route path="/" element={<MainLayout />}>
                    {/* Страницы, доступные всегда */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="limited-access" element={<LimitedAccessPage />} />
                    
                    {/* Страницы, требующие активного доступа */}
                    <Route element={<AccessGuard requiresActiveAccess={true} />}>
                      <Route path="calculations" element={<CalculationsPage />} />
                      <Route path="calculations/new/basic" element={<BasicCalculationForm />} />
                      <Route path="calculations/new/partnership" element={<PartnershipCalculationForm />} />
                      <Route path="calculations/new/target" element={<TargetCalculationForm />} />
                      <Route path="calculations/:id" element={<CalculationResult />} />
                      <Route path="history" element={<HistoryPage />} />
                      <Route path="archetypes" element={<ArchetypesAdminPage />} />
                      <Route path="archetype-images" element={<ArchetypeImagesPage />} />
                      <Route path="notes" element={<NotesPage />} />
                    </Route>
                  </Route>
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CalculationsProvider>
        </AccessProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
