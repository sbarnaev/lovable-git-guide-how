
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArchetypeDetails } from './ArchetypeDetails';
import { ArchetypeDescription, NumerologyProfile, NumerologyCodeType } from '@/types/numerology';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  
  // Improved findArchetype function
  const findArchetype = (archetypes: ArchetypeDescription[], codeType: NumerologyCodeType, code: number): ArchetypeDescription | undefined => {
    if (!archetypes || archetypes.length === 0) {
      console.log(`No archetypes found for ${codeType} search`);
      return undefined;
    }
    
    // Normalize code type by removing "Code" suffix if present
    const normalizedCodeType = codeType.replace('Code', '');
    
    // Try to find with exact match first
    let found = archetypes.find(arch => arch.code === codeType && arch.value === code);
    
    // If not found, try with normalized code
    if (!found) {
      found = archetypes.find(arch => {
        const archCodeNormalized = arch.code.replace('Code', '');
        return archCodeNormalized === normalizedCodeType && arch.value === code;
      });
    }
    
    return found;
  };
  
  // Handler for selecting a code type
  const handleSelectCodeType = (codeType: NumerologyCodeType) => {
    if (activeCodeType === codeType) {
      setActiveCodeType(null);
    } else {
      setActiveCodeType(codeType);
    }
  };

  // Стили для кнопок и активного состояния
  const buttonBaseClass = "flex-grow md:flex-grow-0 font-medium transition-all";
  const activeButtonClass = "bg-indigo-600 text-white hover:bg-indigo-700";
  const inactiveButtonClass = "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50";

  // Function to render code buttons for a profile
  const renderCodeButtons = (profile: NumerologyProfile | undefined, archetypes: ArchetypeDescription[]) => {
    if (!profile || !profile.fullCodes) {
      return (
        <div className="text-center text-muted-foreground text-sm py-4">
          Данные кодов отсутствуют
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        <Button 
          variant={activeCodeType === 'personalityCode' || activeCodeType === 'personality' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('personalityCode')}
          className={`${buttonBaseClass} ${(activeCodeType === 'personalityCode' || activeCodeType === 'personality') ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Личности {profile.fullCodes.personalityCode}
        </Button>
        
        <Button 
          variant={activeCodeType === 'connectorCode' || activeCodeType === 'connector' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('connectorCode')}
          className={`${buttonBaseClass} ${(activeCodeType === 'connectorCode' || activeCodeType === 'connector') ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Коннектора {profile.fullCodes.connectorCode}
        </Button>
        
        <Button 
          variant={activeCodeType === 'realizationCode' || activeCodeType === 'realization' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('realizationCode')}
          className={`${buttonBaseClass} ${(activeCodeType === 'realizationCode' || activeCodeType === 'realization') ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Реализации {profile.fullCodes.realizationCode}
        </Button>
        
        <Button 
          variant={activeCodeType === 'generatorCode' || activeCodeType === 'generator' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('generatorCode')}
          className={`${buttonBaseClass} ${(activeCodeType === 'generatorCode' || activeCodeType === 'generator') ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Генератора {profile.fullCodes.generatorCode}
        </Button>
        
        <Button 
          variant={activeCodeType === 'missionCode' || activeCodeType === 'mission' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('missionCode')}
          className={`${buttonBaseClass} ${(activeCodeType === 'missionCode' || activeCodeType === 'mission') ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Миссии {profile.fullCodes.missionCode}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Учебник</h2>
      
      <Tabs defaultValue="client" onValueChange={setActiveTab} value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="client">{clientShortName}</TabsTrigger>
          <TabsTrigger value="partner">{partnerShortName}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="client">
          {renderCodeButtons(clientProfile, clientArchetypes)}
          
          {activeCodeType && clientProfile && clientProfile.fullCodes && (
            <Card className="mt-4 shadow-md border border-gray-200">
              <CardContent className="p-6">
                <ScrollArea className="max-h-[600px]">
                  <ArchetypeDetails 
                    archetype={findArchetype(
                      clientArchetypes, 
                      activeCodeType, 
                      clientProfile.fullCodes[activeCodeType.replace(/Code$/, '') as keyof typeof clientProfile.fullCodes] as number || 
                      clientProfile.fullCodes[`${activeCodeType}Code` as keyof typeof clientProfile.fullCodes] as number
                    )} 
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="partner">
          {renderCodeButtons(partnerProfile, partnerArchetypes)}
          
          {activeCodeType && partnerProfile && partnerProfile.fullCodes && (
            <Card className="mt-4 shadow-md border border-gray-200">
              <CardContent className="p-6">
                <ScrollArea className="max-h-[600px]">
                  <ArchetypeDetails 
                    archetype={findArchetype(
                      partnerArchetypes, 
                      activeCodeType, 
                      partnerProfile.fullCodes[activeCodeType.replace(/Code$/, '') as keyof typeof partnerProfile.fullCodes] as number || 
                      partnerProfile.fullCodes[`${activeCodeType}Code` as keyof typeof partnerProfile.fullCodes] as number
                    )} 
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
