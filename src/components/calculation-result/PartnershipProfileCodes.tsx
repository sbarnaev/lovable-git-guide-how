
import React from 'react';
import { BasicCalculationResults } from '@/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PartnershipProfileCodesProps {
  clientProfile: BasicCalculationResults | undefined;
  partnerProfile: BasicCalculationResults | undefined;
  clientName: string;
  partnerName: string;
}

export const PartnershipProfileCodes: React.FC<PartnershipProfileCodesProps> = ({ 
  clientProfile, 
  partnerProfile,
  clientName,
  partnerName
}) => {
  // Get short names for display
  const getShortName = (fullName: string) => {
    const nameParts = fullName.trim().split(' ');
    return nameParts[0] || 'Клиент';
  };

  const client = getShortName(clientName);
  const partner = getShortName(partnerName);

  console.log("Partnership profile codes:", { clientProfile, partnerProfile });

  // Check if both profiles exist first
  if (!clientProfile || !partnerProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Сравнение профилей</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            {!clientProfile && !partnerProfile 
              ? "Данные о профилях отсутствуют"
              : !clientProfile 
                ? `Данные профиля для ${clientName} отсутствуют` 
                : `Данные профиля для ${partnerName} отсутствуют`}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if both profiles have fullCodes
  const clientCodes = clientProfile?.fullCodes;
  const partnerCodes = partnerProfile?.fullCodes;
  
  if (!clientCodes || !partnerCodes) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Сравнение профилей</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            {!clientCodes && !partnerCodes 
              ? "Данные о кодах профилей отсутствуют"
              : !clientCodes 
                ? `Данные о кодах профиля ${clientName} отсутствуют` 
                : `Данные о кодах профиля ${partnerName} отсутствуют`}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Сравнение профилей</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
          {/* Код Личности */}
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground">Код Личности</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">{client}</div>
                <div className="text-2xl font-bold text-numerica">{clientCodes.personalityCode}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{partner}</div>
                <div className="text-2xl font-bold text-numerica">{partnerCodes.personalityCode}</div>
              </div>
            </div>
          </div>
          
          {/* Код Коннектора */}
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground">Код Коннектора</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">{client}</div>
                <div className="text-2xl font-bold text-numerica">{clientCodes.connectorCode}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{partner}</div>
                <div className="text-2xl font-bold text-numerica">{partnerCodes.connectorCode}</div>
              </div>
            </div>
          </div>
          
          {/* Код Реализации */}
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground">Код Реализации</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">{client}</div>
                <div className="text-2xl font-bold text-numerica">{clientCodes.realizationCode}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{partner}</div>
                <div className="text-2xl font-bold text-numerica">{partnerCodes.realizationCode}</div>
              </div>
            </div>
          </div>
          
          {/* Код Генератора */}
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground">Код Генератора</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">{client}</div>
                <div className="text-2xl font-bold text-numerica">{clientCodes.generatorCode}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{partner}</div>
                <div className="text-2xl font-bold text-numerica">{partnerCodes.generatorCode}</div>
              </div>
            </div>
          </div>
          
          {/* Код Миссии */}
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground">Код Миссии</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">{client}</div>
                <div className="text-2xl font-bold text-numerica">{clientCodes.missionCode}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{partner}</div>
                <div className="text-2xl font-bold text-numerica">{partnerCodes.missionCode}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
