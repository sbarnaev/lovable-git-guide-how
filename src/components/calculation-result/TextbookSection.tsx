
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArchetypeDetails } from './ArchetypeDetails';
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';
import { BasicCalculation } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TextbookSectionProps {
  calculation: (BasicCalculation & { id: string; createdAt: string }) | undefined;
  archetypes: ArchetypeDescription[];
}

export const TextbookSection: React.FC<TextbookSectionProps> = ({
  calculation,
  archetypes
}) => {
  const [activeSection, setActiveSection] = useState<NumerologyCodeType | null>(null);

  if (!calculation || calculation.type !== 'basic' || !calculation.results.fullCodes) {
    return null;
  }

  const { fullCodes } = calculation.results;

  const toggleSection = (section: NumerologyCodeType) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const findArchetype = (code: NumerologyCodeType): ArchetypeDescription | undefined => {
    // Normalize the code type (remove 'Code' suffix if present)
    const normalizedCode = code.replace(/Code$/, '');
    
    // Get the value from fullCodes using either normalized or original key
    const codeKey = normalizedCode as keyof typeof fullCodes;
    const codeValue = fullCodes[codeKey];
    
    console.log(`Looking for ${code} with value ${codeValue} among ${archetypes.length} archetypes`);
    
    // First try exact match on code and value
    let match = archetypes.find(arch => 
      (arch.code === code || arch.code === normalizedCode) && 
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
    
    console.log(`No matching archetype found for ${code} with value ${codeValue}`);
    return undefined;
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
  const isActive = (code: NumerologyCodeType) => activeSection === code;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Учебник</h2>
      
      {/* Buttons in a horizontal row with proper styling */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={isActive('personality') ? 'default' : 'outline'}
          onClick={() => toggleSection('personality')}
          className={`rounded-md ${isActive('personality') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['personality']} {fullCodes.personalityCode}
        </Button>
        
        <Button 
          variant={isActive('connector') ? 'default' : 'outline'}
          onClick={() => toggleSection('connector')}
          className={`rounded-md ${isActive('connector') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['connector']} {fullCodes.connectorCode}
        </Button>
        
        <Button 
          variant={isActive('realization') ? 'default' : 'outline'}
          onClick={() => toggleSection('realization')}
          className={`rounded-md ${isActive('realization') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['realization']} {fullCodes.realizationCode}
        </Button>
        
        <Button 
          variant={isActive('generator') ? 'default' : 'outline'}
          onClick={() => toggleSection('generator')}
          className={`rounded-md ${isActive('generator') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['generator']} {fullCodes.generatorCode}
        </Button>
        
        <Button 
          variant={isActive('mission') ? 'default' : 'outline'}
          onClick={() => toggleSection('mission')}
          className={`rounded-md ${isActive('mission') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
        >
          Код {codeDisplayNames['mission']} {fullCodes.missionCode}
        </Button>
      </div>
      
      {/* Content panel */}
      {activeSection && (
        <Card className="border rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <ScrollArea className="max-h-[600px] pr-4">
              <ArchetypeDetails 
                archetype={findArchetype(activeSection)} 
              />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
