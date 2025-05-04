
import React from 'react';
import { BasicCalculationResults } from '@/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PartnershipProfileCodesProps {
  clientProfile: BasicCalculationResults;
  partnerProfile: BasicCalculationResults;
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
    const nameParts = fullName.split(' ');
    return nameParts[0] || 'Клиент';
  };

  const client = getShortName(clientName);
  const partner = getShortName(partnerName);

  if (!clientProfile.fullCodes || !partnerProfile.fullCodes) {
    return null;
  }
  
  const clientCodes = clientProfile.fullCodes;
  const partnerCodes = partnerProfile.fullCodes;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Сравнение профилей</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Код</th>
                <th className="text-center pb-2">{client}</th>
                <th className="text-center pb-2">{partner}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 pr-4">Код Личности</td>
                <td className="text-center py-3 px-4">
                  <span className="text-xl font-bold text-numerica">{clientCodes.personalityCode}</span>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="text-xl font-bold text-numerica">{partnerCodes.personalityCode}</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 pr-4">Код Коннектора</td>
                <td className="text-center py-3 px-4">
                  <span className="text-xl font-bold text-numerica">{clientCodes.connectorCode}</span>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="text-xl font-bold text-numerica">{partnerCodes.connectorCode}</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 pr-4">Код Реализации</td>
                <td className="text-center py-3 px-4">
                  <span className="text-xl font-bold text-numerica">{clientCodes.realizationCode}</span>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="text-xl font-bold text-numerica">{partnerCodes.realizationCode}</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 pr-4">Код Генератора</td>
                <td className="text-center py-3 px-4">
                  <span className="text-xl font-bold text-numerica">{clientCodes.generatorCode}</span>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="text-xl font-bold text-numerica">{partnerCodes.generatorCode}</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Код Миссии</td>
                <td className="text-center py-3 px-4">
                  <span className="text-xl font-bold text-numerica">{clientCodes.missionCode}</span>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="text-xl font-bold text-numerica">{partnerCodes.missionCode}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
