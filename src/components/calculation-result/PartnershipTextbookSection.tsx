
import React, { useState } from 'react';
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
  
  // Get short names for display
  const getShortName = (fullName: string) => {
    const nameParts = fullName.trim().split(' ');
    return nameParts[0] || 'Клиент';
  };

  const clientShortName = getShortName(clientName);
  const partnerShortName = getShortName(partnerName);
  
  // Improved findArchetype function with detailed logging
  const findArchetype = (archetypes: ArchetypeDescription[], codeType: NumerologyCodeType): ArchetypeDescription | undefined => {
    if (!archetypes || archetypes.length === 0) {
      console.log(`No archetypes available for ${codeType} search`);
      return undefined;
    }
    
    // Get the profile we're currently looking at
    const profile = activeTab === 'client' ? clientProfile : partnerProfile;
    if (!profile || !profile.fullCodes) {
      console.log(`No profile or fullCodes available for ${activeTab}`);
      return undefined;
    }
    
    // Normalize the code type (remove 'Code' suffix if present)
    const normalizedCode = normalizeCodeType(codeType);
    
    // Map from normalized code to the actual property name in fullCodes
    const codePropertyMap: Record<string, keyof typeof profile.fullCodes> = {
      'personality': 'personalityCode',
      'connector': 'connectorCode',
      'realization': 'realizationCode',
      'generator': 'generatorCode',
      'mission': 'missionCode'
    };
    
    const propertyName = codePropertyMap[normalizedCode];
    if (!propertyName) {
      console.log(`No property mapping found for normalized code: ${normalizedCode}`);
      return undefined;
    }
    
    const codeValue = profile.fullCodes[propertyName];
    
    if (codeValue === undefined) {
      console.log(`No value found for ${codeType} (property ${propertyName}) in profile`);
      return undefined;
    }
    
    console.log(`Looking for archetype with code=${codeType}, normalizedCode=${normalizedCode}, property=${propertyName}, value=${codeValue} among ${archetypes.length} archetypes`);
    
    // First try exact match on code and value
    let match = archetypes.find(arch => {
      const archCodeNormalized = normalizeCodeType(arch.code);
      return (arch.code === codeType || archCodeNormalized === normalizedCode) && 
             arch.value === codeValue;
    });
    
    if (match) {
      console.log(`Found exact match: ${match.code} (${match.value})`);
      return match;
    }
    
    // If no exact match, try matching just on normalized code and value
    match = archetypes.find(arch => {
      const archCodeNormalized = normalizeCodeType(arch.code);
      return archCodeNormalized === normalizedCode && arch.value === codeValue;
    });
    
    if (match) {
      console.log(`Found normalized match: ${match.code} (${match.value})`);
      return match;
    }
    
    console.log(`No matching archetype found for ${codeType} with value ${codeValue}`);
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

  // Map code names to their display names
  const codeDisplayNames: Record<string, string> = {
    'personality': 'Личности',
    'connector': 'Коннектора',
    'realization': 'Реализации',
    'generator': 'Генератора',
    'mission': 'Миссии'
  };
  
  // Determine which button is active for better styling
  const isActive = (code: string) => activeCodeType === code;

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
            <Card className="mt-4 border rounded-lg overflow-hidden">
              <CardContent className="p-6">
                <ScrollArea className="max-h-[600px] pr-4">
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
