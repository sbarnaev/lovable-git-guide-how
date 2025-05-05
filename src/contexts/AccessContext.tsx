
import { createContext, useContext, ReactNode } from 'react';
import { useAccessCheck, AccessStatus } from '@/hooks/useAccessCheck';
import { useAuth } from '@/contexts/AuthContext';

interface AccessContextType extends AccessStatus {
  isAdmin: boolean;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

export function AccessProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const accessStatus = useAccessCheck();
  
  // Проверяем, является ли пользователь администратором
  const isAdmin = profile?.role === 'admin';
  
  // Администраторы всегда имеют доступ
  const hasAccess = isAdmin || accessStatus.hasAccess;

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
