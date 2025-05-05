
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccess } from "@/contexts/AccessContext";
import { useAuth } from "@/contexts/AuthContext";
import { LockKeyhole, Mail, Home } from "lucide-react";
import { Link } from "react-router-dom";

const LimitedAccessPage = () => {
  const { accessUntil } = useAccess();
  const { user } = useAuth();
  
  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="p-3 bg-yellow-100 rounded-full mb-2">
            <LockKeyhole className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Доступ ограничен</CardTitle>
          <CardDescription>
            У вас нет активного доступа к этой части платформы
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-md p-4 bg-muted/30">
            <p className="text-sm mb-2"><strong>Информация:</strong></p>
            <ul className="space-y-1 text-sm">
              <li><strong>Email:</strong> {user?.email}</li>
              <li>
                <strong>Статус доступа:</strong>{" "}
                <span className="text-destructive">Неактивен</span>
              </li>
              <li>
                <strong>Срок доступа:</strong>{" "}
                {accessUntil 
                  ? `Истек ${accessUntil.toLocaleDateString('ru-RU')}` 
                  : "Не установлен"}
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <a href="mailto:support@numerica.ru" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Связаться с администратором
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Вернуться на главную
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LimitedAccessPage;
