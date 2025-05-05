
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';
import { toast } from "sonner";
import { PersonalityTabContent } from './PersonalityTabContent';
import { ConnectorTabContent } from './ConnectorTabContent';
import { RealizationTabContent } from './RealizationTabContent';
import { GeneratorTabContent } from './GeneratorTabContent';
import { MissionTabContent } from './MissionTabContent';
import { GeneralTabContent } from './GeneralTabContent';

interface ArchetypeFormProps {
  loading?: boolean;
  selectedCode: NumerologyCodeType;
  setSelectedCode: (code: NumerologyCodeType) => void;
  selectedValue: number;
  setSelectedValue: (value: number) => void;
  onSave: () => void;
  
  // General fields
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  maleImageUrl: string;
  setMaleImageUrl: (value: string) => void;
  femaleImageUrl: string;
  setFemaleImageUrl: (value: string) => void;
  
  // Personality Code fields
  resourceManifestation: string;
  setResourceManifestation: (value: string) => void;
  distortedManifestation: string;
  setDistortedManifestation: (value: string) => void;
  developmentTask: string;
  setDevelopmentTask: (value: string) => void;
  resourceQualities: string;
  setResourceQualities: (value: string) => void;
  keyDistortions: string;
  setKeyDistortions: (value: string) => void;
  
  // Connector Code fields
  keyTask: string;
  setKeyTask: (value: string) => void;
  workingAspects: string;
  setWorkingAspects: (value: string) => void;
  nonWorkingAspects: string;
  setNonWorkingAspects: (value: string) => void;
  worldContactBasis: string;
  setWorldContactBasis: (value: string) => void;
  
  // Realization Code fields
  formula: string;
  setFormula: (value: string) => void;
  potentialRealizationWays: string;
  setPotentialRealizationWays: (value: string) => void;
  successSources: string;
  setSuccessSources: (value: string) => void;
  realizationType: string;
  setRealizationType: (value: string) => void;
  realizationObstacles: string;
  setRealizationObstacles: (value: string) => void;
  recommendations: string;
  setRecommendations: (value: string) => void;
  
  // Generator Code fields
  generatorFormula: string;
  setGeneratorFormula: (value: string) => void;
  energySources: string;
  setEnergySources: (value: string) => void;
  energyDrains: string;
  setEnergyDrains: (value: string) => void;
  flowSigns: string;
  setFlowSigns: (value: string) => void;
  burnoutSigns: string;
  setBurnoutSigns: (value: string) => void;
  generatorRecommendation: string;
  setGeneratorRecommendation: (value: string) => void;
  
  // Mission Code fields
  missionEssence: string;
  setMissionEssence: (value: string) => void;
  missionRealizationFactors: string;
  setMissionRealizationFactors: (value: string) => void;
  missionChallenges: string;
  setMissionChallenges: (value: string) => void;
  missionObstacles: string;
  setMissionObstacles: (value: string) => void;
  mainTransformation: string;
  setMainTransformation: (value: string) => void;
}

