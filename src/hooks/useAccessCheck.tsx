
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface AccessStatus {
  hasAccess: boolean;
  accessUntil: Date | null;
  loading: boolean;
  error: string | null;
}

export function useAccessCheck(): AccessStatus {
  const { user } = useAuth();
  const [accessStatus, setAccessStatus] = useState<AccessStatus>({
    hasAccess: false,
    accessUntil: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!user) {
      setAccessStatus({
        hasAccess: false,
        accessUntil: null,
        loading: false,
        error: null
      });
      return;
    }

    const checkAccess = async () => {
      try {
        console.log("Checking access for user:", user.id);
        
        // Проверяем доступ пользователя через RPC-функцию
        const { data, error: accessError } = await supabase
          .rpc('has_active_access', { user_uuid: user.id });

        if (accessError) {
          console.error("Error checking access through RPC:", accessError);
          throw accessError;
        }

        console.log("Access check result:", data);

        // Получаем информацию о сроке доступа
        const { data: accessData, error: dataError } = await supabase
          .from('user_access')
          .select('access_until')
          .eq('user_id', user.id)
          .single();

        if (dataError && dataError.code !== 'PGRST116') {
          // PGRST116 - ошибка "не найдено", игнорируем её
          console.error("Error fetching access data:", dataError);
          throw dataError;
        }

        console.log("Access data:", accessData);

        setAccessStatus({
          hasAccess: !!data,
          accessUntil: accessData?.access_until ? new Date(accessData.access_until) : null,
          loading: false,
          error: null
        });
      } catch (error: any) {
        console.error('Error checking access:', error);
        setAccessStatus({
          hasAccess: false,
          accessUntil: null,
          loading: false,
          error: error.message
        });
      }
    };

    checkAccess();
  }, [user]);

  return accessStatus;
}
