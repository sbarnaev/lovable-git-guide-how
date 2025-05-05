
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { AIContentSection } from '@/components/AIContentSection';
import { AIChat } from '@/components/AIChat';
import { ArchetypeDescription } from '@/types/numerology';
import { MessageSquare, MessageCircle, Activity, AlertTriangle, Bulb, Bot } from 'lucide-react';

interface ConsultationTabsProps {
  calculationId: string;
  archetypes: ArchetypeDescription[];
}

export const ConsultationTabs: React.FC<ConsultationTabsProps> = ({ calculationId, archetypes }) => {
  const [activeTab, setActiveTab] = useState<string>("summary");
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="summary" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="summary" className="flex gap-2 items-center">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">Саммари</span>
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex gap-2 items-center">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden md:inline">Коммуникация</span>
          </TabsTrigger>
          <TabsTrigger value="realization" className="flex gap-2 items-center">
            <Activity className="h-4 w-4" />
            <span className="hidden md:inline">Реализация</span>
          </TabsTrigger>
          <TabsTrigger value="difficulties" className="flex gap-2 items-center">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden md:inline">Сложности</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex gap-2 items-center">
            <Bulb className="h-4 w-4" />
            <span className="hidden md:inline">Рекомендации</span>
          </TabsTrigger>
          <TabsTrigger value="assistant" className="flex gap-2 items-center">
            <Bot className="h-4 w-4" />
            <span className="hidden md:inline">Помощник</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <Card>
            <CardContent className="pt-6">
              <AIContentSection 
                title=""
                type="summary"
                archetypes={archetypes}
                calculationId={calculationId}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communication">
          <Card>
            <CardContent className="pt-6">
              <AIContentSection 
                title=""
                type="communication"
                archetypes={archetypes}
                calculationId={calculationId}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="realization">
          <Card>
            <CardContent className="pt-6">
              <AIContentSection 
                title=""
                type="realization"
                archetypes={archetypes}
                calculationId={calculationId}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="difficulties">
          <Card>
            <CardContent className="pt-6">
              <AIContentSection 
                title=""
                type="difficulties"
                archetypes={archetypes}
                calculationId={calculationId}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card>
            <CardContent className="pt-6">
              <AIContentSection 
                title=""
                type="recommendations"
                archetypes={archetypes}
                calculationId={calculationId}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assistant">
          <Card>
            <CardContent className="pt-6">
              <AIChat 
                archetypes={archetypes}
                calculationId={calculationId}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
