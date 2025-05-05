
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
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (!calculation || calculation.type !== 'basic' || !calculation.results.fullCodes) {
    return null;
  }

  const { fullCodes } = calculation.results;

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const findArchetype = (code: NumerologyCodeType): ArchetypeDescription | undefined => {
    return archetypes.find(arch => {
      // Try exact match first
      if (arch.code === code) return true;
      
      // Try with normalized code (without "Code" suffix)
      const normalizedCode = code.replace(/Code$/, '');
      const normalizedArchCode = arch.code.replace(/Code$/, '');
      return normalizedArchCode === normalizedCode;
    });
  };
  
  // Стили для кнопок и активного состояния
  const buttonBaseClass = "flex-grow md:flex-grow-0 font-medium transition-all";
  const activeButtonClass = "bg-indigo-600 text-white hover:bg-indigo-700";
  const inactiveButtonClass = "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Учебник</h2>
      
      {/* Buttons in a horizontal row with improved styling */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeSection === 'personality' ? 'default' : 'outline'}
          onClick={() => toggleSection('personality')}
          className={`${buttonBaseClass} ${activeSection === 'personality' ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Личности {fullCodes.personalityCode}
        </Button>
        
        <Button 
          variant={activeSection === 'connector' ? 'default' : 'outline'}
          onClick={() => toggleSection('connector')}
          className={`${buttonBaseClass} ${activeSection === 'connector' ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Коннектора {fullCodes.connectorCode}
        </Button>
        
        <Button 
          variant={activeSection === 'realization' ? 'default' : 'outline'}
          onClick={() => toggleSection('realization')}
          className={`${buttonBaseClass} ${activeSection === 'realization' ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Реализации {fullCodes.realizationCode}
        </Button>
        
        <Button 
          variant={activeSection === 'generator' ? 'default' : 'outline'}
          onClick={() => toggleSection('generator')}
          className={`${buttonBaseClass} ${activeSection === 'generator' ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Генератора {fullCodes.generatorCode}
        </Button>
        
        <Button 
          variant={activeSection === 'mission' ? 'default' : 'outline'}
          onClick={() => toggleSection('mission')}
          className={`${buttonBaseClass} ${activeSection === 'mission' ? activeButtonClass : inactiveButtonClass}`}
        >
          Код Миссии {fullCodes.missionCode}
        </Button>
      </div>
      
      {/* Content panel with better formatting */}
      {activeSection && (
        <Card className="shadow-md border border-gray-200">
          <CardContent className="p-6">
            <ScrollArea className="max-h-[600px]">
              <ArchetypeDetails 
                archetype={findArchetype(activeSection as NumerologyCodeType)} 
              />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
