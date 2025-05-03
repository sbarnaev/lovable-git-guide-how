
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo - in a real app, this would be authenticated against a backend
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@numerica.com',
    name: 'Администратор',
    role: 'admin'
  },
  {
    id: '2',
    email: 'consultant@numerica.com',
    name: 'Консультант',
    role: 'consultant'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('numerica_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('numerica_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser || password !== '12345678') {
        throw new Error('Неверный email или пароль');
      }
      
      setUser(foundUser);
      localStorage.setItem('numerica_user', JSON.stringify(foundUser));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при входе');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('numerica_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, error }}>
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
