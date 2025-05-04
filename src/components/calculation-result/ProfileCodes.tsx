
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { BasicCalculation } from '@/types';

interface ProfileCodesProps {
  calculation: (BasicCalculation & { id: string; createdAt: string }) | undefined;
}

export const ProfileCodes: React.FC<ProfileCodesProps> = ({ calculation }) => {
  if (!calculation || calculation.type !== 'basic' || !calculation.results.fullCodes) {
    return null;
  }
  
  const { fullCodes } = calculation.results;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Профиль</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-numerica">{fullCodes.personalityCode}</div>
            <div className="text-sm text-muted-foreground">Код Личности</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-numerica">{fullCodes.connectorCode}</div>
            <div className="text-sm text-muted-foreground">Код Коннектора</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-numerica">{fullCodes.realizationCode}</div>
            <div className="text-sm text-muted-foreground">Код Реализации</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-numerica">{fullCodes.generatorCode}</div>
            <div className="text-sm text-muted-foreground">Код Генератора</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-numerica">{fullCodes.missionCode}</div>
            <div className="text-sm text-muted-foreground">Код Миссии</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
