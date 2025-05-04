
import { useState, useEffect } from "react";
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";
import { addArchetypeDescription, getAllArchetypeDescriptions, getArchetypeDescription, loadArchetypesFromDb } from "@/utils/archetypeDescriptions";
import { toast } from "sonner";

export const useArchetypeManagement = () => {
  const [descriptions, setDescriptions] = useState<ArchetypeDescription[]>([]);
  const [selectedCode, setSelectedCode] = useState<NumerologyCodeType>('personality');
  const [selectedValue, setSelectedValue] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
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
    const loadDescriptions = async () => {
      setLoading(true);
      try {
        await loadArchetypesFromDb(true);
        const allDescriptions = getAllArchetypeDescriptions();
        setDescriptions(allDescriptions);
      } catch (error) {
        console.error("Error loading descriptions:", error);
        toast.error("Не удалось загрузить архетипы");
      } finally {
        setLoading(false);
      }
    };
    
    loadDescriptions();
  }, []);

  // Load specific description when code or value changes
  useEffect(() => {
    const loadArchetype = async () => {
      setLoading(true);
      try {
        const desc = await getArchetypeDescription(selectedCode, selectedValue);
        
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
      } catch (error) {
        console.error("Error loading archetype:", error);
        clearAllFields();
        toast.error(`Ошибка загрузки архетипа: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadArchetype();
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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const parseTextToArray = (text: string) => {
        return text
          .split('\n')
          .map(str => str.trim())
          .filter(str => str !== "");
      };

      const archetypeDescription: ArchetypeDescription = {
        code: selectedCode,
        value: selectedValue,
        title: title || `Архетип ${selectedValue}`,
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

      const success = await addArchetypeDescription(archetypeDescription);
      
      if (success) {
        // Reload descriptions to update the UI
        const updatedDescriptions = getAllArchetypeDescriptions();
        setDescriptions(updatedDescriptions);
        toast.success("Архетип успешно сохранен");
      }
    } catch (error) {
      console.error("Error saving archetype:", error);
      toast.error("Ошибка при сохранении архетипа: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchetypeSelect = (code: NumerologyCodeType, value: number) => {
    setSelectedCode(code);
    setSelectedValue(value);
  };

  return {
    // State
    descriptions,
    selectedCode,
    selectedValue,
    loading,
    isSaving,
    
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
    
    // Functions
    handleSave,
    handleArchetypeSelect,
    setSelectedCode,
    setSelectedValue,
  };
};
