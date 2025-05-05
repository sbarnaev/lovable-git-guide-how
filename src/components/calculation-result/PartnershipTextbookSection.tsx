
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
  const findArchetype = (archetypes: ArchetypeDescription[], codeType: NumerologyCodeType): ArchetypeDescription | undefined => {
    if (!archetypes || archetypes.length === 0) {
      console.log(`No archetypes found for ${codeType} search`);
      return undefined;
    }
    
    // Get the profile we're currently looking at
    const profile = activeTab === 'client' ? clientProfile : partnerProfile;
    if (!profile || !profile.fullCodes) return undefined;
    
    // Get the code value
    const codeTypeNormalized = codeType.replace(/Code$/, '');
    const codeValue = profile.fullCodes[codeTypeNormalized as keyof typeof profile.fullCodes] as number;
    if (!codeValue) return undefined;
    
    // Try to find with exact match first
    let found = archetypes.find(arch => {
      return arch.code === codeType && arch.value === codeValue;
    });
    
    // If not found, try with normalized code
    if (!found) {
      found = archetypes.find(arch => {
        const archCodeNormalized = arch.code.replace(/Code$/, '');
        return archCodeNormalized === codeTypeNormalized && arch.value === codeValue;
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
  const renderCodeButtons = (profile: NumerologyProfile | undefined) => {
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
          variant={activeCodeType === 'personalityCode' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('personalityCode')}
          className={`${buttonBaseClass} ${activeCodeType === 'personalityCode' ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Личности {profile.fullCodes.personalityCode}
        </Button>
        
        <Button 
          variant={activeCodeType === 'connectorCode' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('connectorCode')}
          className={`${buttonBaseClass} ${activeCodeType === 'connectorCode' ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Коннектора {profile.fullCodes.connectorCode}
        </Button>
        
        <Button 
          variant={activeCodeType === 'realizationCode' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('realizationCode')}
          className={`${buttonBaseClass} ${activeCodeType === 'realizationCode' ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Реализации {profile.fullCodes.realizationCode}
        </Button>
        
        <Button 
          variant={activeCodeType === 'generatorCode' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('generatorCode')}
          className={`${buttonBaseClass} ${activeCodeType === 'generatorCode' ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Генератора {profile.fullCodes.generatorCode}
        </Button>
        
        <Button 
          variant={activeCodeType === 'missionCode' ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('missionCode')}
          className={`${buttonBaseClass} ${activeCodeType === 'missionCode' ? activeButtonClass : inactiveButtonClass}`}
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
          {renderCodeButtons(clientProfile)}
          
          {activeCodeType && clientProfile && clientProfile.fullCodes && (
            <Card className="mt-4 shadow-md border border-gray-200">
              <CardContent className="p-6">
                <ScrollArea className="max-h-[600px]">
                  <ArchetypeDetails 
                    archetype={findArchetype(clientArchetypes, activeCodeType)}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="partner">
          {renderCodeButtons(partnerProfile)}
          
          {activeCodeType && partnerProfile && partnerProfile.fullCodes && (
            <Card className="mt-4 shadow-md border border-gray-200">
              <CardContent className="p-6">
                <ScrollArea className="max-h-[600px]">
                  <ArchetypeDetails 
                    archetype={findArchetype(partnerArchetypes, activeCodeType)}
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
