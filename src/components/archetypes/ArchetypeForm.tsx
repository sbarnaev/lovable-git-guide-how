import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';
import { toast } from "@/hooks/use-toast"; // Correct import path for toast

interface ArchetypeFormProps {
  loading?: boolean;
  archetype?: ArchetypeDescription;
  onChange?: (updatedArchetype: ArchetypeDescription) => void;
  
  // New props to match those passed from ArchetypesAdminPage.tsx
  selectedCode?: NumerologyCodeType;
  setSelectedCode?: (code: NumerologyCodeType) => void;
  selectedValue?: number;
  setSelectedValue?: (value: number) => void;
  onSave?: () => void;
  
  // General fields
  title?: string;
  setTitle?: (value: string) => void;
  description?: string;
  setDescription?: (value: string) => void;
  maleImageUrl?: string;
  setMaleImageUrl?: (value: string) => void;
  femaleImageUrl?: string;
  setFemaleImageUrl?: (value: string) => void;
  
  // Personality Code fields
  resourceManifestation?: string;
  setResourceManifestation?: (value: string) => void;
  distortedManifestation?: string;
  setDistortedManifestation?: (value: string) => void;
  developmentTask?: string;
  setDevelopmentTask?: (value: string) => void;
  resourceQualities?: string;
  setResourceQualities?: (value: string) => void;
  keyDistortions?: string;
  setKeyDistortions?: (value: string) => void;
  
  // Connector Code fields
  keyTask?: string;
  setKeyTask?: (value: string) => void;
  workingAspects?: string;
  setWorkingAspects?: (value: string) => void;
  nonWorkingAspects?: string;
  setNonWorkingAspects?: (value: string) => void;
  worldContactBasis?: string;
  setWorldContactBasis?: (value: string) => void;
  
  // Realization Code fields
  formula?: string;
  setFormula?: (value: string) => void;
  potentialRealizationWays?: string;
  setPotentialRealizationWays?: (value: string) => void;
  successSources?: string;
  setSuccessSources?: (value: string) => void;
  realizationType?: string;
  setRealizationType?: (value: string) => void;
  realizationObstacles?: string;
  setRealizationObstacles?: (value: string) => void;
  recommendations?: string;
  setRecommendations?: (value: string) => void;
  
  // Generator Code fields
  generatorFormula?: string;
  setGeneratorFormula?: (value: string) => void;
  energySources?: string;
  setEnergySources?: (value: string) => void;
  energyDrains?: string;
  setEnergyDrains?: (value: string) => void;
  flowSigns?: string;
  setFlowSigns?: (value: string) => void;
  burnoutSigns?: string;
  setBurnoutSigns?: (value: string) => void;
  generatorRecommendation?: string;
  setGeneratorRecommendation?: (value: string) => void;
  
  // Mission Code fields
  missionEssence?: string;
  setMissionEssence?: (value: string) => void;
  missionRealizationFactors?: string;
  setMissionRealizationFactors?: (value: string) => void;
  missionChallenges?: string;
  setMissionChallenges?: (value: string) => void;
  missionObstacles?: string;
  setMissionObstacles?: (value: string) => void;
  mainTransformation?: string;
  setMainTransformation?: (value: string) => void;
}

