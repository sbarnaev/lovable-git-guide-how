
import React from 'react';
import { PartnershipCalculation } from '@/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { formatName } from '@/utils/formatters';

interface PartnershipClientInfoProps {
  calculation: (PartnershipCalculation & { id: string; createdAt: string });
}

export const PartnershipClientInfo: React.FC<PartnershipClientInfoProps> = ({ calculation }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Информация</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Person */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Первый человек</h3>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">ФИО</p>
                {formatName(calculation.clientName)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Дата рождения</p>
                <p>{new Date(calculation.birthDate).toLocaleDateString('ru-RU')}</p>
              </div>
            </div>
          </div>
          
          {/* Second Person */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Второй человек</h3>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">ФИО</p>
                {formatName(calculation.partnerName)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Дата рождения</p>
                <p>{new Date(calculation.partnerBirthDate).toLocaleDateString('ru-RU')}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
