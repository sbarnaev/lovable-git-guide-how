
export type NumerologyCodeType = 
  | 'personality'  // Код личности
  | 'connector'    // Код коннектора
  | 'realization'  // Код реализации
  | 'generator'    // Код генератора
  | 'mission';     // Код миссии

export interface NumerologyCode {
  type: NumerologyCodeType;
  value: number;
  description: string;
}

export interface ArchetypeDescription {
  code: NumerologyCodeType;
  value: number; // 1-9 or 11 for mission
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
}

export interface NumerologyResult {
  personalityCode: number;
  connectorCode: number;
  realizationCode: number;
  generatorCode: number;
  missionCode: number;
  fullDescriptions: ArchetypeDescription[];
}
