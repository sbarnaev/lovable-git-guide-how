
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  History,
  LayoutGrid,
  LogOut,
  Menu,
  X,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
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
    { path: "/calculations", icon: <Calculator size={20} />, label: "Расчеты" },
    { path: "/history", icon: <History size={20} />, label: "История" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-numerica">Numerica</span>
          </div>

          {/* Mobile menu button */}
          <div className="block md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Menu">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </NavLink>
            ))}
            <div className="ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
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
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 mb-1 rounded-md text-base font-medium transition-colors animate-slideUp",
                    isActive
                      ? "bg-primary/10 text-primary"
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
            ))}
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
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
