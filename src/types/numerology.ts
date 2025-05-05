
// If the file already has content, we need to modify just the NumerologyCodeType
export type NumerologyCodeType = 
  | 'personalityCode' 
  | 'connectorCode' 
  | 'realizationCode' 
  | 'generatorCode' 
  | 'missionCode'
  | 'target'; // Adding target as a valid code type

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
  
  // Personality-specific fields
  resource_manifestation?: string;
  distorted_manifestation?: string;
  development_task?: string;
  key_task?: string;
  resource_qualities?: string[];
  key_distortions?: string[];
  burnout_signs?: string[];

  // Connector-specific fields
  working_aspects?: string[];
  non_working_aspects?: string[];
  world_contact_basis?: string;
  
  // Realization-specific fields
  formula?: string;
  potential_realization_ways?: string[];
  success_sources?: string[];
  realization_type?: string;
  realization_obstacles?: string[];
  recommendations?: string[];
  
  // Generator-specific fields
  generator_formula?: string;
  energy_sources?: string[];
  energy_drains?: string[];
  flow_signs?: string[];
  generator_recommendation?: string;
  
  // Mission-specific fields
  mission_essence?: string;
  mission_realization_factors?: string[];
  mission_challenges?: string;
  mission_obstacles?: string[];
  main_transformation?: string;
  
  // Generic fields
  strengths?: string[];
  challenges?: string[];
  
  // Image URLs
  male_image_url?: string;
  female_image_url?: string;
}
