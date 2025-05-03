
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
  maleImageUrl?: string;
  femaleImageUrl?: string;
  
  // Код личности
  resourceManifestation?: string; // Ресурсное проявление
  distortedManifestation?: string; // Искаженное проявление
  developmentTask?: string; // Задача развития
  resourceQualities?: string[]; // Ключевые качества в ресурсе
  keyDistortions?: string[]; // Ключевые искажения
  
  // Код коннектора
  keyTask?: string; // Ключевая задача
  workingAspects?: string[]; // Что работает (в ресурсе)
  nonWorkingAspects?: string[]; // Что не работает (искажения)
  worldContactBasis?: string; // Контакт с миром должен строиться на
  
  // Код реализации
  formula?: string; // Формула
  potentialRealizationWays?: string[]; // Как реализуется потенциал
  successSources?: string[]; // Где находится источник дохода и успеха
  realizationType?: string; // Тип реализации
  realizationObstacles?: string[]; // Искажения (что мешает реализовываться)
  recommendations?: string[]; // Рекомендации
  
  // Код генератора
  generatorFormula?: string; // Формула
  energySources?: string[]; // Что дает энергию
  energyDrains?: string[]; // Что забирает энергию
  flowSigns?: string[]; // Признаки, что человек в потоке
  burnoutSigns?: string[]; // Признаки, что человек выгорел
  generatorRecommendation?: string; // Рекомендация
  
  // Код миссии
  missionEssence?: string; // Суть миссии
  missionRealizationFactors?: string[]; // Что реализует миссию
  missionChallenges?: string; // Испытания миссии
  missionObstacles?: string[]; // Что мешает релизовываться
  mainTransformation?: string; // Главная трансформация
  
  // For backward compatibility
  strengths?: string[];
  challenges?: string[];
}

export interface NumerologyResult {
  personalityCode: number;
  connectorCode: number;
  realizationCode: number;
  generatorCode: number;
  missionCode: number;
  fullDescriptions: ArchetypeDescription[];
}
