
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";

// Локальный кеш для архетипов
export let archetypeDescriptionsCache: ArchetypeDescription[] = [];

// Маппинг кодов для отображения
export const codeTypeToDisplay: Record<string, string> = {
  personalityCode: 'Код Личности',
  personality: 'Код Личности',
  connectorCode: 'Код Коннектора',
  connector: 'Код Коннектора',
  realizationCode: 'Код Реализации',
  realization: 'Код Реализации',
  generatorCode: 'Код Генератора',
  generator: 'Код Генератора',
  missionCode: 'Код Миссии',
  mission: 'Код Миссии',
  target: 'Целевой Расчет',
  all: 'Все'
};

// Переводы кодов
export const codeTypeTranslations: Record<string, string> = {
  personalityCode: 'Код личности',
  personality: 'Код личности', 
  connectorCode: 'Код коннектора',
  connector: 'Код коннектора',
  realizationCode: 'Код реализации',
  realization: 'Код реализации',
  generatorCode: 'Код генератора',
  generator: 'Код генератора',
  missionCode: 'Код миссии',
  mission: 'Код миссии',
  target: 'Целевой расчет',
  all: 'Все коды'
};

// Тип для преобразования в формат БД
export interface ArchetypeDbRecord {
  code: string;
  value: number;
  title: string;
  description: string | null;
  male_image_url: string | null;
  female_image_url: string | null;
  
  // Код личности
  resource_manifestation: string | null;
  distorted_manifestation: string | null;
  development_task: string | null;
  resource_qualities: string[] | null;
  key_distortions: string[] | null;
  
  // Код коннектора
  key_task: string | null;
  working_aspects: string[] | null;
  non_working_aspects: string[] | null;
  world_contact_basis: string | null;
  
  // Код реализации
  formula: string | null;
  potential_realization_ways: string[] | null;
  success_sources: string[] | null;
  realization_type: string | null;
  realization_obstacles: string[] | null;
  recommendations: string[] | null;
  
  // Код генератора
  generator_formula: string | null;
  energy_sources: string[] | null;
  energy_drains: string[] | null;
  flow_signs: string[] | null;
  burnout_signs: string[] | null;
  generator_recommendation: string | null;
  
  // Код миссии
  mission_essence: string | null;
  mission_realization_factors: string[] | null;
  mission_challenges: string | null;
  mission_obstacles: string[] | null;
  main_transformation: string | null;
  
  // Для обратной совместимости
  strengths: string[] | null;
  challenges: string[] | null;
}
