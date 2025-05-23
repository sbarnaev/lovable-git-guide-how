import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NumerologyCodeType } from "@/types/numerology";
import { getArchetypeDescription } from "@/utils/archetypeDescriptions";
import { Skeleton } from "@/components/ui/skeleton";

interface ArchetypePreviewProps {
  selectedCode: NumerologyCodeType;
  selectedValue: number;
}

export const ArchetypePreview = ({ selectedCode, selectedValue }: ArchetypePreviewProps) => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [archetype, setArchetype] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  // Load archetype when code or value changes
  useEffect(() => {
    const loadArchetype = async () => {
      setLoading(true);
      try {
        const result = await getArchetypeDescription(selectedCode, selectedValue);
        setArchetype(result);
      } catch (error) {
        console.error("Error loading archetype:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArchetype();
  }, [selectedCode, selectedValue]);

  // Automatically select tab based on selected code
  useEffect(() => {
    // Convert code to simpler form for tab selection
    const codeBase = selectedCode.replace('Code', '');
    setActiveTab(selectedCode === 'all' ? 'general' : codeBase);
  }, [selectedCode]);

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!archetype) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            Данные архетипа еще не заполнены
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine available tabs based on code type
  const getTabs = () => {
    const tabs = [
      { value: "general", label: "Общее" }
    ];
    
    // Use includes check instead of strict equality for compatibility
    const codeBase = selectedCode.replace('Code', '');
    if (codeBase === 'personality' || selectedCode === 'all') {
      tabs.push({ value: "personality", label: "Личность" });
    }
    
    if (codeBase === 'connector' || selectedCode === 'all') {
      tabs.push({ value: "connector", label: "Коннектор" });
    }
    
    if (codeBase === 'realization' || selectedCode === 'all') {
      tabs.push({ value: "realization", label: "Реализация" });
    }
    
    if (codeBase === 'generator' || selectedCode === 'all') {
      tabs.push({ value: "generator", label: "Генератор" });
    }
    
    if (codeBase === 'mission' || selectedCode === 'all') {
      tabs.push({ value: "mission", label: "Миссия" });
    }
    
    return tabs;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Предварительный просмотр: {archetype.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid grid-cols-6">
            {getTabs().map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="general">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Описание:</h3>
                <p className="text-sm">{archetype.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {archetype.maleImageUrl && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Мужской архетип:</h4>
                    <img 
                      src={archetype.maleImageUrl} 
                      alt={`Мужской архетип ${archetype.title}`} 
                      className="rounded-md max-h-60 object-cover" 
                    />
                  </div>
                )}
                {archetype.femaleImageUrl && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Женский архетип:</h4>
                    <img 
                      src={archetype.femaleImageUrl} 
                      alt={`Женский архетип ${archetype.title}`} 
                      className="rounded-md max-h-60 object-cover" 
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="personality">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Ресурсное проявление:</h3>
                <p className="text-sm">{archetype.resourceManifestation}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Искаженное проявление:</h3>
                <p className="text-sm">{archetype.distortedManifestation}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Задача развития:</h3>
                <p className="text-sm">{archetype.developmentTask}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Ключевые качества в ресурсе:</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.resourceQualities?.map((quality: string, idx: number) => (
                    <li key={idx}>{quality}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Ключевые искажения:</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.keyDistortions?.map((distortion: string, idx: number) => (
                    <li key={idx}>{distortion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="connector">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Ключевая задача:</h3>
                <p className="text-sm">{archetype.keyTask}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Что работает (в ресурсе):</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.workingAspects?.map((aspect: string, idx: number) => (
                    <li key={idx}>{aspect}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Что не работает (искажения):</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.nonWorkingAspects?.map((aspect: string, idx: number) => (
                    <li key={idx}>{aspect}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Контакт с миром должен строиться на:</h3>
                <p className="text-sm">{archetype.worldContactBasis}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="realization">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Формула:</h3>
                <p className="text-sm">{archetype.formula}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Как реализуется потенциал:</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.potentialRealizationWays?.map((way: string, idx: number) => (
                    <li key={idx}>{way}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Где находится источник дохода и успеха:</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.successSources?.map((source: string, idx: number) => (
                    <li key={idx}>{source}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Тип реализации:</h3>
                <p className="text-sm">{archetype.realizationType}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Искажения (что мешает реализовываться):</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.realizationObstacles?.map((obstacle: string, idx: number) => (
                    <li key={idx}>{obstacle}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Рекомендации:</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.recommendations?.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="generator">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Формула:</h3>
                <p className="text-sm">{archetype.generatorFormula}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Что дает энергию:</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.energySources?.map((source: string, idx: number) => (
                    <li key={idx}>{source}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Что забирает энергию:</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.energyDrains?.map((drain: string, idx: number) => (
                    <li key={idx}>{drain}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Признаки, что человек в потоке:</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.flowSigns?.map((sign: string, idx: number) => (
                    <li key={idx}>{sign}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Признаки, что человек выгорел:</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.burnoutSigns?.map((sign: string, idx: number) => (
                    <li key={idx}>{sign}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Рекомендация:</h3>
                <p className="text-sm">{archetype.generatorRecommendation}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mission">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Суть миссии:</h3>
                <p className="text-sm">{archetype.missionEssence}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Что реализует миссию:</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.missionRealizationFactors?.map((factor: string, idx: number) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Испытания миссии:</h3>
                <p className="text-sm">{archetype.missionChallenges}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Что мешает релизовываться:</h3>
                <ul className="list-disc list-inside text-sm pl-2">
                  {archetype.missionObstacles?.map((obstacle: string, idx: number) => (
                    <li key={idx}>{obstacle}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Главная трансформация:</h3>
                <p className="text-sm">{archetype.mainTransformation}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
