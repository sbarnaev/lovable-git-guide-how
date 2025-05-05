
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAccess } from "@/contexts/AccessContext";
import { Loader2 } from "lucide-react";
import { AccessExpiredAlert } from "./AccessExpiredAlert";

export const AccessGuard: React.FC<{ requiresActiveAccess?: boolean }> = ({ 
  requiresActiveAccess = true
}) => {
  const { hasAccess, loading, isAdmin } = useAccess();

  // Админы всегда имеют доступ
  if (isAdmin) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Если требуется активный доступ и его нет, перенаправляем на страницу с ограниченным доступом
  if (requiresActiveAccess && !hasAccess) {
    return <Navigate to="/limited-access" replace />;
  }

  return (
    <>
      {/* Показываем предупреждение, если доступ ограничен, но страница доступна */}
      {!hasAccess && <AccessExpiredAlert />}
      <Outlet />
    </>
  );
};
