
import { createContext, useContext, ReactNode } from 'react';
import { useAccessCheck, AccessStatus } from '@/hooks/useAccessCheck';
import { useAuth } from '@/contexts/AuthContext';

interface AccessContextType extends AccessStatus {
  isAdmin: boolean;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

export function AccessProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const accessStatus = useAccessCheck();
  
  // Detailed logs for diagnostics
  console.log("User in AccessProvider:", user?.id);
  console.log("Profile in AccessProvider:", profile);
  console.log("Access status:", accessStatus);
  
  // Safely check if user is an administrator
  const isAdmin = profile?.role === 'admin';
  console.log("Is admin:", isAdmin);
  
  // Define access: administrators always have access, or check by status
  // Ensure we skip the error state and grant access if a valid record exists
  const hasAccess = isAdmin || 
    (accessStatus.hasAccess && !accessStatus.loading && !accessStatus.error);
  console.log("Final access decision:", hasAccess);

  return (
    <AccessContext.Provider value={{
      ...accessStatus,
      hasAccess,
      isAdmin
    }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  const context = useContext(AccessContext);
  if (context === undefined) {
    throw new Error('useAccess must be used within an AccessProvider');
  }
  return context;
}
