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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ArchetypeFormProps {
  selectedCode: NumerologyCodeType;
  setSelectedCode: React.Dispatch<React.SetStateAction<NumerologyCodeType>>;
  selectedValue: number;
  setSelectedValue: React.Dispatch<React.SetStateAction<number>>;
  onSave: () => void;
  loading?: boolean;
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
  const allowedValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const missionAllowedValues = [...allowedValues, 11]; // Для миссии добавляем мастер-число 11
  
  const [archetypeValue, setArchetypeValue] = useState<number>(props.selectedValue);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const handleSaveClick = async () => {
    try {
      setIsSaving(true);
      await props.onSave();
    } catch (error) {
      toast.error(`Ошибка: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  const codeLabels: Record<NumerologyCodeType, string> = {
    personality: "Код Личности",
    connector: "Код Коннектора",
    realization: "Код Реализации",
    generator: "Код Генератора",
    mission: "Код Миссии",
    all: "Все коды" // Добавляем для типа 'all'
  };

  // Инициализируем отображение соответствующего контента для выбранного кода
  const getTabContent = () => {
    switch (props.selectedCode) {
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
        return (
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
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Архетип {archetypeValue}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Выберите значение архетипа</label>
              <Select 
                value={archetypeValue.toString()} 
                onValueChange={(value) => {
                  const numValue = parseInt(value);
                  setArchetypeValue(numValue);
                  props.setSelectedValue(numValue);
                }}
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
                  {/* Добавляем 11 только для миссии */}
                  {props.selectedCode === 'mission' && (
                    <SelectItem key={11} value="11">
                      11 (мастер-число)
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Выберите тип кода</label>
              <Select 
                value={props.selectedCode} 
                onValueChange={(value: NumerologyCodeType) => {
                  props.setSelectedCode(value);
                  
                  // Если выбрана миссия и значение было 11, оставляем его
                  // Если выбран другой код и было 11, сбрасываем на 1
                  if (value !== 'mission' && props.selectedValue === 11) {
                    props.setSelectedValue(1);
                    setArchetypeValue(1);
                  }
                }}
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
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm">
              <strong>Редактирование:</strong> {codeLabels[props.selectedCode]} для архетипа {props.selectedValue}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {props.loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Загрузка данных...</span>
        </div>
      ) : (
        <>
          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-6 mb-4 w-full">
              <TabsTrigger value="general">Общее</TabsTrigger>
              <TabsTrigger value="codeDetails">Данные кода</TabsTrigger>
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
            
            <TabsContent value="codeDetails">
              {getTabContent()}
            </TabsContent>
          </Tabs>
          
          <div className="py-4 flex justify-center">
            <Button 
              onClick={handleSaveClick} 
              size="lg" 
              className="px-8"
              disabled={isSaving || props.loading}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : 'Сохранить архетип'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
