
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";
import { addArchetypeDescription, getAllArchetypeDescriptions, getArchetypeDescription } from "@/utils/archetypeDescriptions";
import { toast } from "sonner";
import { ArchetypeForm } from "@/components/archetypes/ArchetypeForm";
import { ArchetypesList } from "@/components/archetypes/ArchetypesList";

const ArchetypesAdminPage = () => {
  const [descriptions, setDescriptions] = useState<ArchetypeDescription[]>([]);
  const [selectedCode, setSelectedCode] = useState<NumerologyCodeType>('personality');
  const [selectedValue, setSelectedValue] = useState<number>(1);
  
  // General fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maleImageUrl, setMaleImageUrl] = useState<string>("");
  const [femaleImageUrl, setFemaleImageUrl] = useState<string>("");
  
  // Personality Code fields
  const [resourceManifestation, setResourceManifestation] = useState("");
  const [distortedManifestation, setDistortedManifestation] = useState("");
  const [developmentTask, setDevelopmentTask] = useState("");
  const [resourceQualities, setResourceQualities] = useState("");
  const [keyDistortions, setKeyDistortions] = useState("");
  
  // Connector Code fields
  const [keyTask, setKeyTask] = useState("");
  const [workingAspects, setWorkingAspects] = useState("");
  const [nonWorkingAspects, setNonWorkingAspects] = useState("");
  const [worldContactBasis, setWorldContactBasis] = useState("");
  
  // Realization Code fields
  const [formula, setFormula] = useState("");
  const [potentialRealizationWays, setPotentialRealizationWays] = useState("");
  const [successSources, setSuccessSources] = useState("");
  const [realizationType, setRealizationType] = useState("");
  const [realizationObstacles, setRealizationObstacles] = useState("");
  const [recommendations, setRecommendations] = useState("");
  
  // Generator Code fields
  const [generatorFormula, setGeneratorFormula] = useState("");
  const [energySources, setEnergySources] = useState("");
  const [energyDrains, setEnergyDrains] = useState("");
  const [flowSigns, setFlowSigns] = useState("");
  const [burnoutSigns, setBurnoutSigns] = useState("");
  const [generatorRecommendation, setGeneratorRecommendation] = useState("");
  
  // Mission Code fields
  const [missionEssence, setMissionEssence] = useState("");
  const [missionRealizationFactors, setMissionRealizationFactors] = useState("");
  const [missionChallenges, setMissionChallenges] = useState("");
  const [missionObstacles, setMissionObstacles] = useState("");
  const [mainTransformation, setMainTransformation] = useState("");

  // Load all descriptions
  useEffect(() => {
    const allDescriptions = getAllArchetypeDescriptions();
    setDescriptions(allDescriptions);
  }, []);

  // Load specific description when code or value changes
  useEffect(() => {
    const desc = getArchetypeDescription(selectedCode, selectedValue);
    
    if (desc) {
      // General
      setTitle(desc.title || "");
      setDescription(desc.description || "");
      setMaleImageUrl(desc.maleImageUrl || "");
      setFemaleImageUrl(desc.femaleImageUrl || "");
      
      // Personality Code
      setResourceManifestation(desc.resourceManifestation || "");
      setDistortedManifestation(desc.distortedManifestation || "");
      setDevelopmentTask(desc.developmentTask || "");
      setResourceQualities(desc.resourceQualities?.join('\n') || "");
      setKeyDistortions(desc.keyDistortions?.join('\n') || "");
      
      // Connector Code
      setKeyTask(desc.keyTask || "");
      setWorkingAspects(desc.workingAspects?.join('\n') || "");
      setNonWorkingAspects(desc.nonWorkingAspects?.join('\n') || "");
      setWorldContactBasis(desc.worldContactBasis || "");
      
      // Realization Code
      setFormula(desc.formula || "");
      setPotentialRealizationWays(desc.potentialRealizationWays?.join('\n') || "");
      setSuccessSources(desc.successSources?.join('\n') || "");
      setRealizationType(desc.realizationType || "");
      setRealizationObstacles(desc.realizationObstacles?.join('\n') || "");
      setRecommendations(desc.recommendations?.join('\n') || "");
      
      // Generator Code
      setGeneratorFormula(desc.generatorFormula || "");
      setEnergySources(desc.energySources?.join('\n') || "");
      setEnergyDrains(desc.energyDrains?.join('\n') || "");
      setFlowSigns(desc.flowSigns?.join('\n') || "");
      setBurnoutSigns(desc.burnoutSigns?.join('\n') || "");
      setGeneratorRecommendation(desc.generatorRecommendation || "");
      
      // Mission Code
      setMissionEssence(desc.missionEssence || "");
      setMissionRealizationFactors(desc.missionRealizationFactors?.join('\n') || "");
      setMissionChallenges(desc.missionChallenges || "");
      setMissionObstacles(desc.missionObstacles?.join('\n') || "");
      setMainTransformation(desc.mainTransformation || "");
    } else {
      // Clear all fields if no description is found
      clearAllFields();
    }
  }, [selectedCode, selectedValue]);
  
  const clearAllFields = () => {
    // General
    setTitle("");
    setDescription("");
    setMaleImageUrl("");
    setFemaleImageUrl("");
    
    // Personality Code
    setResourceManifestation("");
    setDistortedManifestation("");
    setDevelopmentTask("");
    setResourceQualities("");
    setKeyDistortions("");
    
    // Connector Code
    setKeyTask("");
    setWorkingAspects("");
    setNonWorkingAspects("");
    setWorldContactBasis("");
    
    // Realization Code
    setFormula("");
    setPotentialRealizationWays("");
    setSuccessSources("");
    setRealizationType("");
    setRealizationObstacles("");
    setRecommendations("");
    
    // Generator Code
    setGeneratorFormula("");
    setEnergySources("");
    setEnergyDrains("");
    setFlowSigns("");
    setBurnoutSigns("");
    setGeneratorRecommendation("");
    
    // Mission Code
    setMissionEssence("");
    setMissionRealizationFactors("");
    setMissionChallenges("");
    setMissionObstacles("");
    setMainTransformation("");
  };

  const handleSave = () => {
    const parseTextToArray = (text: string) => {
      return text
        .split('\n')
        .map(str => str.trim())
        .filter(str => str !== "");
    };

    const archetypeDescription: ArchetypeDescription = {
      code: selectedCode,
      value: selectedValue,
      title,
      description,
      maleImageUrl,
      femaleImageUrl,
      
      // Personality Code
      resourceManifestation,
      distortedManifestation,
      developmentTask,
      resourceQualities: parseTextToArray(resourceQualities),
      keyDistortions: parseTextToArray(keyDistortions),
      
      // Connector Code
      keyTask,
      workingAspects: parseTextToArray(workingAspects),
      nonWorkingAspects: parseTextToArray(nonWorkingAspects),
      worldContactBasis,
      
      // Realization Code
      formula,
      potentialRealizationWays: parseTextToArray(potentialRealizationWays),
      successSources: parseTextToArray(successSources),
      realizationType,
      realizationObstacles: parseTextToArray(realizationObstacles),
      recommendations: parseTextToArray(recommendations),
      
      // Generator Code
      generatorFormula,
      energySources: parseTextToArray(energySources),
      energyDrains: parseTextToArray(energyDrains),
      flowSigns: parseTextToArray(flowSigns),
      burnoutSigns: parseTextToArray(burnoutSigns),
      generatorRecommendation,
      
      // Mission Code
      missionEssence,
      missionRealizationFactors: parseTextToArray(missionRealizationFactors),
      missionChallenges,
      missionObstacles: parseTextToArray(missionObstacles),
      mainTransformation,
      
      // Backward compatibility
      strengths: parseTextToArray(resourceQualities),
      challenges: parseTextToArray(keyDistortions),
    };

    addArchetypeDescription(archetypeDescription);
    
    toast.success(`Архетип ${selectedCode} со значением ${selectedValue} успешно сохранен`);
    
    // Update the descriptions list
    setDescriptions(getAllArchetypeDescriptions());
  };

  const handleArchetypeSelect = (code: NumerologyCodeType, value: number) => {
    setSelectedCode(code);
    setSelectedValue(value);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Управление архетипами</h1>
        <p className="text-muted-foreground">
          Добавление и редактирование описаний архетипов для каждого кода
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Редактор архетипов</CardTitle>
          </CardHeader>
          <CardContent>
            <ArchetypeForm
              selectedCode={selectedCode}
              setSelectedCode={setSelectedCode}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              onSave={handleSave}
              // General fields
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              maleImageUrl={maleImageUrl}
              setMaleImageUrl={setMaleImageUrl}
              femaleImageUrl={femaleImageUrl}
              setFemaleImageUrl={setFemaleImageUrl}
              // Personality Code fields
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
              // Connector Code fields
              keyTask={keyTask}
              setKeyTask={setKeyTask}
              workingAspects={workingAspects}
              setWorkingAspects={setWorkingAspects}
              nonWorkingAspects={nonWorkingAspects}
              setNonWorkingAspects={setNonWorkingAspects}
              worldContactBasis={worldContactBasis}
              setWorldContactBasis={setWorldContactBasis}
              // Realization Code fields
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
              // Generator Code fields
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
              // Mission Code fields
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
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Существующие архетипы</CardTitle>
          </CardHeader>
          <CardContent>
            <ArchetypesList 
              descriptions={descriptions} 
              onSelect={handleArchetypeSelect}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArchetypesAdminPage;
