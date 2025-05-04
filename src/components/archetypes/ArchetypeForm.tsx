import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';
import { useToast } from "@/hooks/use-toast"

interface ArchetypeFormProps {
  archetype: ArchetypeDescription | undefined;
  onChange: (updatedArchetype: ArchetypeDescription) => void;
}

export const ArchetypeForm: React.FC<ArchetypeFormProps> = ({
  archetype,
  onChange,
}) => {
  const [title, setTitle] = useState(archetype?.title || '');
  const [description, setDescription] = useState(archetype?.description || '');
  const [code, setCode] = useState<NumerologyCodeType>(archetype?.code || 'all');
  const [value, setValue] = useState(archetype?.value?.toString() || '');
  const [resourceManifestation, setResourceManifestation] = useState(archetype?.resourceManifestation || '');
  const [distortedManifestation, setDistortedManifestation] = useState(archetype?.distortedManifestation || '');
  const [developmentTask, setDevelopmentTask] = useState(archetype?.developmentTask || '');
  const [keyTask, setKeyTask] = useState(archetype?.keyTask || '');
  const [worldContactBasis, setWorldContactBasis] = useState(archetype?.worldContactBasis || '');
  const [formula, setFormula] = useState(archetype?.formula || '');
  const [realizationType, setRealizationType] = useState(archetype?.realizationType || '');
  const [generatorFormula, setGeneratorFormula] = useState(archetype?.generatorFormula || '');
  const [generatorRecommendation, setGeneratorRecommendation] = useState(archetype?.generatorRecommendation || '');
  const [missionEssence, setMissionEssence] = useState(archetype?.missionEssence || '');
  const [mainTransformation, setMainTransformation] = useState(archetype?.mainTransformation || '');
  const [missionChallenges, setMissionChallenges] = useState(archetype?.missionChallenges || '');

  const [resourceQualities, setResourceQualities] = useState<string[]>(archetype?.resourceQualities || []);
  const [keyDistortions, setKeyDistortions] = useState<string[]>(archetype?.keyDistortions || []);
  const [workingAspects, setWorkingAspects] = useState<string[]>(archetype?.workingAspects || []);
  const [nonWorkingAspects, setNonWorkingAspects] = useState<string[]>(archetype?.nonWorkingAspects || []);
  const [potentialRealizationWays, setPotentialRealizationWays] = useState<string[]>(archetype?.potentialRealizationWays || []);
  const [successSources, setSuccessSources] = useState<string[]>(archetype?.successSources || []);
  const [realizationObstacles, setRealizationObstacles] = useState<string[]>(archetype?.realizationObstacles || []);
  const [recommendations, setRecommendations] = useState<string[]>(archetype?.recommendations || []);
  const [energySources, setEnergySources] = useState<string[]>(archetype?.energySources || []);
  const [energyDrains, setEnergyDrains] = useState<string[]>(archetype?.energyDrains || []);
  const [flowSigns, setFlowSigns] = useState<string[]>(archetype?.flowSigns || []);
  const [burnoutSigns, setBurnoutSigns] = useState<string[]>(archetype?.burnoutSigns || []);
  const [missionRealizationFactors, setMissionRealizationFactors] = useState<string[]>(archetype?.missionRealizationFactors || []);
  const [missionObstacles, setMissionObstacles] = useState<string[]>(archetype?.missionObstacles || []);

  const { toast } = useToast()

  useEffect(() => {
    if (archetype) {
      setTitle(archetype.title || '');
      setDescription(archetype.description || '');
      setCode(archetype.code || 'all');
      setValue(archetype.value?.toString() || '');
      setResourceManifestation(archetype.resourceManifestation || '');
      setDistortedManifestation(archetype.distortedManifestation || '');
      setDevelopmentTask(archetype.developmentTask || '');
      setKeyTask(archetype.keyTask || '');
      setWorldContactBasis(archetype.worldContactBasis || '');
      setFormula(archetype.formula || '');
      setRealizationType(archetype.realizationType || '');
      setGeneratorFormula(archetype.generatorFormula || '');
      setGeneratorRecommendation(archetype.generatorRecommendation || '');
      setMissionEssence(archetype.missionEssence || '');
      setMainTransformation(archetype.mainTransformation || '');
      setMissionChallenges(archetype.missionChallenges || '');

      setResourceQualities(archetype.resourceQualities || []);
      setKeyDistortions(archetype.keyDistortions || []);
      setWorkingAspects(archetype.workingAspects || []);
      setNonWorkingAspects(archetype.nonWorkingAspects || []);
      setPotentialRealizationWays(archetype.potentialRealizationWays || []);
      setSuccessSources(archetype.successSources || []);
      setRealizationObstacles(archetype.realizationObstacles || []);
      setRecommendations(archetype.recommendations || []);
      setEnergySources(archetype.energySources || []);
      setEnergyDrains(archetype.energyDrains || []);
      setFlowSigns(archetype.flowSigns || []);
      setBurnoutSigns(archetype.burnoutSigns || []);
      setMissionRealizationFactors(archetype.missionRealizationFactors || []);
      setMissionObstacles(archetype.missionObstacles || []);
    }
  }, [archetype]);

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
    if (!title || !code || !value) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля (Название, Код, Значение).",
        variant: "destructive",
      });
      return;
    }

    const updatedArchetype: ArchetypeDescription = {
      code,
      value: parseInt(value, 10),
      title,
      description,
      resourceManifestation,
      distortedManifestation,
      developmentTask,
      keyTask,
      worldContactBasis,
      formula,
      realizationType,
      generatorFormula,
      generatorRecommendation,
      missionEssence,
      mainTransformation,
      missionChallenges,
      resourceQualities,
      keyDistortions,
      workingAspects,
      nonWorkingAspects,
      potentialRealizationWays,
      successSources,
      realizationObstacles,
      recommendations,
      energySources,
      energyDrains,
      flowSigns,
      burnoutSigns,
      missionRealizationFactors,
      missionObstacles,
    };
    onChange(updatedArchetype);
    toast({
      title: "Успешно",
      description: "Архетип сохранен.",
    });
  };

  const tabLabels: Record<NumerologyCodeType, string> = {
    personality: 'Личность',
    connector: 'Коннектор',
    realization: 'Реализация',
    generator: 'Генератор',
    mission: 'Миссия',
    all: 'Общее',
    target: 'Цель'
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Код</Label>
            <select
              id="code"
              className="w-full border rounded-md py-2 px-3"
              value={code}
              onChange={(e) => setCode(e.target.value as NumerologyCodeType)}
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
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
                  value={resourceManifestation}
                  onChange={(e) => setResourceManifestation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distortedManifestation">Искаженное проявление</Label>
                <Textarea
                  id="distortedManifestation"
                  value={distortedManifestation}
                  onChange={(e) => setDistortedManifestation(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="developmentTask">Задача развития</Label>
              <Textarea
                id="developmentTask"
                value={developmentTask}
                onChange={(e) => setDevelopmentTask(e.target.value)}
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
                  value={keyTask}
                  onChange={(e) => setKeyTask(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="worldContactBasis">Контакт с миром должен строиться на</Label>
                <Textarea
                  id="worldContactBasis"
                  value={worldContactBasis}
                  onChange={(e) => setWorldContactBasis(e.target.value)}
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
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="realizationType">Тип реализации</Label>
              <Textarea
                id="realizationType"
                value={realizationType}
                onChange={(e) => setRealizationType(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="generator" className="space-y-4">
            <h3 className="text-lg font-semibold">Код Генератора</h3>
            <div className="space-y-2">
              <Label htmlFor="generatorFormula">Формула</Label>
              <Textarea
                id="generatorFormula"
                value={generatorFormula}
                onChange={(e) => setGeneratorFormula(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="generatorRecommendation">Рекомендация</Label>
              <Textarea
                id="generatorRecommendation"
                value={generatorRecommendation}
                onChange={(e) => setGeneratorRecommendation(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="mission" className="space-y-4">
            <h3 className="text-lg font-semibold">Код Миссии</h3>
            <div className="space-y-2">
              <Label htmlFor="missionEssence">Суть миссии</Label>
              <Textarea
                id="missionEssence"
                value={missionEssence}
                onChange={(e) => setMissionEssence(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainTransformation">Главная трансформация</Label>
              <Textarea
                id="mainTransformation"
                value={mainTransformation}
                onChange={(e) => setMainTransformation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="missionChallenges">Испытания миссии</Label>
              <Textarea
                id="missionChallenges"
                value={missionChallenges}
                onChange={(e) => setMissionChallenges(e.target.value)}
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
              values={resourceQualities}
              setValues={setResourceQualities}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Ключевые искажения"
              values={keyDistortions}
              setValues={setKeyDistortions}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Что работает (в ресурсе)"
              values={workingAspects}
              setValues={setWorkingAspects}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Что не работает (искажения)"
              values={nonWorkingAspects}
              setValues={setNonWorkingAspects}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Как реализуется потенциал"
              values={potentialRealizationWays}
              setValues={setPotentialRealizationWays}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Источники успеха"
              values={successSources}
              setValues={setSuccessSources}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Искажения (что мешает реализовываться)"
              values={realizationObstacles}
              setValues={setRealizationObstacles}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Рекомендации"
              values={recommendations}
              setValues={setRecommendations}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Что дает энергию"
              values={energySources}
              setValues={setEnergySources}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Что забирает энергию"
              values={energyDrains}
              setValues={setEnergyDrains}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Признаки, что человек в потоке"
              values={flowSigns}
              setValues={setFlowSigns}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Признаки, что человек выгорел"
              values={burnoutSigns}
              setValues={setBurnoutSigns}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Что реализует миссию"
              values={missionRealizationFactors}
              setValues={setMissionRealizationFactors}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
            <SectionArrays 
              title="Что мешает реализовываться"
              values={missionObstacles}
              setValues={setMissionObstacles}
              handleStringArrayChange={handleStringArrayChange}
              handleAddStringToArray={handleAddStringToArray}
              handleRemoveStringFromArray={handleRemoveStringFromArray}
            />
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave}>Сохранить</Button>
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
}

const SectionArrays: React.FC<SectionArraysProps> = ({
  title,
  values,
  setValues,
  handleStringArrayChange,
  handleAddStringToArray,
  handleRemoveStringFromArray,
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
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => handleRemoveStringFromArray(setValues, index, values)}
          >
            Удалить
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() => handleAddStringToArray(setValues, values)}
      >
        Добавить {title}
      </Button>
    </div>
  );
};
