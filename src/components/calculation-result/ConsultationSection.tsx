
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState<string>("strengths");
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Консультация</h2>
      
      <Tabs defaultValue="strengths" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="strengths">Сильные и слабые стороны</TabsTrigger>
          <TabsTrigger value="conflicts">Конфликты кодов</TabsTrigger>
          <TabsTrigger value="problems">Потенциальные проблемы</TabsTrigger>
          <TabsTrigger value="practices">Практики</TabsTrigger>
          <TabsTrigger value="assistant">Помощник</TabsTrigger>
        </TabsList>
        
        <TabsContent value="strengths">
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
        </TabsContent>
        
        <TabsContent value="conflicts">
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
        </TabsContent>
        
        <TabsContent value="problems">
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
        </TabsContent>
        
        <TabsContent value="practices">
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
        </TabsContent>
        
        <TabsContent value="assistant">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
