
import { useState } from 'react';
import { NumerologyCodeType } from '@/types/numerology';

export const useArchetypeFormState = () => {
  // State для выбора архетипа
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

  /**
   * Очищает все поля формы
   */
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

  return {
    // State
    selectedCode,
    setSelectedCode,
    selectedValue,
    setSelectedValue,
    loading,
    setLoading,
    isSaving,
    setIsSaving,
    
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
    
    // Methods
    clearAllFields
  };
};
