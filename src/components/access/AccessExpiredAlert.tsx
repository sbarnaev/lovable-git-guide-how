
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarDays, AlertTriangle } from "lucide-react";
import { useAccess } from "@/contexts/AccessContext";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export const AccessExpiredAlert = () => {
  const { accessUntil } = useAccess();
  
  // Форматируем дату окончания доступа
  const formattedExpiration = accessUntil
    ? formatDistanceToNow(accessUntil, { addSuffix: true, locale: ru })
    : "Неизвестно";
  
  const isExpired = accessUntil ? accessUntil < new Date() : true;

  if (!isExpired) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle>Доступ ограничен</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          Ваш доступ к платформе истек {formattedExpiration}. Некоторые функции недоступны.
        </p>
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4" />
          <span>
            {accessUntil 
              ? `Дата окончания: ${accessUntil.toLocaleDateString('ru-RU')}`
              : 'Срок доступа не установлен'}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 w-full sm:w-auto"
          onClick={() => window.location.href = "mailto:support@numerica.ru"}
        >
          Связаться с администратором
        </Button>
      </AlertDescription>
    </Alert>
  );
};
