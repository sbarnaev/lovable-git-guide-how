
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAccess } from "@/contexts/AccessContext";
import { Loader2 } from "lucide-react";
import { AccessExpiredAlert } from "./AccessExpiredAlert";

export const AccessGuard: React.FC<{ requiresActiveAccess?: boolean }> = ({ 
  requiresActiveAccess = true
}) => {
  const { hasAccess, loading, isAdmin, error } = useAccess();
  
  // For debugging
  console.log("AccessGuard state:", { hasAccess, loading, isAdmin, error, requiresActiveAccess });

  // Admins always have access
  if (isAdmin) {
    console.log("User is admin, granting access");
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If there was an error checking access, show a warning but still check hasAccess
  if (error) {
    console.warn("Access check error:", error);
  }

  // If active access is required and user doesn't have it, redirect to limited access page
  if (requiresActiveAccess && !hasAccess) {
    console.log("User lacks active access, redirecting to limited access page");
    return <Navigate to="/limited-access" replace />;
  }

  return (
    <>
      {/* Show warning if access is restricted but page is accessible */}
      {!hasAccess && <AccessExpiredAlert />}
      <Outlet />
    </>
  );
};
