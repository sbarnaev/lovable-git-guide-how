
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const ProfileLink = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // После кратковременной задержки показываем компонент,
    // чтобы избежать мигания при загрузке страницы
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!user || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link to="/profile">
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg"
          variant={location.pathname === '/profile' ? 'default' : 'secondary'}
        >
          <UserCircle className="h-6 w-6" />
          <span className="sr-only">Профиль пользователя</span>
        </Button>
      </Link>
    </div>
  );
};

export default ProfileLink;
