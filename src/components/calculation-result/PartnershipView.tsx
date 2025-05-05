import React from 'react';
import { PartnershipCalculation } from '@/types';
import { ArchetypeDescription, NumerologyProfile } from '@/types/numerology';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PartnershipTextbookSection } from './PartnershipTextbookSection';
import { PartnershipClientInfo } from './PartnershipClientInfo';
import { PartnershipAtlas } from './PartnershipAtlas';
import { ConsultationTabs } from './partnership/ConsultationTabs';

// Note: This is a temporary flag to disable notes
const NOTES_DISABLED = true;

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
  // Convert BasicCalculationResults to NumerologyProfile for compatibility with PartnershipTextbookSection
  const convertToNumerologyProfile = (result: any): NumerologyProfile => {
    return {
      lifePath: result.numerology?.lifePath || 0,
      destiny: result.numerology?.destiny || 0,
      personality: result.numerology?.personality || 0,
      fullCodes: result.fullCodes
    };
  };
  
  // Now use the converted profiles
  const clientProfile = calculation.results.clientProfile ? 
    convertToNumerologyProfile(calculation.results.clientProfile) : undefined;
  
  const partnerProfile = calculation.results.partnerProfile ?
    convertToNumerologyProfile(calculation.results.partnerProfile) : undefined;
  
  // Combine archetypes for AI analysis
  const combinedArchetypes = [...clientArchetypes, ...partnerArchetypes];
  
  // Check that calculation exists first
  if (!calculation) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Результаты расчета</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              Данные расчета отсутствуют
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ensure we have results
  if (!calculation.results) {
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
  
  // Get short names for display
  const getShortName = (fullName: string) => {
    const nameParts = fullName.trim().split(' ');
    return nameParts[0] || 'Клиент';
  };

  const clientShortName = getShortName(calculation.clientName);
  const partnerShortName = getShortName(calculation.partnerName);
  
  return (
    <div className="space-y-6">
      {/* Client Information */}
      <PartnershipClientInfo calculation={calculation} />
      
      {/* Individual Profile Codes - keep this section but remove the comparison section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First person profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Профиль: {clientShortName}</CardTitle>
          </CardHeader>
          <CardContent>
            {calculation.results.clientProfile && calculation.results.clientProfile.fullCodes ? (
              <div className="space-y-1">
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-numerica">{calculation.results.clientProfile.fullCodes.personalityCode}</div>
                    <div className="text-sm text-muted-foreground">Код Личности</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-numerica">{calculation.results.clientProfile.fullCodes.connectorCode}</div>
                    <div className="text-sm text-muted-foreground">Код Коннектора</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-numerica">{calculation.results.clientProfile.fullCodes.realizationCode}</div>
                    <div className="text-sm text-muted-foreground">Код Реализации</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-numerica">{calculation.results.clientProfile.fullCodes.generatorCode}</div>
                    <div className="text-sm text-muted-foreground">Код Генератора</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-numerica">{calculation.results.clientProfile.fullCodes.missionCode}</div>
                    <div className="text-sm text-muted-foreground">Код Миссии</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Данные кодов отсутствуют
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Second person profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Профиль: {partnerShortName}</CardTitle>
          </CardHeader>
          <CardContent>
            {calculation.results.partnerProfile && calculation.results.partnerProfile.fullCodes ? (
              <div className="space-y-1">
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-numerica">{calculation.results.partnerProfile.fullCodes.personalityCode}</div>
                    <div className="text-sm text-muted-foreground">Код Личности</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-numerica">{calculation.results.partnerProfile.fullCodes.connectorCode}</div>
                    <div className="text-sm text-muted-foreground">Код Коннектора</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-numerica">{calculation.results.partnerProfile.fullCodes.realizationCode}</div>
                    <div className="text-sm text-muted-foreground">Код Реализации</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-numerica">{calculation.results.partnerProfile.fullCodes.generatorCode}</div>
                    <div className="text-sm text-muted-foreground">Код Генератора</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-numerica">{calculation.results.partnerProfile.fullCodes.missionCode}</div>
                    <div className="text-sm text-muted-foreground">Код Миссии</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Данные кодов отсутствуют
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Profile Atlas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PartnershipAtlas 
          name={calculation.clientName}
          archetypes={clientArchetypes}
          profile={clientProfile}
        />
        <PartnershipAtlas 
          name={calculation.partnerName}
          archetypes={partnerArchetypes}
          profile={partnerProfile}
        />
      </div>
      
      {/* New Consultation section */}
      {calculation.id && combinedArchetypes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Консультация</h2>
          <ConsultationTabs 
            calculationId={calculation.id}
            archetypes={combinedArchetypes}
          />
        </div>
      )}
      
      {/* Textbook Section */}
      <PartnershipTextbookSection 
        clientProfile={clientProfile}
        partnerProfile={partnerProfile}
        clientArchetypes={clientArchetypes}
        partnerArchetypes={partnerArchetypes}
        clientName={calculation.clientName}
        partnerName={calculation.partnerName}
      />
    </div>
  );
};
