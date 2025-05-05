
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
        
        // Use a direct SQL query with service role to bypass RLS
        // This avoids the infinite recursion issue with RLS policies
        const { data: accessData, error: accessError } = await supabase
          .from('user_access')
          .select('access_until')
          .eq('user_id', user.id)
          .single();

        if (accessError) {
          console.error("Error fetching access data:", accessError);
          throw accessError;
        }

        console.log("Access data:", accessData);

        // Check if access is valid (either no expiration date or not expired)
        const hasValidAccess = accessData?.access_until 
          ? new Date(accessData.access_until) > new Date() 
          : true; // If no expiration date, access is valid

        console.log("Access check result:", hasValidAccess);
        
        if (accessData) {
          console.log("Access until date:", new Date(accessData.access_until));
          console.log("Current date:", new Date());
          console.log("Date comparison:", new Date(accessData.access_until) > new Date());
        }

        setAccessStatus({
          hasAccess: hasValidAccess,
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
