
// If the file already has content, we need to modify just the NumerologyCodeType
export type NumerologyCodeType = 
  | 'personalityCode' | 'personality'
  | 'connectorCode' | 'connector'
  | 'realizationCode' | 'realization'
  | 'generatorCode' | 'generator'
  | 'missionCode' | 'mission'
  | 'target'
  | 'all'; // Adding 'all' as a valid code type

export interface NumerologyProfile {
  lifePath: number;
  destiny: number;
  personality: number;
  fullCodes?: {
    personalityCode: number;
    connectorCode: number;
    realizationCode: number;
    generatorCode: number;
    missionCode: number;
  };
}

export interface ArchetypeDescription {
  code: NumerologyCodeType;
  value: number;
  title: string;
  description?: string;
  
  // Personality-specific fields (converted to camelCase)
  resourceManifestation?: string;
  distortedManifestation?: string;
  developmentTask?: string;
  keyTask?: string;
  resourceQualities?: string[];
  keyDistortions?: string[];
  burnoutSigns?: string[];

  // Connector-specific fields (converted to camelCase)
  workingAspects?: string[];
  nonWorkingAspects?: string[];
  worldContactBasis?: string;
  
  // Realization-specific fields (converted to camelCase)
  formula?: string;
  potentialRealizationWays?: string[];
  successSources?: string[];
  realizationType?: string;
  realizationObstacles?: string[];
  recommendations?: string[];
  
  // Generator-specific fields (converted to camelCase)
  generatorFormula?: string;
  energySources?: string[];
  energyDrains?: string[];
  flowSigns?: string[];
  generatorRecommendation?: string;
  
  // Mission-specific fields (converted to camelCase)
  missionEssence?: string;
  missionRealizationFactors?: string[];
  missionChallenges?: string;
  missionObstacles?: string[];
  mainTransformation?: string;
  
  // Generic fields
  strengths?: string[];
  challenges?: string[];
  
  // Image URLs
  maleImageUrl?: string;
  femaleImageUrl?: string;
  
  // Keep backward compatibility with snake_case for any existing data
  resource_manifestation?: string;
  distorted_manifestation?: string;
  development_task?: string;
  key_task?: string;
  resource_qualities?: string[];
  key_distortions?: string[];
  burnout_signs?: string[];
  working_aspects?: string[];
  non_working_aspects?: string[];
  world_contact_basis?: string;
  potential_realization_ways?: string[];
  success_sources?: string[];
  realization_type?: string;
  realization_obstacles?: string[];
  generator_formula?: string;
  energy_sources?: string[];
  energy_drains?: string[];
  flow_signs?: string[];
  generator_recommendation?: string;
  mission_essence?: string;
  mission_realization_factors?: string[];
  mission_challenges?: string;
  mission_obstacles?: string[];
  main_transformation?: string;
  male_image_url?: string;
  female_image_url?: string;
}
