
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAccess } from "@/contexts/AccessContext";
import { Button } from "@/components/ui/button";
import {
  History,
  LayoutGrid,
  LogOut,
  Menu,
  X,
  Calculator,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AccessExpiredAlert } from "./access/AccessExpiredAlert";

const MainLayout = () => {
  const { user, profile, logout } = useAuth();
  const { hasAccess, isAdmin } = useAccess();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: "/dashboard", icon: <LayoutGrid size={20} />, label: "Главная" },
    { path: "/calculations", icon: <Calculator size={20} />, label: "Расчеты", requiresAccess: true },
    { path: "/history", icon: <History size={20} />, label: "История", requiresAccess: true },
  ];

  // Получаем инициалы пользователя
  const getUserInitials = () => {
    if (profile?.name) {
      const nameParts = profile.name.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
      } else {
        return profile.name.substring(0, 2).toUpperCase();
      }
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'ГП';
  };
  
  const goToProfile = () => {
    navigate('/profile');
    if (mobileMenuOpen) closeMobileMenu();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-numerica">Numerica</span>
            
            {/* Admin indicator */}
            {isAdmin && (
              <div className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                Админ
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="block md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Menu">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              // Если пункт меню требует доступ и доступа нет (и пользователь не админ), делаем его неактивным
              const isDisabled = item.requiresAccess && !hasAccess && !isAdmin;
              
              return (
                <NavLink
                  key={item.path}
                  to={isDisabled ? "/limited-access" : item.path}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : isDisabled
                        ? "opacity-40 hover:bg-accent/30"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
            <div className="ml-4 flex items-center gap-2">
              <button 
                onClick={goToProfile}
                className="flex items-center gap-2 hover:bg-accent/50 px-2 py-1 rounded transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{profile?.name || user?.email}</div>
                </div>
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1 ml-2"
              >
                <LogOut size={16} />
                <span>Выход</span>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-sm animate-fadeIn">
          <nav className="container py-4 flex flex-col">
            <button
              onClick={goToProfile}
              className="flex items-center gap-4 mb-4 p-4 bg-accent/50 rounded-md w-full text-left"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{profile?.name || user?.email}</div>
              </div>
            </button>
            
            {navItems.map((item, index) => {
              const isDisabled = item.requiresAccess && !hasAccess && !isAdmin;
              
              return (
                <NavLink
                  key={item.path}
                  to={isDisabled ? "/limited-access" : item.path}
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-3 mb-1 rounded-md text-base font-medium transition-colors animate-slideUp",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : isDisabled
                        ? "opacity-40 hover:bg-accent/30"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="mt-4 flex items-center gap-2 animate-slideUp"
              style={{ animationDelay: '300ms' }}
            >
              <LogOut size={18} />
              <span>Выйти</span>
            </Button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">
        <div className="container py-4 md:py-6">
          {/* Show expired access alert if needed */}
          {!hasAccess && !isAdmin && <AccessExpiredAlert />}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
