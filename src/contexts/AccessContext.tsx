
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
  
  // Simplified log
  console.log("User in AccessProvider:", user?.id);
  console.log("Profile in AccessProvider:", profile);
  
  // Safely check if user is an administrator
  const isAdmin = profile?.role === 'admin';
  console.log("Is admin:", isAdmin);
  
  // Always grant access to administrators and general users
  const hasAccess = isAdmin || true;
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
