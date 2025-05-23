
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArchetypeDetails } from './ArchetypeDetails';
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';
import { BasicCalculation } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { normalizeCodeType } from '@/utils/archetypeDescriptions';

interface TextbookSectionProps {
  calculation: (BasicCalculation & { id: string; createdAt: string }) | undefined;
  archetypes: ArchetypeDescription[];
}

export const TextbookSection: React.FC<TextbookSectionProps> = ({
  calculation,
  archetypes
}) => {
  const [activeSection, setActiveSection] = useState<NumerologyCodeType | null>(null);

  // Отладочный эффект
  useEffect(() => {
    console.log("TextbookSection rendered with:", {
      calculation: calculation?.id,
      archetypes: archetypes?.length,
      activeSection,
      fullCodes: calculation?.results?.fullCodes
    });
    
    if (calculation?.results?.fullCodes) {
      console.log("fullCodes in TextbookSection:", calculation.results.fullCodes);
    }
  }, [calculation, archetypes, activeSection]);

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

  // Improved function to find the right archetype
  const findArchetype = (code: NumerologyCodeType): ArchetypeDescription | undefined => {
    if (!archetypes || archetypes.length === 0) {
      console.log(`No archetypes available for ${code} search`);
      return undefined;
    }
    
    // Normalize the code type (remove 'Code' suffix if present)
    const normalizedCode = normalizeCodeType(code);
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
  
  // Маппинг кодов на их отображаемые имена
  const codeDisplayNames: Record<string, string> = {
    'personality': 'Личности',
    'connector': 'Коннектора',
    'realization': 'Реализации',
    'generator': 'Генератора',
    'mission': 'Миссии'
  };
  
  // Определяем, какая кнопка активна для улучшения стиля
  const isActive = (code: NumerologyCodeType) => activeSection === code;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Учебник</h2>
      
      {/* Кнопки в горизонтальном ряду с правильным стилем */}
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
      
      {/* Панель содержимого */}
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
