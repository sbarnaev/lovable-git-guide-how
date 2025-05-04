
import React from "react";
import { useArchetypeManagement } from "@/hooks/useArchetypeManagement";
import { ArchetypesHeader } from "@/components/archetypes/ArchetypesHeader";
import { ArchetypesEditor } from "@/components/archetypes/ArchetypesEditor";
import { ArchetypesSidebar } from "@/components/archetypes/ArchetypesSidebar";

const ArchetypesAdminPage = () => {
  const archetypeManagement = useArchetypeManagement();
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <ArchetypesHeader 
        title="Управление архетипами"
        description="Добавление и редактирование описаний архетипов для каждого кода"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ArchetypesEditor
            loading={archetypeManagement.loading}
            selectedCode={archetypeManagement.selectedCode}
            setSelectedCode={archetypeManagement.setSelectedCode}
            selectedValue={archetypeManagement.selectedValue}
            setSelectedValue={archetypeManagement.setSelectedValue}
            onSave={archetypeManagement.handleSave}
            
            // General fields
            title={archetypeManagement.title}
            setTitle={archetypeManagement.setTitle}
            description={archetypeManagement.description}
            setDescription={archetypeManagement.setDescription}
            maleImageUrl={archetypeManagement.maleImageUrl}
            setMaleImageUrl={archetypeManagement.setMaleImageUrl}
            femaleImageUrl={archetypeManagement.femaleImageUrl}
            setFemaleImageUrl={archetypeManagement.setFemaleImageUrl}
            
            // Personality Code fields
            resourceManifestation={archetypeManagement.resourceManifestation}
            setResourceManifestation={archetypeManagement.setResourceManifestation}
            distortedManifestation={archetypeManagement.distortedManifestation}
            setDistortedManifestation={archetypeManagement.setDistortedManifestation}
            developmentTask={archetypeManagement.developmentTask}
            setDevelopmentTask={archetypeManagement.setDevelopmentTask}
            resourceQualities={archetypeManagement.resourceQualities}
            setResourceQualities={archetypeManagement.setResourceQualities}
            keyDistortions={archetypeManagement.keyDistortions}
            setKeyDistortions={archetypeManagement.setKeyDistortions}
            
            // Connector Code fields
            keyTask={archetypeManagement.keyTask}
            setKeyTask={archetypeManagement.setKeyTask}
            workingAspects={archetypeManagement.workingAspects}
            setWorkingAspects={archetypeManagement.setWorkingAspects}
            nonWorkingAspects={archetypeManagement.nonWorkingAspects}
            setNonWorkingAspects={archetypeManagement.setNonWorkingAspects}
            worldContactBasis={archetypeManagement.worldContactBasis}
            setWorldContactBasis={archetypeManagement.setWorldContactBasis}
            
            // Realization Code fields
            formula={archetypeManagement.formula}
            setFormula={archetypeManagement.setFormula}
            potentialRealizationWays={archetypeManagement.potentialRealizationWays}
            setPotentialRealizationWays={archetypeManagement.setPotentialRealizationWays}
            successSources={archetypeManagement.successSources}
            setSuccessSources={archetypeManagement.setSuccessSources}
            realizationType={archetypeManagement.realizationType}
            setRealizationType={archetypeManagement.setRealizationType}
            realizationObstacles={archetypeManagement.realizationObstacles}
            setRealizationObstacles={archetypeManagement.setRealizationObstacles}
            recommendations={archetypeManagement.recommendations}
            setRecommendations={archetypeManagement.setRecommendations}
            
            // Generator Code fields
            generatorFormula={archetypeManagement.generatorFormula}
            setGeneratorFormula={archetypeManagement.setGeneratorFormula}
            energySources={archetypeManagement.energySources}
            setEnergySources={archetypeManagement.setEnergySources}
            energyDrains={archetypeManagement.energyDrains}
            setEnergyDrains={archetypeManagement.setEnergyDrains}
            flowSigns={archetypeManagement.flowSigns}
            setFlowSigns={archetypeManagement.setFlowSigns}
            burnoutSigns={archetypeManagement.burnoutSigns}
            setBurnoutSigns={archetypeManagement.setBurnoutSigns}
            generatorRecommendation={archetypeManagement.generatorRecommendation}
            setGeneratorRecommendation={archetypeManagement.setGeneratorRecommendation}
            
            // Mission Code fields
            missionEssence={archetypeManagement.missionEssence}
            setMissionEssence={archetypeManagement.setMissionEssence}
            missionRealizationFactors={archetypeManagement.missionRealizationFactors}
            setMissionRealizationFactors={archetypeManagement.setMissionRealizationFactors}
            missionChallenges={archetypeManagement.missionChallenges}
            setMissionChallenges={archetypeManagement.setMissionChallenges}
            missionObstacles={archetypeManagement.missionObstacles}
            setMissionObstacles={archetypeManagement.setMissionObstacles}
            mainTransformation={archetypeManagement.mainTransformation}
            setMainTransformation={archetypeManagement.setMainTransformation}
          />
        </div>
        
        <div>
          <ArchetypesSidebar 
            descriptions={archetypeManagement.descriptions}
            onSelect={archetypeManagement.handleArchetypeSelect}
            loading={archetypeManagement.loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ArchetypesAdminPage;
