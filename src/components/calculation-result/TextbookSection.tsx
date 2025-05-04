
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArchetypeDetails } from './ArchetypeDetails';
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';
import { BasicCalculation } from '@/types';

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
    return archetypes.find(arch => arch.code === code);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Учебник</h2>
      
      {/* Buttons in a horizontal row */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeSection === 'personality' ? 'default' : 'outline'}
          onClick={() => toggleSection('personality')}
          className="flex-grow md:flex-grow-0"
        >
          Код Личности {fullCodes.personalityCode}
        </Button>
        
        <Button 
          variant={activeSection === 'connector' ? 'default' : 'outline'}
          onClick={() => toggleSection('connector')}
          className="flex-grow md:flex-grow-0"
        >
          Код Коннектора {fullCodes.connectorCode}
        </Button>
        
        <Button 
          variant={activeSection === 'realization' ? 'default' : 'outline'}
          onClick={() => toggleSection('realization')}
          className="flex-grow md:flex-grow-0"
        >
          Код Реализации {fullCodes.realizationCode}
        </Button>
        
        <Button 
          variant={activeSection === 'generator' ? 'default' : 'outline'}
          onClick={() => toggleSection('generator')}
          className="flex-grow md:flex-grow-0"
        >
          Код Генератора {fullCodes.generatorCode}
        </Button>
        
        <Button 
          variant={activeSection === 'mission' ? 'default' : 'outline'}
          onClick={() => toggleSection('mission')}
          className="flex-grow md:flex-grow-0"
        >
          Код Миссии {fullCodes.missionCode}
        </Button>
      </div>
      
      {/* Content panel based on active section */}
      {(activeSection === 'personality' || activeSection === 'connector' || 
        activeSection === 'realization' || activeSection === 'generator' || 
        activeSection === 'mission') && (
        <Card>
          <CardContent className="pt-6">
            <ArchetypeDetails archetype={findArchetype(activeSection as NumerologyCodeType)} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
