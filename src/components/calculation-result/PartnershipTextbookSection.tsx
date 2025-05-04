
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArchetypeDetails } from './ArchetypeDetails';
import { ArchetypeDescription, NumerologyProfile, NumerologyCodeType } from '@/types/numerology';

interface PartnershipTextbookSectionProps {
  clientProfile: NumerologyProfile | undefined;
  partnerProfile: NumerologyProfile | undefined;
  clientArchetypes: ArchetypeDescription[];
  partnerArchetypes: ArchetypeDescription[];
  clientName: string;
  partnerName: string;
}

export const PartnershipTextbookSection: React.FC<PartnershipTextbookSectionProps> = ({
  clientProfile,
  partnerProfile,
  clientArchetypes,
  partnerArchetypes,
  clientName,
  partnerName
}) => {
  const [activeTab, setActiveTab] = useState<string>("client");
  const [activeCodeType, setActiveCodeType] = useState<NumerologyCodeType | null>(null);
  
  // Get short names for display
  const getShortName = (fullName: string) => {
    const nameParts = fullName.trim().split(' ');
    return nameParts[0] || 'Клиент';
  };

  const clientShortName = getShortName(clientName);
  const partnerShortName = getShortName(partnerName);
  
  const findArchetype = (archetypes: ArchetypeDescription[], codeType: NumerologyCodeType, code: number): ArchetypeDescription | undefined => {
    return archetypes.find(arch => arch.code === codeType && arch.value === code);
  };
  
  // Handler for selecting a code type
  const handleSelectCodeType = (codeType: NumerologyCodeType) => {
    if (activeCodeType === codeType) {
      setActiveCodeType(null);
    } else {
      setActiveCodeType(codeType);
    }
  };

  // Function to render code buttons for a profile
  const renderCodeButtons = (profile: NumerologyProfile | undefined, archetypes: ArchetypeDescription[]) => {
    if (!profile || !profile.fullCodes) {
      return (
        <div className="text-center text-muted-foreground text-sm py-2">
          Данные кодов отсутствуют
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeCodeType === 'personality' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('personality')}
          className="flex-grow md:flex-grow-0"
        >
          Код Личности {profile.fullCodes.personalityCode}
        </Button>
        
        <Button 
          variant={activeCodeType === 'connector' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('connector')}
          className="flex-grow md:flex-grow-0"
        >
          Код Коннектора {profile.fullCodes.connectorCode}
        </Button>
        
        <Button 
          variant={activeCodeType === 'realization' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('realization')}
          className="flex-grow md:flex-grow-0"
        >
          Код Реализации {profile.fullCodes.realizationCode}
        </Button>
        
        <Button 
          variant={activeCodeType === 'generator' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('generator')}
          className="flex-grow md:flex-grow-0"
        >
          Код Генератора {profile.fullCodes.generatorCode}
        </Button>
        
        <Button 
          variant={activeCodeType === 'mission' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('mission')}
          className="flex-grow md:flex-grow-0"
        >
          Код Миссии {profile.fullCodes.missionCode}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Учебник</h2>
      
      <Tabs defaultValue="client" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client">{clientShortName}</TabsTrigger>
          <TabsTrigger value="partner">{partnerShortName}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="client">
          {renderCodeButtons(clientProfile, clientArchetypes)}
          
          {activeCodeType && clientProfile && clientProfile.fullCodes && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <ArchetypeDetails 
                  archetype={findArchetype(
                    clientArchetypes, 
                    activeCodeType, 
                    clientProfile.fullCodes[`${activeCodeType}Code` as keyof typeof clientProfile.fullCodes] as number
                  )} 
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="partner">
          {renderCodeButtons(partnerProfile, partnerArchetypes)}
          
          {activeCodeType && partnerProfile && partnerProfile.fullCodes && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <ArchetypeDetails 
                  archetype={findArchetype(
                    partnerArchetypes, 
                    activeCodeType, 
                    partnerProfile.fullCodes[`${activeCodeType}Code` as keyof typeof partnerProfile.fullCodes] as number
                  )} 
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
