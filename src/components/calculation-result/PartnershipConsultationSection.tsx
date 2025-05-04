
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AIContentSection } from '@/components/AIContentSection';
import { ArchetypeDescription } from '@/types/numerology';

interface PartnershipConsultationSectionProps {
  calculationId: string;
  combinedArchetypes: ArchetypeDescription[];
}

export const PartnershipConsultationSection: React.FC<PartnershipConsultationSectionProps> = ({ 
  calculationId, 
  combinedArchetypes 
}) => {
  const [activeTab, setActiveTab] = useState<string>("sides");
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Консультация</h2>
      
      <Tabs defaultValue="sides" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="sides">Описание сторон</TabsTrigger>
          <TabsTrigger value="interaction">Взаимодействие</TabsTrigger>
          <TabsTrigger value="energy">Энергия</TabsTrigger>
          <TabsTrigger value="amplification">Усиления</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Уязвимости</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sides">
          <Card>
            <CardContent className="pt-6">
              <AIContentSection 
                title="" 
                type="strengths-weaknesses"
                archetypes={combinedArchetypes}
                calculationId={calculationId}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interaction">
          <Card>
            <CardContent className="pt-6">
              <AIContentSection 
                title="" 
                type="code-conflicts"
                archetypes={combinedArchetypes}
                calculationId={calculationId}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="energy">
          <Card>
            <CardContent className="pt-6">
              <AIContentSection 
                title="" 
                type="summary"
                archetypes={combinedArchetypes}
                calculationId={calculationId}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="amplification">
          <Card>
            <CardContent className="pt-6">
              <AIContentSection 
                title="" 
                type="practices"
                archetypes={combinedArchetypes}
                calculationId={calculationId}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vulnerabilities">
          <Card>
            <CardContent className="pt-6">
              <AIContentSection 
                title="" 
                type="potential-problems"
                archetypes={combinedArchetypes}
                calculationId={calculationId}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