export const ArchetypeForm = (props: ArchetypeFormProps) => {
  const {
    loading = false,
    selectedCode,
    setSelectedCode,
    selectedValue,
    setSelectedValue,
    onSave,
    
    // General fields
    title,
    setTitle,
    description,
    setDescription,
    maleImageUrl,
    setMaleImageUrl,
    femaleImageUrl,
    setFemaleImageUrl,
    
    // Personality Code fields
    resourceManifestation,
    setResourceManifestation,
    distortedManifestation,
    setDistortedManifestation,
    developmentTask,
    setDevelopmentTask,
    resourceQualities,
    setResourceQualities,
    keyDistortions,
    setKeyDistortions,
    
    // Connector Code fields
    keyTask,
    setKeyTask,
    workingAspects,
    setWorkingAspects,
    nonWorkingAspects,
    setNonWorkingAspects,
    worldContactBasis,
    setWorldContactBasis,
    
    // Realization Code fields
    formula,
    setFormula,
    potentialRealizationWays,
    setPotentialRealizationWays,
    successSources,
    setSuccessSources,
    realizationType,
    setRealizationType,
    realizationObstacles,
    setRealizationObstacles,
    recommendations,
    setRecommendations,
    
    // Generator Code fields
    generatorFormula,
    setGeneratorFormula,
    energySources,
    setEnergySources,
    energyDrains,
    setEnergyDrains,
    flowSigns,
    setFlowSigns,
    burnoutSigns,
    setBurnoutSigns,
    generatorRecommendation,
    setGeneratorRecommendation,
    
    // Mission Code fields
    missionEssence,
    setMissionEssence,
    missionRealizationFactors,
    setMissionRealizationFactors,
    missionChallenges,
    setMissionChallenges,
    missionObstacles,
    setMissionObstacles,
    mainTransformation,
    setMainTransformation,
  } = props;

  const handleSaveClick = () => {
    if (!title || !selectedCode || !selectedValue) {
      toast.error("Пожалуйста, заполните все обязательные поля (Название, Код, Значение)");
      return;
    }
    
    onSave();
  };

  const normalizeCode = (code: NumerologyCodeType): NumerologyCodeType => {
    const codeMap: Record<string, NumerologyCodeType> = {
      'personalityCode': 'personality',
      'connectorCode': 'connector', 
      'realizationCode': 'realization',
      'generatorCode': 'generator',
      'missionCode': 'mission'
    };
    
    return (codeMap[code] as NumerologyCodeType) || code;
  };

  // Доступные коды
  const codeOptions = [
    { value: 'personality', label: 'Код Личности' },
    { value: 'connector', label: 'Код Коннектора' },
    { value: 'realization', label: 'Код Реализации' },
    { value: 'generator', label: 'Код Генератора' },
    { value: 'mission', label: 'Код Миссии' }
  ];

  // Доступные значения (числа от 1 до 9)
  const valueOptions = Array.from({ length: 9 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`
  }));
  
  // Нормализуем код для корректного отображения вкладок
  const normalizedCode = normalizeCode(selectedCode);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="md:w-1/3">
              <label className="text-sm font-medium">Название архетипа</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название архетипа" 
                disabled={loading}
              />
            </div>
            
            <div className="md:w-1/3">
              <label className="text-sm font-medium">Код</label>
              <Select 
                value={normalizedCode} 
                onValueChange={(value) => setSelectedCode(value as NumerologyCodeType)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите код" />
                </SelectTrigger>
                <SelectContent>
                  {codeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:w-1/3">
              <label className="text-sm font-medium">Значение</label>
              <Select 
                value={String(selectedValue)} 
                onValueChange={(value) => setSelectedValue(Number(value))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите значение" />
                </SelectTrigger>
                <SelectContent>
                  {valueOptions.map(option => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="general">Общее</TabsTrigger>
              <TabsTrigger value="personality">Личность</TabsTrigger>
              <TabsTrigger value="connector">Коннектор</TabsTrigger>
              <TabsTrigger value="realization">Реализация</TabsTrigger>
              <TabsTrigger value="generator">Генератор</TabsTrigger>
              <TabsTrigger value="mission">Миссия</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <GeneralTabContent
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                maleImageUrl={maleImageUrl}
                setMaleImageUrl={setMaleImageUrl}
                femaleImageUrl={femaleImageUrl}
                setFemaleImageUrl={setFemaleImageUrl}
              />
            </TabsContent>
            
            <TabsContent value="personality">
              <PersonalityTabContent
                resourceManifestation={resourceManifestation}
                setResourceManifestation={setResourceManifestation}
                distortedManifestation={distortedManifestation}
                setDistortedManifestation={setDistortedManifestation}
                developmentTask={developmentTask}
                setDevelopmentTask={setDevelopmentTask}
                resourceQualities={resourceQualities}
                setResourceQualities={setResourceQualities}
                keyDistortions={keyDistortions}
                setKeyDistortions={setKeyDistortions}
              />
            </TabsContent>
            
            <TabsContent value="connector">
              <ConnectorTabContent
                keyTask={keyTask}
                setKeyTask={setKeyTask}
                workingAspects={workingAspects}
                setWorkingAspects={setWorkingAspects}
                nonWorkingAspects={nonWorkingAspects}
                setNonWorkingAspects={setNonWorkingAspects}
                worldContactBasis={worldContactBasis}
                setWorldContactBasis={setWorldContactBasis}
              />
            </TabsContent>
            
            <TabsContent value="realization">
              <RealizationTabContent
                formula={formula}
                setFormula={setFormula}
                potentialRealizationWays={potentialRealizationWays}
                setPotentialRealizationWays={setPotentialRealizationWays}
                successSources={successSources}
                setSuccessSources={setSuccessSources}
                realizationType={realizationType}
                setRealizationType={setRealizationType}
                realizationObstacles={realizationObstacles}
                setRealizationObstacles={setRealizationObstacles}
                recommendations={recommendations}
                setRecommendations={setRecommendations}
              />
            </TabsContent>
            
            <TabsContent value="generator">
              <GeneratorTabContent
                generatorFormula={generatorFormula}
                setGeneratorFormula={setGeneratorFormula}
                energySources={energySources}
                setEnergySources={setEnergySources}
                energyDrains={energyDrains}
                setEnergyDrains={setEnergyDrains}
                flowSigns={flowSigns}
                setFlowSigns={setFlowSigns}
                burnoutSigns={burnoutSigns}
                setBurnoutSigns={setBurnoutSigns}
                generatorRecommendation={generatorRecommendation}
                setGeneratorRecommendation={setGeneratorRecommendation}
              />
            </TabsContent>
            
            <TabsContent value="mission">
              <MissionTabContent
                missionEssence={missionEssence}
                setMissionEssence={setMissionEssence}
                missionRealizationFactors={missionRealizationFactors}
                setMissionRealizationFactors={setMissionRealizationFactors}
                missionChallenges={missionChallenges}
                setMissionChallenges={setMissionChallenges}
                missionObstacles={missionObstacles}
                setMissionObstacles={setMissionObstacles}
                mainTransformation={mainTransformation}
                setMainTransformation={setMainTransformation}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveClick} 
          disabled={loading}
          className="px-8"
        >
          {loading ? "Сохранение..." : "Сохранить архетип"}
        </Button>
      </div>
    </div>
  );
};
