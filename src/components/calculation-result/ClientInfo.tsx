
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { BasicCalculation } from '@/types';

interface ClientInfoProps {
  calculation: (BasicCalculation & { id: string; createdAt: string }) | undefined;
}

export const ClientInfo: React.FC<ClientInfoProps> = ({ calculation }) => {
  if (!calculation || calculation.type !== 'basic') return null;
  
  // Split name into parts
  const nameParts = calculation.clientName.trim().split(' ');
  
  // Extract last name (last part) and first/middle names (all other parts)
  let lastName = '';
  let firstMiddleNames = calculation.clientName;
  
  if (nameParts.length > 1) {
    lastName = nameParts[nameParts.length - 1];
    firstMiddleNames = nameParts.slice(0, nameParts.length - 1).join(' ');
  }
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Информация о клиенте</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{firstMiddleNames}</span>
            </div>
            {lastName && (
              <div className="ml-6 text-muted-foreground">
                {lastName}
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(calculation.birthDate), 'dd MMMM yyyy', { locale: ru })}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">
              Создано: {format(new Date(calculation.createdAt), 'dd.MM.yyyy')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
