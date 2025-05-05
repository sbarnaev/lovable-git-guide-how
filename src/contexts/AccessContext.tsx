
import { createContext, useContext, ReactNode } from 'react';
import { useAccessCheck, AccessStatus } from '@/hooks/useAccessCheck';
import { useAuth } from '@/contexts/AuthContext';

interface AccessContextType extends AccessStatus {
  isAdmin: boolean;
  accessUntil: null; // Keep the property but always set to null
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

export function AccessProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const accessStatus = useAccessCheck();
  
  // Safely check if user is an administrator
  const isAdmin = profile?.role === 'admin';
  
  // Always grant access to administrators and general users
  const hasAccess = isAdmin || true;

  return (
    <AccessContext.Provider value={{
      ...accessStatus,
      hasAccess,
      isAdmin,
      accessUntil: null // Always set to null as we removed this functionality
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
