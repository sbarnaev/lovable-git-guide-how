
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useAccess } from "@/contexts/AccessContext";

export const AccessExpiredAlert = () => {
  const { hasAccess } = useAccess();
  
  // If user has access, don't show this alert
  if (hasAccess) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle>Доступ ограничен</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          Ваш доступ к платформе ограничен. Некоторые функции недоступны.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 w-full sm:w-auto"
          onClick={() => window.location.href = "https://t.me/ownbarnaev"}
        >
          Связаться с администратором
        </Button>
      </AlertDescription>
    </Alert>
  );
};
