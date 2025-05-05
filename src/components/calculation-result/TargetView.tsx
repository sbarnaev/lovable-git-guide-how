
import React, { useState } from 'react';
import { TargetCalculation } from '@/types';
import { ArchetypeDescription } from '@/types/numerology';
import { AIContentSection } from '@/components/AIContentSection';
import { NoteEditor } from '@/components/note-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AIChat } from '@/components/AIChat';

// Note: This is a temporary flag to disable notes
const NOTES_DISABLED = true;

interface TargetViewProps {
  calculation: (TargetCalculation & { id: string; createdAt: string });
  archetypes: ArchetypeDescription[];
}

export const TargetView: React.FC<TargetViewProps> = ({ calculation, archetypes }) => {
  const targetCalc = calculation;
  const [activeTab, setActiveTab] = useState<string>("client-needs");
  
  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Информация о клиенте</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm">ФИО клиента</h3>
              <p>{targetCalc.clientName}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Дата рождения</h3>
              <p>{new Date(targetCalc.birthDate).toLocaleDateString('ru-RU')}</p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-medium text-sm">Запрос</h3>
              <p>{targetCalc.targetQuery}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* AI Summary - Goal-focused summary */}
      {archetypes.length > 0 && calculation.id && (
        <AIContentSection 
          title="Саммари" 
          type="summary"
          archetypes={archetypes}
          calculationId={calculation.id}
        />
      )}
      
      {/* Target Analysis */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Анализ</CardTitle>
        </CardHeader>
        <CardContent>
          {targetCalc.results && targetCalc.results.analysis ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Основные факторы:</h3>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {targetCalc.results.analysis.mainFactors?.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Текущая фаза:</h3>
                <p className="mt-1">{targetCalc.results.analysis.currentPhase}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Потенциальные результаты:</h3>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {targetCalc.results.analysis.potentialOutcomes?.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              Данные анализа отсутствуют.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Consultation section with new tabs */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Консультация</h2>
        
        <Tabs defaultValue="client-needs" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="client-needs">Что хочет клиент</TabsTrigger>
            <TabsTrigger value="code-synthesis">Синтез кодов</TabsTrigger>
            <TabsTrigger value="challenges">Сложности</TabsTrigger>
            <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
            <TabsTrigger value="assistant">Помощник</TabsTrigger>
          </TabsList>
          
          <TabsContent value="client-needs">
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && calculation.id && (
                  <AIContentSection 
                    title=""
                    type="client-needs"
                    archetypes={archetypes}
                    calculationId={calculation.id}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="code-synthesis">
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && calculation.id && (
                  <AIContentSection 
                    title=""
                    type="code-synthesis"
                    archetypes={archetypes}
                    calculationId={calculation.id}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="challenges">
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && calculation.id && (
                  <AIContentSection 
                    title=""
                    type="target-challenges"
                    archetypes={archetypes}
                    calculationId={calculation.id}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && calculation.id && (
                  <AIContentSection 
                    title=""
                    type="target-recommendations"
                    archetypes={archetypes}
                    calculationId={calculation.id}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assistant">
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && calculation.id && (
                  <AIChat 
                    archetypes={archetypes}
                    calculationId={calculation.id}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Notes - conditionally disabled */}
      {!NOTES_DISABLED && calculation.id && (
        <div className="space-y-4">
          <NoteEditor calculationId={calculation.id} />
        </div>
      )}
    </div>
  );
};
