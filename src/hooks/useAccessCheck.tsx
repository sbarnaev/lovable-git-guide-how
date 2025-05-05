
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
        
        // Use a direct SQL query with RPC call to the security definer function
        const { data: hasAccess, error: accessError } = await supabase
          .rpc('has_active_access', { user_uuid: user.id });

        if (accessError) {
          console.error("Error checking access via RPC:", accessError);
          throw accessError;
        }

        console.log("Access check via RPC result:", hasAccess);
        
        // Now fetch the actual access_until date
        const { data: accessData, error: dateError } = await supabase
          .from('user_access')
          .select('access_until')
          .eq('user_id', user.id)
          .single();
            
        if (dateError) {
          console.error("Error fetching access expiration:", dateError);
          // Continue as we already know access status
        }
        
        console.log("Access data:", accessData);
        
        // Convert the date string to a proper Date object if it exists
        let accessDate = null;
        if (accessData?.access_until) {
          accessDate = new Date(accessData.access_until);
          console.log("Parsed access date:", accessDate);
        }
        
        setAccessStatus({
          hasAccess: !!hasAccess,
          accessUntil: accessDate,
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
