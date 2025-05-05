
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
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
  } = props;

  const handleSaveClick = () => {
    if (!props.title || !selectedCode || !selectedValue) {
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

  // Генерируем доступные значения в зависимости от кода
  const normalizedCode = normalizeCode(selectedCode);
  
  // Добавляем мастер-число 11 для кода миссии
  const valueOptions = normalizedCode === 'mission' 
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 11] 
    : [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
  // Показываем соответствующие поля в зависимости от выбранного кода
  const renderCodeFields = () => {
    switch (normalizedCode) {
      case 'personality':
        return (
          <PersonalityTabContent
            resourceManifestation={props.resourceManifestation}
            setResourceManifestation={props.setResourceManifestation}
            distortedManifestation={props.distortedManifestation}
            setDistortedManifestation={props.setDistortedManifestation}
            developmentTask={props.developmentTask}
            setDevelopmentTask={props.setDevelopmentTask}
            resourceQualities={props.resourceQualities}
            setResourceQualities={props.setResourceQualities}
            keyDistortions={props.keyDistortions}
            setKeyDistortions={props.setKeyDistortions}
          />
        );
        
      case 'connector':
        return (
          <ConnectorTabContent
            keyTask={props.keyTask}
            setKeyTask={props.setKeyTask}
            workingAspects={props.workingAspects}
            setWorkingAspects={props.setWorkingAspects}
            nonWorkingAspects={props.nonWorkingAspects}
            setNonWorkingAspects={props.setNonWorkingAspects}
            worldContactBasis={props.worldContactBasis}
            setWorldContactBasis={props.setWorldContactBasis}
          />
        );
        
      case 'realization':
        return (
          <RealizationTabContent
            formula={props.formula}
            setFormula={props.setFormula}
            potentialRealizationWays={props.potentialRealizationWays}
            setPotentialRealizationWays={props.setPotentialRealizationWays}
            successSources={props.successSources}
            setSuccessSources={props.setSuccessSources}
            realizationType={props.realizationType}
            setRealizationType={props.setRealizationType}
            realizationObstacles={props.realizationObstacles}
            setRealizationObstacles={props.setRealizationObstacles}
            recommendations={props.recommendations}
            setRecommendations={props.setRecommendations}
          />
        );
        
      case 'generator':
        return (
          <GeneratorTabContent
            generatorFormula={props.generatorFormula}
            setGeneratorFormula={props.setGeneratorFormula}
            energySources={props.energySources}
            setEnergySources={props.setEnergySources}
            energyDrains={props.energyDrains}
            setEnergyDrains={props.setEnergyDrains}
            flowSigns={props.flowSigns}
            setFlowSigns={props.setFlowSigns}
            burnoutSigns={props.burnoutSigns}
            setBurnoutSigns={props.setBurnoutSigns}
            generatorRecommendation={props.generatorRecommendation}
            setGeneratorRecommendation={props.setGeneratorRecommendation}
          />
        );
        
      case 'mission':
        return (
          <MissionTabContent
            missionEssence={props.missionEssence}
            setMissionEssence={props.setMissionEssence}
            missionRealizationFactors={props.missionRealizationFactors}
            setMissionRealizationFactors={props.setMissionRealizationFactors}
            missionChallenges={props.missionChallenges}
            setMissionChallenges={props.setMissionChallenges}
            missionObstacles={props.missionObstacles}
            setMissionObstacles={props.setMissionObstacles}
            mainTransformation={props.mainTransformation}
            setMainTransformation={props.setMainTransformation}
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <div className="text-sm font-medium mb-2">Код</div>
              <Select 
                value={normalizedCode} 
                onValueChange={(value) => setSelectedCode(value as NumerologyCodeType)}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
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
            
            <div>
              <div className="text-sm font-medium mb-2">Значение</div>
              <Select 
                value={String(selectedValue)} 
                onValueChange={(value) => setSelectedValue(Number(value))}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите значение" />
                </SelectTrigger>
                <SelectContent>
                  {valueOptions.map(value => (
                    <SelectItem key={value} value={String(value)}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleSaveClick} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Сохранение..." : "Сохранить архетип"}
              </Button>
            </div>
          </div>

          {/* Общие поля всегда отображаются */}
          <div className="mb-6">
            <GeneralTabContent
              title={props.title}
              setTitle={props.setTitle}
              description={props.description}
              setDescription={props.setDescription}
              maleImageUrl={props.maleImageUrl}
              setMaleImageUrl={props.setMaleImageUrl}
              femaleImageUrl={props.femaleImageUrl}
              setFemaleImageUrl={props.setFemaleImageUrl}
            />
          </div>
          
          {/* Поля в зависимости от выбранного кода */}
          {renderCodeFields()}
        </CardContent>
      </Card>
    </div>
  );
};
