
import React from 'react';
import { PartnershipCalculation } from '@/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PartnershipClientInfo } from './PartnershipClientInfo';
import { PartnershipProfileCodes } from './PartnershipProfileCodes';
import { PartnershipAtlas } from './PartnershipAtlas';
import { PartnershipCompatibility } from './PartnershipCompatibility';
import { ArchetypeDescription } from '@/types/numerology';
import { AIContentSection } from '@/components/AIContentSection';

interface PartnershipViewProps {
  calculation: (PartnershipCalculation & { id: string; createdAt: string });
  clientArchetypes: ArchetypeDescription[];
  partnerArchetypes: ArchetypeDescription[];
}

export const PartnershipView: React.FC<PartnershipViewProps> = ({ 
  calculation, 
  clientArchetypes, 
  partnerArchetypes 
}) => {
  // Combine archetypes for AI analysis
  const combinedArchetypes = [...clientArchetypes, ...partnerArchetypes];
  
  // Проверяем наличие результатов расчета
  if (!calculation.results || !calculation.results.clientProfile || !calculation.results.partnerProfile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Результаты расчета</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              Данные расчетов отсутствуют
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Client Information */}
      <PartnershipClientInfo calculation={calculation} />
      
      {/* Profile Comparison */}
      <PartnershipProfileCodes 
        clientProfile={calculation.results.clientProfile}
        partnerProfile={calculation.results.partnerProfile}
        clientName={calculation.clientName}
        partnerName={calculation.partnerName}
      />
      
      {/* Compatibility Section */}
      <PartnershipCompatibility calculation={calculation} />
      
      {/* Profile Atlas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PartnershipAtlas 
          name={calculation.clientName}
          archetypes={clientArchetypes}
          profile={calculation.results.clientProfile}
        />
        <PartnershipAtlas 
          name={calculation.partnerName}
          archetypes={partnerArchetypes}
          profile={calculation.results.partnerProfile}
        />
      </div>
      
      {/* AI Sections */}
      {calculation.id && combinedArchetypes.length > 0 && (
        <>
          <AIContentSection 
            title="Анализ совместимости" 
            type="summary"
            archetypes={combinedArchetypes}
            calculationId={calculation.id}
          />
          
          <AIContentSection 
            title="Сильные и слабые стороны" 
            type="strengths-weaknesses"
            archetypes={combinedArchetypes}
            calculationId={calculation.id}
          />
          
          <AIContentSection 
            title="Потенциальные конфликты" 
            type="code-conflicts"
            archetypes={combinedArchetypes}
            calculationId={calculation.id}
          />
          
          <AIContentSection 
            title="Рекомендации для развития отношений" 
            type="practices"
            archetypes={combinedArchetypes}
            calculationId={calculation.id}
          />
          
          <AIContentSection 
            title="Консультация" 
            type="chat"
            archetypes={combinedArchetypes}
            calculationId={calculation.id}
          />
        </>
      )}
    </div>
  );
};
