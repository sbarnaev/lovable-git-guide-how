
import React from "react";
import { NumerologyCodeType } from '@/types/numerology';
import { PersonalityTabContent } from './PersonalityTabContent';
import { ConnectorTabContent } from './ConnectorTabContent';
import { RealizationTabContent } from './RealizationTabContent';
import { GeneratorTabContent } from './GeneratorTabContent';
import { MissionTabContent } from './MissionTabContent';

interface CodeContentRendererProps {
  selectedCode: NumerologyCodeType;
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

export const CodeContentRenderer = (props: CodeContentRendererProps) => {
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

  // Показываем соответствующие поля в зависимости от выбранного кода
  const normalizedCode = normalizeCode(props.selectedCode);
  
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
