
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
    const normalizedCode = codeType.replace(/Code$/, '');
    
    // Get the code value
    const codeKey = normalizedCode as keyof typeof profile.fullCodes;
    const codeValue = profile.fullCodes[codeKey];
    
    if (!codeValue) {
      console.log(`No value found for ${codeType} in profile`);
      return undefined;
    }
    
    console.log(`Looking for archetype with code=${codeType}, value=${codeValue} among ${archetypes.length} archetypes`);
    
    // First try exact match on code and value
    let match = archetypes.find(arch => 
      (arch.code === codeType || arch.code === normalizedCode) && 
      arch.value === codeValue
    );
    
    if (match) {
      console.log(`Found exact match: ${match.code} (${match.value})`);
      return match;
    }
    
    // If no exact match, try a more flexible search
    match = archetypes.find(arch => {
      const archCodeNormalized = arch.code.replace(/Code$/, '');
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
    'personalityCode': 'Личности',
    'connectorCode': 'Коннектора',
    'realizationCode': 'Реализации',
    'generatorCode': 'Генератора',
    'missionCode': 'Миссии'
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
          variant={isActive('personalityCode') ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('personalityCode')}
          className={`rounded-md ${isActive('personalityCode') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['personalityCode']} {profile.fullCodes.personalityCode}
        </Button>
        
        <Button 
          variant={isActive('connectorCode') ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('connectorCode')}
          className={`rounded-md ${isActive('connectorCode') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['connectorCode']} {profile.fullCodes.connectorCode}
        </Button>
        
        <Button 
          variant={isActive('realizationCode') ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('realizationCode')}
          className={`rounded-md ${isActive('realizationCode') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['realizationCode']} {profile.fullCodes.realizationCode}
        </Button>
        
        <Button 
          variant={isActive('generatorCode') ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('generatorCode')}
          className={`rounded-md ${isActive('generatorCode') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['generatorCode']} {profile.fullCodes.generatorCode}
        </Button>
        
        <Button 
          variant={isActive('missionCode') ? 'default' : 'outline'}
          onClick={() => handleSelectCodeType('missionCode')}
          className={`rounded-md ${isActive('missionCode') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['missionCode']} {profile.fullCodes.missionCode}
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
