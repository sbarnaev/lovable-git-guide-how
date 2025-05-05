
import React from "react";
import { Outlet } from "react-router-dom";
import { useAccess } from "@/contexts/AccessContext";
import { Loader2 } from "lucide-react";

export const AccessGuard: React.FC<{ requiresActiveAccess?: boolean }> = ({ 
  requiresActiveAccess = true
}) => {
  const { loading, isAdmin } = useAccess();
  
  // For debugging
  console.log("AccessGuard state:", { loading, isAdmin, requiresActiveAccess });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Просто возвращаем контент - всем пользователям доступ разрешен
  return <Outlet />;
}
