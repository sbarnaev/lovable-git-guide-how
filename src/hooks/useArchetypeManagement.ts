
import { useState, useEffect } from 'react';
import { NumerologyCodeType, ArchetypeDescription } from '@/types/numerology';
import { addArchetypeDescription, normalizeCodeType, parseTextToArray } from '@/utils/archetypeDescriptions';
import { toast } from "sonner";
import { useArchetypeFormState } from './archetypes/useArchetypeFormState';
import { useArchetypesData } from './archetypes/useArchetypesData';

export const useArchetypeManagement = () => {
  // Подключаем подхуки
  const formState = useArchetypeFormState();
  const archetypesData = useArchetypesData();
  
  // Получаем состояние и методы из подхуков
  const {
    selectedCode, setSelectedCode,
    selectedValue, setSelectedValue,
    loading, setLoading,
    isSaving, setIsSaving,
    clearAllFields,
    ...otherFormState
  } = formState;
  
  const {
    descriptions,
    loadArchetype,
    refreshArchetypes
  } = archetypesData;

  // Load specific description when code or value changes
  useEffect(() => {
    const fetchArchetype = async () => {
      setLoading(true);
      try {
        const desc = await loadArchetype(selectedCode, selectedValue);
        
        if (desc) {
          // General
          formState.setTitle(desc.title || "");
          formState.setDescription(desc.description || "");
          formState.setMaleImageUrl(desc.maleImageUrl || "");
          formState.setFemaleImageUrl(desc.femaleImageUrl || "");
          
          // Personality Code
          formState.setResourceManifestation(desc.resourceManifestation || "");
          formState.setDistortedManifestation(desc.distortedManifestation || "");
          formState.setDevelopmentTask(desc.developmentTask || "");
          formState.setResourceQualities(desc.resourceQualities?.join('\n') || "");
          formState.setKeyDistortions(desc.keyDistortions?.join('\n') || "");
          
          // Connector Code
          formState.setKeyTask(desc.keyTask || "");
          formState.setWorkingAspects(desc.workingAspects?.join('\n') || "");
          formState.setNonWorkingAspects(desc.nonWorkingAspects?.join('\n') || "");
          formState.setWorldContactBasis(desc.worldContactBasis || "");
          
          // Realization Code
          formState.setFormula(desc.formula || "");
          formState.setPotentialRealizationWays(desc.potentialRealizationWays?.join('\n') || "");
          formState.setSuccessSources(desc.successSources?.join('\n') || "");
          formState.setRealizationType(desc.realizationType || "");
          formState.setRealizationObstacles(desc.realizationObstacles?.join('\n') || "");
          formState.setRecommendations(desc.recommendations?.join('\n') || "");
          
          // Generator Code
          formState.setGeneratorFormula(desc.generatorFormula || "");
          formState.setEnergySources(desc.energySources?.join('\n') || "");
          formState.setEnergyDrains(desc.energyDrains?.join('\n') || "");
          formState.setFlowSigns(desc.flowSigns?.join('\n') || "");
          formState.setBurnoutSigns(desc.burnoutSigns?.join('\n') || "");
          formState.setGeneratorRecommendation(desc.generatorRecommendation || "");
          
          // Mission Code
          formState.setMissionEssence(desc.missionEssence || "");
          formState.setMissionRealizationFactors(desc.missionRealizationFactors?.join('\n') || "");
          formState.setMissionChallenges(desc.missionChallenges || "");
          formState.setMissionObstacles(desc.missionObstacles?.join('\n') || "");
          formState.setMainTransformation(desc.mainTransformation || "");
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
    
    fetchArchetype();
  }, [selectedCode, selectedValue]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const archetypeDescription: ArchetypeDescription = {
        code: selectedCode,
        value: selectedValue,
        title: formState.title || `Архетип ${selectedValue}`,
        description: formState.description,
        maleImageUrl: formState.maleImageUrl,
        femaleImageUrl: formState.femaleImageUrl,
        
        // Personality Code
        resourceManifestation: formState.resourceManifestation,
        distortedManifestation: formState.distortedManifestation,
        developmentTask: formState.developmentTask,
        resourceQualities: parseTextToArray(formState.resourceQualities),
        keyDistortions: parseTextToArray(formState.keyDistortions),
        
        // Connector Code
        keyTask: formState.keyTask,
        workingAspects: parseTextToArray(formState.workingAspects),
        nonWorkingAspects: parseTextToArray(formState.nonWorkingAspects),
        worldContactBasis: formState.worldContactBasis,
        
        // Realization Code
        formula: formState.formula,
        potentialRealizationWays: parseTextToArray(formState.potentialRealizationWays),
        successSources: parseTextToArray(formState.successSources),
        realizationType: formState.realizationType,
        realizationObstacles: parseTextToArray(formState.realizationObstacles),
        recommendations: parseTextToArray(formState.recommendations),
        
        // Generator Code
        generatorFormula: formState.generatorFormula,
        energySources: parseTextToArray(formState.energySources),
        energyDrains: parseTextToArray(formState.energyDrains),
        flowSigns: parseTextToArray(formState.flowSigns),
        burnoutSigns: parseTextToArray(formState.burnoutSigns),
        generatorRecommendation: formState.generatorRecommendation,
        
        // Mission Code
        missionEssence: formState.missionEssence,
        missionRealizationFactors: parseTextToArray(formState.missionRealizationFactors),
        missionChallenges: formState.missionChallenges,
        missionObstacles: parseTextToArray(formState.missionObstacles),
        mainTransformation: formState.mainTransformation,
        
        // Backward compatibility
        strengths: parseTextToArray(formState.resourceQualities),
        challenges: parseTextToArray(formState.keyDistortions),
      };

      const success = await addArchetypeDescription(archetypeDescription);
      
      if (success) {
        // Reload descriptions to update the UI
        await refreshArchetypes();
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
    
    // Form fields (распаковываем все поля формы)
    ...otherFormState,
    
    // Functions
    handleSave,
    handleArchetypeSelect,
    setSelectedCode,
    setSelectedValue,
  };
};