export const ArchetypeForm: React.FC<ArchetypeFormProps> = ({
  loading,
  archetype,
  onChange,
  selectedCode,
  setSelectedCode,
  selectedValue,
  setSelectedValue,
  onSave,
  // General fields
  title: propTitle,
  setTitle,
  description: propDescription,
  setDescription,
  maleImageUrl: propMaleImageUrl,
  setMaleImageUrl,
  femaleImageUrl: propFemaleImageUrl,
  setFemaleImageUrl,
  // Personality Code fields
  resourceManifestation: propResourceManifestation,
  setResourceManifestation,
  distortedManifestation: propDistortedManifestation,
  setDistortedManifestation,
  developmentTask: propDevelopmentTask,
  setDevelopmentTask,
  resourceQualities: propResourceQualities,
  setResourceQualities,
  keyDistortions: propKeyDistortions,
  setKeyDistortions,
  // Connector Code fields
  keyTask: propKeyTask,
  setKeyTask,
  workingAspects: propWorkingAspects,
  setWorkingAspects,
  nonWorkingAspects: propNonWorkingAspects,
  setNonWorkingAspects,
  worldContactBasis: propWorldContactBasis,
  setWorldContactBasis,
  // Realization Code fields
  formula: propFormula,
  setFormula,
  potentialRealizationWays: propPotentialRealizationWays,
  setPotentialRealizationWays,
  successSources: propSuccessSources,
  setSuccessSources,
  realizationType: propRealizationType,
  setRealizationType,
  realizationObstacles: propRealizationObstacles,
  setRealizationObstacles,
  recommendations: propRecommendations,
  setRecommendations,
  // Generator Code fields
  generatorFormula: propGeneratorFormula,
  setGeneratorFormula,
  energySources: propEnergySources,
  setEnergySources,
  energyDrains: propEnergyDrains,
  setEnergyDrains,
  flowSigns: propFlowSigns,
  setFlowSigns,
  burnoutSigns: propBurnoutSigns,
  setBurnoutSigns,
  generatorRecommendation: propGeneratorRecommendation,
  setGeneratorRecommendation,
  // Mission Code fields
  missionEssence: propMissionEssence,
  setMissionEssence,
  missionRealizationFactors: propMissionRealizationFactors,
  setMissionRealizationFactors,
  missionChallenges: propMissionChallenges,
  setMissionChallenges,
  missionObstacles: propMissionObstacles,
  setMissionObstacles,
  mainTransformation: propMainTransformation,
  setMainTransformation,
}) => {
  const [localTitle, setLocalTitle] = useState(propTitle || archetype?.title || '');
  const [localDescription, setLocalDescription] = useState(propDescription || archetype?.description || '');
  const [code, setCode] = useState<NumerologyCodeType>(normalizeCodeType(selectedCode || archetype?.code || 'all'));
  const [value, setValue] = useState(selectedValue?.toString() || archetype?.value?.toString() || '');
  const [localResourceManifestation, setLocalResourceManifestation] = useState(propResourceManifestation || archetype?.resourceManifestation || '');
  const [localDistortedManifestation, setLocalDistortedManifestation] = useState(propDistortedManifestation || archetype?.distortedManifestation || '');
  const [localDevelopmentTask, setLocalDevelopmentTask] = useState(propDevelopmentTask || archetype?.developmentTask || '');
  const [localKeyTask, setLocalKeyTask] = useState(propKeyTask || archetype?.keyTask || '');
  const [localWorldContactBasis, setLocalWorldContactBasis] = useState(propWorldContactBasis || archetype?.worldContactBasis || '');
  const [localFormula, setLocalFormula] = useState(propFormula || archetype?.formula || '');
  const [localRealizationType, setLocalRealizationType] = useState(propRealizationType || archetype?.realizationType || '');
  const [localGeneratorFormula, setLocalGeneratorFormula] = useState(propGeneratorFormula || archetype?.generatorFormula || '');
  const [localGeneratorRecommendation, setLocalGeneratorRecommendation] = useState(propGeneratorRecommendation || archetype?.generatorRecommendation || '');
  const [localMissionEssence, setLocalMissionEssence] = useState(propMissionEssence || archetype?.missionEssence || '');
  const [localMainTransformation, setLocalMainTransformation] = useState(propMainTransformation || archetype?.mainTransformation || '');
  const [localMissionChallenges, setLocalMissionChallenges] = useState(propMissionChallenges || archetype?.missionChallenges || '');

  // Handle arrays or string inputs for array fields
  const parseStringOrArray = (value: string | string[] | undefined): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value.split('\n').filter(line => line.trim() !== '');
    return [];
  };

  const [resourceQualitiesArray, setResourceQualitiesArray] = useState<string[]>(
    parseStringOrArray(archetype?.resourceQualities || propResourceQualities)
  );
  const [keyDistortionsArray, setKeyDistortionsArray] = useState<string[]>(
    parseStringOrArray(archetype?.keyDistortions || propKeyDistortions)
  );
  const [workingAspectsArray, setWorkingAspectsArray] = useState<string[]>(
    parseStringOrArray(archetype?.workingAspects || propWorkingAspects)
  );
  const [nonWorkingAspectsArray, setNonWorkingAspectsArray] = useState<string[]>(
    parseStringOrArray(archetype?.nonWorkingAspects || propNonWorkingAspects)
  );
  const [potentialRealizationWaysArray, setPotentialRealizationWaysArray] = useState<string[]>(
    parseStringOrArray(archetype?.potentialRealizationWays || propPotentialRealizationWays)
  );
  const [successSourcesArray, setSuccessSourcesArray] = useState<string[]>(
    parseStringOrArray(archetype?.successSources || propSuccessSources)
  );
  const [realizationObstaclesArray, setRealizationObstaclesArray] = useState<string[]>(
    parseStringOrArray(archetype?.realizationObstacles || propRealizationObstacles)
  );
  const [recommendationsArray, setRecommendationsArray] = useState<string[]>(
    parseStringOrArray(archetype?.recommendations || propRecommendations)
  );
  const [energySourcesArray, setEnergySourcesArray] = useState<string[]>(
    parseStringOrArray(archetype?.energySources || propEnergySources)
  );
  const [energyDrainsArray, setEnergyDrainsArray] = useState<string[]>(
    parseStringOrArray(archetype?.energyDrains || propEnergyDrains)
  );
  const [flowSignsArray, setFlowSignsArray] = useState<string[]>(
    parseStringOrArray(archetype?.flowSigns || propFlowSigns)
  );
  const [burnoutSignsArray, setBurnoutSignsArray] = useState<string[]>(
    parseStringOrArray(archetype?.burnoutSigns || propBurnoutSigns)
  );
  const [missionRealizationFactorsArray, setMissionRealizationFactorsArray] = useState<string[]>(
    parseStringOrArray(archetype?.missionRealizationFactors || propMissionRealizationFactors)
  );
  const [missionObstaclesArray, setMissionObstaclesArray] = useState<string[]>(
    parseStringOrArray(archetype?.missionObstacles || propMissionObstacles)
  );

  useEffect(() => {
    if (archetype) {
      setLocalTitle(archetype.title || '');
      setLocalDescription(archetype.description || '');
      setCode(archetype.code || 'all');
      setValue(archetype.value?.toString() || '');
      setLocalResourceManifestation(archetype.resourceManifestation || '');
      setLocalDistortedManifestation(archetype.distortedManifestation || '');
      setLocalDevelopmentTask(archetype.developmentTask || '');
      setLocalKeyTask(archetype.keyTask || '');
      setLocalWorldContactBasis(archetype.worldContactBasis || '');
      setLocalFormula(archetype.formula || '');
      setLocalRealizationType(archetype.realizationType || '');
      setLocalGeneratorFormula(archetype.generatorFormula || '');
      setLocalGeneratorRecommendation(archetype.generatorRecommendation || '');
      setLocalMissionEssence(archetype.missionEssence || '');
      setLocalMainTransformation(archetype.mainTransformation || '');
      setLocalMissionChallenges(archetype.missionChallenges || '');

      setResourceQualitiesArray(archetype.resourceQualities || []);
      setKeyDistortionsArray(archetype.keyDistortions || []);
      setWorkingAspectsArray(archetype.workingAspects || []);
      setNonWorkingAspectsArray(archetype.nonWorkingAspects || []);
      setPotentialRealizationWaysArray(archetype.potentialRealizationWays || []);
      setSuccessSourcesArray(archetype.successSources || []);
      setRealizationObstaclesArray(archetype.realizationObstacles || []);
      setRecommendationsArray(archetype.recommendations || []);
      setEnergySourcesArray(archetype.energySources || []);
      setEnergyDrainsArray(archetype.energyDrains || []);
      setFlowSignsArray(archetype.flowSigns || []);
      setBurnoutSignsArray(archetype.burnoutSigns || []);
      setMissionRealizationFactorsArray(archetype.missionRealizationFactors || []);
      setMissionObstaclesArray(archetype.missionObstacles || []);
    }
  }, [archetype]);

  // Update local state when props change
  useEffect(() => {
    if (propTitle !== undefined) setLocalTitle(propTitle);
    if (propDescription !== undefined) setLocalDescription(propDescription);
    if (selectedCode !== undefined) setCode(normalizeCodeType(selectedCode));
    if (selectedValue !== undefined) setValue(selectedValue.toString());
    if (propResourceManifestation !== undefined) setLocalResourceManifestation(propResourceManifestation);
    if (propDistortedManifestation !== undefined) setLocalDistortedManifestation(propDistortedManifestation);
    if (propDevelopmentTask !== undefined) setLocalDevelopmentTask(propDevelopmentTask);
    if (propKeyTask !== undefined) setLocalKeyTask(propKeyTask);
    if (propWorldContactBasis !== undefined) setLocalWorldContactBasis(propWorldContactBasis);
    if (propFormula !== undefined) setLocalFormula(propFormula);
    if (propRealizationType !== undefined) setLocalRealizationType(propRealizationType);
    if (propGeneratorFormula !== undefined) setLocalGeneratorFormula(propGeneratorFormula);
    if (propGeneratorRecommendation !== undefined) setLocalGeneratorRecommendation(propGeneratorRecommendation);
    if (propMissionEssence !== undefined) setLocalMissionEssence(propMissionEssence);
    if (propMainTransformation !== undefined) setLocalMainTransformation(propMainTransformation);
    if (propMissionChallenges !== undefined) setLocalMissionChallenges(propMissionChallenges);
  }, [
    propTitle, propDescription, selectedCode, selectedValue, 
    propResourceManifestation, propDistortedManifestation, propDevelopmentTask,
    propKeyTask, propWorldContactBasis, propFormula, propRealizationType,
    propGeneratorFormula, propGeneratorRecommendation, propMissionEssence,
    propMainTransformation, propMissionChallenges
  ]);

  const handleStringArrayChange = (setter: (value: string[]) => void, index: number, value: string, array: string[]) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };

  const handleAddStringToArray = (setter: (value: string[]) => void, array: string[]) => {
    setter([...array, '']);
  };

  const handleRemoveStringFromArray = (setter: (value: string[]) => void, index: number, array: string[]) => {
    const newArray = [...array];
    newArray.splice(index, 1);
    setter(newArray);
  };

  const handleSave = () => {
    if (!localTitle || !code || !value) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля (Название, Код, Значение).",
        variant: "destructive"
      });
      return;
    }

    // If we're using direct state setters (from AdminPage)
    if (setTitle && setDescription && setSelectedCode && setSelectedValue && onSave) {
      setTitle(localTitle);
      setDescription(localDescription);
      setSelectedCode(normalizeCodeType(code) as NumerologyCodeType);
      setSelectedValue(parseInt(value, 10));
      onSave();
      return;
    }

    // Original update logic for onChange
    if (onChange) {
      const updatedArchetype: ArchetypeDescription = {
        code,
        value: parseInt(value, 10),
        title: localTitle,
        description: localDescription,
        resourceManifestation: localResourceManifestation,
        distortedManifestation: localDistortedManifestation,
        developmentTask: localDevelopmentTask,
        keyTask: localKeyTask,
        worldContactBasis: localWorldContactBasis,
        formula: localFormula,
        realizationType: localRealizationType,
        generatorFormula: localGeneratorFormula,
        generatorRecommendation: localGeneratorRecommendation,
        missionEssence: localMissionEssence,
        mainTransformation: localMainTransformation,
        missionChallenges: localMissionChallenges,
        resourceQualities: resourceQualitiesArray,
        keyDistortions: keyDistortionsArray,
        workingAspects: workingAspectsArray,
        nonWorkingAspects: nonWorkingAspectsArray,
        potentialRealizationWays: potentialRealizationWaysArray,
        successSources: successSourcesArray,
        realizationObstacles: realizationObstaclesArray,
        recommendations: recommendationsArray,
        energySources: energySourcesArray,
        energyDrains: energyDrainsArray,
        flowSigns: flowSignsArray,
        burnoutSigns: burnoutSignsArray,
        missionRealizationFactors: missionRealizationFactorsArray,
        missionObstacles: missionObstaclesArray,
      };
      onChange(updatedArchetype);
      toast({
        title: "Успешно",
        description: "Архетип сохранен.",
      });
    }
  };

  // Helper function to normalize code types
  function normalizeCodeType(code: NumerologyCodeType | string): NumerologyCodeType {
    // Map old format to new format
    const codeMap: Record<string, NumerologyCodeType> = {
      'personalityCode': 'personality',
      'connectorCode': 'connector',
      'realizationCode': 'realization',
      'generatorCode': 'generator',
      'missionCode': 'mission'
    };
    
    return (codeMap[code] as NumerologyCodeType) || code as NumerologyCodeType;
  }

  const tabLabels: Record<string, string> = {
    'personality': 'Личность',
    'connector': 'Коннектор',
    'realization': 'Реализация',
    'generator': 'Генератор',
    'mission': 'Миссия',
    'all': 'Общее',
    'target': 'Цель'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Редактировать Архетип</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input
              type="text"
              id="title"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Код</Label>
            <select
              id="code"
              className="w-full border rounded-md py-2 px-3"
              value={code}
              onChange={(e) => setCode(e.target.value as NumerologyCodeType)}
              disabled={loading}
            >
              <option value="personality">Личность</option>
              <option value="connector">Коннектор</option>
              <option value="realization">Реализация</option>
              <option value="generator">Генератор</option>
              <option value="mission">Миссия</option>
              <option value="target">Цель</option>
              <option value="all">Общее</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Значение</Label>
            <Input
              type="number"
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            {Object.entries(tabLabels).map(([key, label]) => (
              <TabsTrigger key={key} value={key as NumerologyCodeType}>{label}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="personality" className="space-y-4">
            <h3 className="text-lg font-semibold">Код Личности</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resourceManifestation">Ресурсное проявление</Label>
                <Textarea
                  id="resourceManifestation"
                  value={localResourceManifestation}
                  onChange={(e) => setLocalResourceManifestation(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distortedManifestation">Искаженное проявление</Label>
                <Textarea
                  id="distortedManifestation"
                  value={localDistortedManifestation}
                  onChange={(e) => setLocalDistortedManifestation(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="developmentTask">Задача развития</Label>
              <Textarea
                id="developmentTask"
                value={localDevelopmentTask}
                onChange={(e) => setLocalDevelopmentTask(e.target.value)}
                disabled={loading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="connector" className="space-y-4">
            <h3 className="text-lg font-semibold">Код Коннектора</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyTask">Ключевая задача</Label>
                <Textarea
                  id="keyTask"
                  value={localKeyTask}
                  onChange={(e) => setLocalKeyTask(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="worldContactBasis">Контакт с миром должен строиться на</Label>
                <Textarea
                  id="worldContactBasis"
                  value={localWorldContactBasis}
                  onChange={(e) => setLocalWorldContactBasis(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="realization" className="space-y-4">
            <h3 className="text-lg font-semibold">Код Реализации</h3>
            <div className="space-y-2">
              <Label htmlFor="formula">Формула</Label>
              <Textarea
                id="formula"
                value={localFormula}
                onChange={(e) => setLocalFormula(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="realizationType">Тип реализации</Label>
              <Textarea
                id="realizationType"
                value={localRealizationType}
                onChange={(e) => setLocalRealizationType(e.target.value)}
                disabled={loading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="generator" className="space-y-4">
            <h3 className="text-lg font-semibold">Код Генератора</h3>
            <div className="space-y-2">
              <Label htmlFor="generatorFormula">Формула</Label>
              <Textarea
                id="generatorFormula"
                value={localGeneratorFormula}
                onChange={(e) => setLocalGeneratorFormula(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="generatorRecommendation">Рекомендация</Label>
              <Textarea
                id="generatorRecommendation"
                value={localGeneratorRecommendation}
                onChange={(e) => setLocalGeneratorRecommendation(e.target.value)}
                disabled={loading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="mission" className="space-y-4">
            <h3 className="text-lg font-semibold">Код Миссии</h3>
            <div className="space-y-2">
              <Label htmlFor="missionEssence">Суть миссии</Label>
              <Textarea
                id="missionEssence"
                value={localMissionEssence}
                onChange={(e) => setLocalMissionEssence(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainTransformation">Главная трансформация</Label>
              <Textarea
                id="mainTransformation"
                value={localMainTransformation}
                onChange={(e) => setLocalMainTransformation(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="missionChallenges">Испытания миссии</Label>
              <Textarea
                id="missionChallenges"
                value={localMissionChallenges}
                onChange={(e) => setLocalMissionChallenges(e.target.value)}
                disabled={loading}
              />
            </div>
          </TabsContent>

          <TabsContent value="target" className="space-y-4">
            <h3 className="text-lg font-semibold">Целевой расчет</h3>
            <p>Специфические поля для целевого расчета отсутствуют.</p>
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <h3 className="text-lg font-semibold">Общие параметры</h3>
            <SectionArrays 
              title="Ресурсные качества"
              values={resourceQualitiesArray}
              setValues={setResourceQualitiesArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Ключевые искажения"
              values={keyDistortionsArray}
              setValues={setKeyDistortionsArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Что работает (в ресурсе)"
              values={workingAspectsArray}
              setValues={setWorkingAspectsArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Что не работает (искажения)"
              values={nonWorkingAspectsArray}
              setValues={setNonWorkingAspectsArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Как реализуется потенциал"
              values={potentialRealizationWaysArray}
              setValues={setPotentialRealizationWaysArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Источники успеха"
              values={successSourcesArray}
              setValues={setSuccessSourcesArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Искажения (что мешает реализовываться)"
              values={realizationObstaclesArray}
              setValues={setRealizationObstaclesArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Рекомендации"
              values={recommendationsArray}
              setValues={setRecommendationsArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Что дает энергию"
              values={energySourcesArray}
              setValues={setEnergySourcesArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Что забирает энергию"
              values={energyDrainsArray}
              setValues={setEnergyDrainsArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Признаки, что человек в потоке"
              values={flowSignsArray}
              setValues={setFlowSignsArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Признаки, что человек выгорел"
              values={burnoutSignsArray}
              setValues={setBurnoutSignsArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Что реализует миссию"
              values={missionRealizationFactorsArray}
              setValues={setMissionRealizationFactorsArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
            <SectionArrays 
              title="Что мешает реализовываться"
              values={missionObstaclesArray}
              setValues={setMissionObstaclesArray}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
              disabled={loading}
            />
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave} disabled={loading}>Сохранить</Button>
      </CardContent>
    </Card>
  );
};

interface SectionArraysProps {
  title: string;
  values: string[];
  setValues: (value: string[]) => void;
  handleStringArrayChange: (setter: (value: string[]) => void, index: number, value: string, array: string[]) => void;
  handleAddStringToArray: (setter: (value: string[]) => void, array: string[]) => void;
  handleRemoveStringFromArray: (setter: (value: string[]) => void, index: number, array: string[]) => void;
  disabled?: boolean;
}

const SectionArrays: React.FC<SectionArraysProps> = ({
  title,
  values,
  setValues,
  handleStringArrayChange,
  handleAddStringToArray,
  handleRemoveStringFromArray,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label>{title}</Label>
      {values.map((value, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            type="text"
            value={value}
            onChange={(e) => handleStringArrayChange(setValues, index, e.target.value, values)}
            className="flex-grow"
            disabled={disabled}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => handleRemoveStringFromArray(setValues, index, values)}
            disabled={disabled}
          >
            Удалить
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() => handleAddStringToArray(setValues, values)}
        disabled={disabled}
      >
        Добавить {title}
      </Button>
    </div>
  );
};
