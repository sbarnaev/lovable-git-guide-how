
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { NumerologyCodeType } from "@/types/numerology";
import { GeneralTabContent } from "./GeneralTabContent";
import { PersonalityTabContent } from "./PersonalityTabContent";
import { ConnectorTabContent } from "./ConnectorTabContent";
import { RealizationTabContent } from "./RealizationTabContent";
import { GeneratorTabContent } from "./GeneratorTabContent";
import { MissionTabContent } from "./MissionTabContent";
import { toast } from "@/components/ui/sonner";

interface ArchetypeFormProps {
  selectedCode: NumerologyCodeType;
  setSelectedCode: React.Dispatch<React.SetStateAction<NumerologyCodeType>>;
  selectedValue: number;
  setSelectedValue: React.Dispatch<React.SetStateAction<number>>;
  onSave: () => void;
  // General fields
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  maleImageUrl: string;
  setMaleImageUrl: React.Dispatch<React.SetStateAction<string>>;
  femaleImageUrl: string;
  setFemaleImageUrl: React.Dispatch<React.SetStateAction<string>>;
  // Personality Code fields
  resourceManifestation: string;
  setResourceManifestation: React.Dispatch<React.SetStateAction<string>>;
  distortedManifestation: string;
  setDistortedManifestation: React.Dispatch<React.SetStateAction<string>>;
  developmentTask: string;
  setDevelopmentTask: React.Dispatch<React.SetStateAction<string>>;
  resourceQualities: string;
  setResourceQualities: React.Dispatch<React.SetStateAction<string>>;
  keyDistortions: string;
  setKeyDistortions: React.Dispatch<React.SetStateAction<string>>;
  // Connector Code fields
  keyTask: string;
  setKeyTask: React.Dispatch<React.SetStateAction<string>>;
  workingAspects: string;
  setWorkingAspects: React.Dispatch<React.SetStateAction<string>>;
  nonWorkingAspects: string;
  setNonWorkingAspects: React.Dispatch<React.SetStateAction<string>>;
  worldContactBasis: string;
  setWorldContactBasis: React.Dispatch<React.SetStateAction<string>>;
  // Realization Code fields
  formula: string;
  setFormula: React.Dispatch<React.SetStateAction<string>>;
  potentialRealizationWays: string;
  setPotentialRealizationWays: React.Dispatch<React.SetStateAction<string>>;
  successSources: string;
  setSuccessSources: React.Dispatch<React.SetStateAction<string>>;
  realizationType: string;
  setRealizationType: React.Dispatch<React.SetStateAction<string>>;
  realizationObstacles: string;
  setRealizationObstacles: React.Dispatch<React.SetStateAction<string>>;
  recommendations: string;
  setRecommendations: React.Dispatch<React.SetStateAction<string>>;
  // Generator Code fields
  generatorFormula: string;
  setGeneratorFormula: React.Dispatch<React.SetStateAction<string>>;
  energySources: string;
  setEnergySources: React.Dispatch<React.SetStateAction<string>>;
  energyDrains: string;
  setEnergyDrains: React.Dispatch<React.SetStateAction<string>>;
  flowSigns: string;
  setFlowSigns: React.Dispatch<React.SetStateAction<string>>;
  burnoutSigns: string;
  setBurnoutSigns: React.Dispatch<React.SetStateAction<string>>;
  generatorRecommendation: string;
  setGeneratorRecommendation: React.Dispatch<React.SetStateAction<string>>;
  // Mission Code fields
  missionEssence: string;
  setMissionEssence: React.Dispatch<React.SetStateAction<string>>;
  missionRealizationFactors: string;
  setMissionRealizationFactors: React.Dispatch<React.SetStateAction<string>>;
  missionChallenges: string;
  setMissionChallenges: React.Dispatch<React.SetStateAction<string>>;
  missionObstacles: string;
  setMissionObstacles: React.Dispatch<React.SetStateAction<string>>;
  mainTransformation: string;
  setMainTransformation: React.Dispatch<React.SetStateAction<string>>;
}

export const ArchetypeForm = (props: ArchetypeFormProps) => {
  const [activeTab, setActiveTab] = useState("general");
  
  const allowedValues = props.selectedCode === 'mission' 
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 11] 
    : [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Код</label>
          <Select 
            value={props.selectedCode} 
            onValueChange={(value) => props.setSelectedCode(value as NumerologyCodeType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите код" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personality">Код Личности</SelectItem>
              <SelectItem value="connector">Код Коннектора</SelectItem>
              <SelectItem value="realization">Код Реализации</SelectItem>
              <SelectItem value="generator">Код Генератора</SelectItem>
              <SelectItem value="mission">Код Миссии</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Значение</label>
          <Select 
            value={props.selectedValue.toString()} 
            onValueChange={(value) => props.setSelectedValue(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите значение" />
            </SelectTrigger>
            <SelectContent>
              {allowedValues.map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            title={props.title}
            setTitle={props.setTitle}
            description={props.description}
            setDescription={props.setDescription}
            maleImageUrl={props.maleImageUrl}
            setMaleImageUrl={props.setMaleImageUrl}
            femaleImageUrl={props.femaleImageUrl}
            setFemaleImageUrl={props.setFemaleImageUrl}
          />
        </TabsContent>
        
        <TabsContent value="personality">
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
        </TabsContent>
        
        <TabsContent value="connector">
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
        </TabsContent>
        
        <TabsContent value="realization">
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
        </TabsContent>
        
        <TabsContent value="generator">
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
        </TabsContent>
        
        <TabsContent value="mission">
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
        </TabsContent>
      </Tabs>
      
      <div className="pt-4">
        <Button onClick={props.onSave}>Сохранить</Button>
      </div>
    </div>
  );
};
