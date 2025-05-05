
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArchetypeDetails } from './ArchetypeDetails';
import { ArchetypeDescription, NumerologyProfile, NumerologyCodeType } from '@/types/numerology';
import { ScrollArea } from '@/components/ui/scroll-area';
import { normalizeCodeType } from '@/utils/archetypeDescriptions';

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
  
  // Debug effects
  useEffect(() => {
    console.log("PartnershipTextbookSection rendered with:", {
      clientProfile,
      partnerProfile,
      clientArchetypes: clientArchetypes?.length,
      partnerArchetypes: partnerArchetypes?.length,
      activeTab,
      activeCodeType
    });
    
    if (clientProfile?.fullCodes) {
      console.log("Client fullCodes:", clientProfile.fullCodes);
    }
    
    if (partnerProfile?.fullCodes) {
      console.log("Partner fullCodes:", partnerProfile.fullCodes);
    }
  }, [clientProfile, partnerProfile, clientArchetypes, partnerArchetypes, activeTab, activeCodeType]);
  
  // Get short names for display
  const getShortName = (fullName: string) => {
    const nameParts = fullName.trim().split(' ');
    return nameParts[0] || 'Клиент';
  };

  const clientShortName = getShortName(clientName);
  const partnerShortName = getShortName(partnerName);
  
  // Improved function to find the right archetype
  const findArchetype = (archetypes: ArchetypeDescription[], codeType: NumerologyCodeType, fullCodes: any): ArchetypeDescription | undefined => {
    if (!archetypes || archetypes.length === 0) {
      console.log(`No archetypes available for ${codeType} search`);
      return undefined;
    }
    
    if (!fullCodes) {
      console.log(`No fullCodes available for archetype search`);
      return undefined;
    }
    
    // Normalize the code type (remove 'Code' suffix if present)
    const normalizedCode = normalizeCodeType(codeType);
    console.log(`Looking for archetype with normalized code: ${normalizedCode}`);
    
    // Get the value for this code from the fullCodes object
    let codeValue: number | undefined;
    
    switch(normalizedCode) {
      case 'personality':
        codeValue = fullCodes.personalityCode;
        break;
      case 'connector':
        codeValue = fullCodes.connectorCode;
        break;
      case 'realization':
        codeValue = fullCodes.realizationCode;
        break;
      case 'generator':
        codeValue = fullCodes.generatorCode;
        break;
      case 'mission':
        codeValue = fullCodes.missionCode;
        break;
      default:
        console.log(`Unknown code type: ${normalizedCode}`);
        return undefined;
    }
    
    if (codeValue === undefined) {
      console.log(`No value found for ${normalizedCode} in fullCodes`);
      return undefined;
    }
    
    console.log(`Searching for archetype with code=${normalizedCode}, value=${codeValue} among ${archetypes.length} archetypes`);
    
    // Try to find an exact match first
    let match = archetypes.find(arch => {
      const archCodeNorm = normalizeCodeType(arch.code);
      return archCodeNorm === normalizedCode && arch.value === codeValue;
    });
    
    if (match) {
      console.log(`Found matching archetype: ${match.code} with value ${match.value}`);
      return match;
    }
    
    // If no exact match, try a more flexible search
    match = archetypes.find(arch => {
      const archCode = String(arch.code).toLowerCase();
      return archCode.includes(normalizedCode.toLowerCase()) && arch.value === codeValue;
    });
    
    if (match) {
      console.log(`Found match with flexible search: ${match.code} with value ${match.value}`);
      return match;
    }
    
    console.log(`No matching archetype found for ${normalizedCode} with value ${codeValue}`);
    return undefined;
  };
  
  // Handler for selecting a code type
  const handleSelectCodeType = (codeType: NumerologyCodeType) => {
    if (activeCodeType === codeType) {
      setActiveCodeType(null);
    } else {
      setActiveCodeType(codeType);
    }
  };

  // Маппинг кодов на их отображаемые имена
  const codeDisplayNames: Record<string, string> = {
    'personality': 'Личности',
    'connector': 'Коннектора',
    'realization': 'Реализации',
    'generator': 'Генератора',
    'mission': 'Миссии'
  };
  
  // Определяем, какая кнопка активна для улучшения стиля
  const isActive = (code: NumerologyCodeType) => activeCodeType === code;

  // Функция для отрисовки кнопок кодов для профиля
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
          variant={isActive('personality') ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('personality')}
          className={`rounded-md ${isActive('personality') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['personality']} {profile.fullCodes.personalityCode}
        </Button>
        
        <Button 
          variant={isActive('connector') ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('connector')}
          className={`rounded-md ${isActive('connector') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['connector']} {profile.fullCodes.connectorCode}
        </Button>
        
        <Button 
          variant={isActive('realization') ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('realization')}
          className={`rounded-md ${isActive('realization') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['realization']} {profile.fullCodes.realizationCode}
        </Button>
        
        <Button 
          variant={isActive('generator') ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('generator')}
          className={`rounded-md ${isActive('generator') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['generator']} {profile.fullCodes.generatorCode}
        </Button>
        
        <Button 
          variant={isActive('mission') ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('mission')}
          className={`rounded-md ${isActive('mission') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['mission']} {profile.fullCodes.missionCode}
        </Button>
      </div>
    );
  };

  // Get the current profile based on active tab
  const getCurrentProfile = () => {
    return activeTab === "client" ? clientProfile : partnerProfile;
  };

  // Get the current archetypes based on active tab
  const getCurrentArchetypes = () => {
    return activeTab === "client" ? clientArchetypes : partnerArchetypes;
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
            <Card className="mt-4 border rounded-lg overflow-hidden">
              <CardContent className="p-6">
                <ScrollArea className="max-h-[600px] pr-4">
                  <ArchetypeDetails 
                    archetype={findArchetype(clientArchetypes, activeCodeType, clientProfile.fullCodes)}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="partner">
          {renderCodeButtons(partnerProfile)}
          
          {activeCodeType && partnerProfile && partnerProfile.fullCodes && (
            <Card className="mt-4 border rounded-lg overflow-hidden">
              <CardContent className="p-6">
                <ScrollArea className="max-h-[600px] pr-4">
                  <ArchetypeDetails 
                    archetype={findArchetype(partnerArchetypes, activeCodeType, partnerProfile.fullCodes)}
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
