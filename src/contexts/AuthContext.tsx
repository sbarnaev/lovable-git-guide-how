
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string | null;
  role: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Установка слушателя изменений состояния авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Если пользователь авторизован, загружаем его профиль
        if (currentSession?.user) {
          const userId = currentSession.user.id;
          // Используем setTimeout для предотвращения блокировки Supabase
          setTimeout(() => {
            fetchUserProfile(userId);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Проверка существующей сессии
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Вместо прямого запроса, использовать service role для обхода RLS
      // или прямой запрос к базе данных
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', userId)
        .maybeSingle();  // Используем maybeSingle вместо single для предотвращения ошибки

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        // Создаём временный профиль, чтобы не блокировать работу приложения
        setProfile({ id: userId, name: null, role: null });
        return;
      }

      if (data) {
        console.log("Profile data loaded:", data);
        setProfile(data as UserProfile);
      } else {
        console.log("No profile data found, using default profile");
        setProfile({ id: userId, name: null, role: null });
      }
    } catch (err) {
      console.error('Exception when fetching profile:', err);
      // Создаём временный профиль, чтобы не блокировать работу приложения
      setProfile({ id: userId, name: null, role: null });
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data?.user) {
        toast.success('Вход выполнен успешно');
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при входе');
      toast.error(err.message || 'Произошла ошибка при входе');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });
      
      if (error) throw error;
      
      if (data?.user) {
        toast.success('Регистрация прошла успешно. Проверьте почту для подтверждения.');
        
        // Примечание: email теперь будет отправлен через edge функцию автоматически
        console.log('Пользователь зарегистрирован:', data.user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при регистрации');
      toast.error(err.message || 'Произошла ошибка при регистрации');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success('Вы вышли из системы');
    } catch (err: any) {
      console.error('Error logging out:', err);
      toast.error('Произошла ошибка при выходе');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      isLoading,
      login,
      register,
      logout,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
