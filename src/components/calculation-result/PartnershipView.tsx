
import React from 'react';
import { PartnershipCalculation } from '@/types';
import { ArchetypeDescription, NumerologyProfile } from '@/types/numerology';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PartnershipTextbookSection } from './PartnershipTextbookSection';
import { PartnershipClientInfo } from './PartnershipClientInfo';
import { PartnershipAtlas } from './PartnershipAtlas';
import { ConsultationTabs } from './partnership/ConsultationTabs';
import { NoteEditor } from '@/components/note-editor';

// Note: We're enabling notes by setting this to false
const NOTES_DISABLED = false;

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
  // Дополнительный лог для отладки
  console.log("PartnershipView rendered with:", {
    calculation: calculation?.id,
    clientArchetypes: clientArchetypes?.length,
    partnerArchetypes: partnerArchetypes?.length,
    clientProfile: calculation?.results?.clientProfile,
    partnerProfile: calculation?.results?.partnerProfile
  });
  
  // Log all the full codes
  if (calculation?.results?.clientProfile?.fullCodes) {
    console.log("Client fullCodes:", calculation.results.clientProfile.fullCodes);
  }
  if (calculation?.results?.partnerProfile?.fullCodes) {
    console.log("Partner fullCodes:", calculation.results.partnerProfile.fullCodes);
  }
  
  // Улучшенная функция преобразования результатов в NumerologyProfile
  const convertToNumerologyProfile = (profile: any): NumerologyProfile => {
    if (!profile) {
      console.log("No profile to convert to NumerologyProfile");
      return {
        lifePath: 0,
        destiny: 0,
        personality: 0,
        fullCodes: undefined
      };
    }
    
    console.log("Converting to NumerologyProfile:", profile);
    
    // Return the profile with the properly formatted data
    return {
      lifePath: profile.numerology?.lifePath || 0,
      destiny: profile.numerology?.destiny || 0,
      personality: profile.numerology?.personality || 0,
      // Make sure to pass the full codes directly
      fullCodes: profile.fullCodes
    };
  };
  
  // Преобразуем профили клиента и партнера
  const clientProfile = calculation.results.clientProfile ? 
    convertToNumerologyProfile(calculation.results.clientProfile) : undefined;
  
  const partnerProfile = calculation.results.partnerProfile ?
    convertToNumerologyProfile(calculation.results.partnerProfile) : undefined;
  
  console.log("Converted profiles:", { clientProfile, partnerProfile });
  
  // Объединяем архетипы для AI-анализа
  const combinedArchetypes = [...clientArchetypes, ...partnerArchetypes];
  
  // Проверяем, что расчет существует
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

  // Проверяем наличие результатов
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
      {calculation.id && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Консультация</h2>
          <ConsultationTabs 
            calculationId={calculation.id}
            archetypes={combinedArchetypes}
          />
        </div>
      )}
      
      {/* Notes Section - теперь включена и размещена перед разделом учебника */}
      {!NOTES_DISABLED && calculation.id && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Заметки</h2>
          <NoteEditor calculationId={calculation.id} />
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
