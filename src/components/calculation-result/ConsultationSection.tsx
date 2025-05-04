
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AIContentSection } from '@/components/AIContentSection';
import { AIChat } from '@/components/AIChat';
import { ArchetypeDescription } from '@/types/numerology';

interface ConsultationSectionProps {
  archetypes: ArchetypeDescription[];
  calculationId: string;
}

export const ConsultationSection: React.FC<ConsultationSectionProps> = ({ 
  archetypes, 
  calculationId 
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Консультация</h2>
      
      {/* Buttons in a horizontal row */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeSection === 'strengths-weaknesses' ? 'default' : 'outline'}
          onClick={() => toggleSection('strengths-weaknesses')}
          className="flex-grow md:flex-grow-0"
        >
          Сильные и слабые стороны
        </Button>
        
        <Button 
          variant={activeSection === 'code-conflicts' ? 'default' : 'outline'}
          onClick={() => toggleSection('code-conflicts')}
          className="flex-grow md:flex-grow-0"
        >
          Конфликты кодов
        </Button>
        
        <Button 
          variant={activeSection === 'potential-problems' ? 'default' : 'outline'}
          onClick={() => toggleSection('potential-problems')}
          className="flex-grow md:flex-grow-0"
        >
          Потенциальные проблемы
        </Button>
        
        <Button 
          variant={activeSection === 'practices' ? 'default' : 'outline'}
          onClick={() => toggleSection('practices')}
          className="flex-grow md:flex-grow-0"
        >
          Практики
        </Button>
        
        <Button 
          variant={activeSection === 'assistant' ? 'default' : 'outline'}
          onClick={() => toggleSection('assistant')}
          className="flex-grow md:flex-grow-0"
        >
          Помощник
        </Button>
      </div>
      
      {/* Content panel based on active section */}
      {activeSection === 'strengths-weaknesses' && calculationId && (
        <Card>
          <CardContent className="pt-6">
            {archetypes.length > 0 && (
              <AIContentSection 
                title=""
                type="strengths-weaknesses"
                archetypes={archetypes}
                calculationId={calculationId}
              />
            )}
          </CardContent>
        </Card>
      )}
      
      {activeSection === 'code-conflicts' && calculationId && (
        <Card>
          <CardContent className="pt-6">
            {archetypes.length > 0 && (
              <AIContentSection 
                title=""
                type="code-conflicts"
                archetypes={archetypes}
                calculationId={calculationId}
              />
            )}
          </CardContent>
        </Card>
      )}
      
      {activeSection === 'potential-problems' && calculationId && (
        <Card>
          <CardContent className="pt-6">
            {archetypes.length > 0 && (
              <AIContentSection 
                title=""
                type="potential-problems"
                archetypes={archetypes}
                calculationId={calculationId}
              />
            )}
          </CardContent>
        </Card>
      )}
      
      {activeSection === 'practices' && calculationId && (
        <Card>
          <CardContent className="pt-6">
            {archetypes.length > 0 && (
              <AIContentSection 
                title=""
                type="practices"
                archetypes={archetypes}
                calculationId={calculationId}
              />
            )}
          </CardContent>
        </Card>
      )}
      
      {activeSection === 'assistant' && calculationId && (
        <Card>
          <CardContent className="pt-6">
            {archetypes.length > 0 && (
              <AIChat 
                archetypes={archetypes}
                calculationId={calculationId}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
