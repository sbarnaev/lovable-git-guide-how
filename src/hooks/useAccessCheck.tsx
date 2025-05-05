
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AccessStatus {
  hasAccess: boolean;
  loading: boolean;
  error: string | null;
}

export function useAccessCheck(): AccessStatus {
  const { user } = useAuth();
  const [accessStatus, setAccessStatus] = useState<AccessStatus>({
    hasAccess: true, // Всегда даем доступ по умолчанию
    loading: false,
    error: null
  });

  useEffect(() => {
    if (!user) {
      setAccessStatus({
        hasAccess: false,
        loading: false,
        error: null
      });
      return;
    }

    // Упрощенная версия - всегда предоставляем доступ авторизованным пользователям
    setAccessStatus({
      hasAccess: true,
      loading: false,
      error: null
    });
  }, [user]);

  return accessStatus;
}
