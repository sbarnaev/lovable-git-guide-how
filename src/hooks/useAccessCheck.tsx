
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
        // This avoids the infinite recursion issue with RLS policies
        const { data, error } = await supabase
          .rpc('has_active_access', { user_uuid: user.id });

        if (error) {
          console.error("Error checking access via RPC:", error);
          throw error;
        }

        console.log("Access check via RPC result:", data);
        
        // Get the access expiration date if access is granted
        if (data) {
          const { data: accessData, error: accessError } = await supabase
            .from('user_access')
            .select('access_until')
            .eq('user_id', user.id)
            .single();
            
          if (accessError) {
            console.error("Error fetching access expiration:", accessError);
            // We don't throw here since we already know access is granted
          }
          
          setAccessStatus({
            hasAccess: true,
            accessUntil: accessData?.access_until ? new Date(accessData.access_until) : null,
            loading: false,
            error: null
          });
        } else {
          setAccessStatus({
            hasAccess: false,
            accessUntil: null,
            loading: false,
            error: null
          });
        }
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
