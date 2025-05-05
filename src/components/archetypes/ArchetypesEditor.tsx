
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeForm } from "@/components/archetypes/ArchetypeForm";
import { NumerologyCodeType } from "@/types/numerology";

interface ArchetypesEditorProps {
  loading: boolean;
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

export const ArchetypesEditor: React.FC<ArchetypesEditorProps> = (props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Архетип {props.title || `${props.selectedValue}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <ArchetypeForm {...props} />
      </CardContent>
    </Card>
  );
};
