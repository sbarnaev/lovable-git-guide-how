
import { BasicCalculationResults } from "@/types";
import { calculateAllCodes } from "./numerologyCalculator";

interface CompatibilityResult {
  compatibility: {
    overall: number;
    emotional: number;
    intellectual: number;
    physical: number;
  };
  strengths: string[];
  challenges: string[];
  recommendations: string[];
}

/**
 * Calculate compatibility between two numerology profiles
 */
export const calculateCompatibility = (profile1: BasicCalculationResults | undefined, profile2: BasicCalculationResults | undefined): CompatibilityResult => {
  // Check if profiles exist
  if (!profile1 || !profile2) {
    console.error("One or both profiles are undefined in calculateCompatibility");
    return {
      compatibility: {
        overall: 50,
        emotional: 50,
        intellectual: 50,
        physical: 50,
      },
      strengths: ["Данные для анализа неполные"],
      challenges: ["Требуется больше информации для точного анализа"],
      recommendations: ["Заполните полные данные профилей для точного анализа"]
    };
  }
  
  // Extract codes from both profiles
  const codes1 = profile1.fullCodes;
  const codes2 = profile2.fullCodes;
  
  if (!codes1 || !codes2) {
    console.error("Missing fullCodes in one or both profiles");
    return {
      compatibility: {
        overall: 50,
        emotional: 50,
        intellectual: 50,
        physical: 50,
      },
      strengths: ["Данные для анализа неполные"],
      challenges: ["Требуется больше информации для точного анализа"],
      recommendations: ["Заполните полные данные профилей для точного анализа"]
    };
  }
  
  // Calculate emotional compatibility based on personality and mission codes
  const emotionalCompatibility = calculateEmotionalCompatibility(
    codes1.personalityCode, 
    codes2.personalityCode,
    codes1.missionCode,
    codes2.missionCode
  );
  
  // Calculate intellectual compatibility based on connector codes
  const intellectualCompatibility = calculateIntellectualCompatibility(
    codes1.connectorCode,
    codes2.connectorCode
  );
  
  // Calculate physical compatibility based on generator codes
  const physicalCompatibility = calculatePhysicalCompatibility(
    codes1.generatorCode,
    codes2.generatorCode
  );
  
  // Calculate overall compatibility (weighted average)
  const overall = Math.round(
    (emotionalCompatibility * 0.4) + 
    (intellectualCompatibility * 0.3) + 
    (physicalCompatibility * 0.3)
  );
  
  // Generate strengths, challenges and recommendations
  const { strengths, challenges, recommendations } = generateAnalysis(
    codes1, 
    codes2, 
    { emotionalCompatibility, intellectualCompatibility, physicalCompatibility, overall }
  );
  
  return {
    compatibility: {
      overall,
      emotional: emotionalCompatibility,
      intellectual: intellectualCompatibility,
      physical: physicalCompatibility,
    },
    strengths,
    challenges,
    recommendations
  };
};

/**
 * Calculate emotional compatibility based on personality and mission codes
 */
const calculateEmotionalCompatibility = (
  personality1: number, 
  personality2: number,
  mission1: number,
  mission2: number
): number => {
  // Check for exact matches (high compatibility)
  if (personality1 === personality2) {
    return 85 + Math.floor(Math.random() * 15); // 85-100% compatibility
  }
  
  // Check for complementary archetypes
  const complementaryPairs: [number, number][] = [
    [1, 6], [2, 7], [3, 8], [4, 9], [5, 1], 
    [6, 2], [7, 3], [8, 4], [9, 5]
  ];
  
  const areComplementary = complementaryPairs.some(
    ([a, b]) => 
      (personality1 === a && personality2 === b) || 
      (personality1 === b && personality2 === a)
  );
  
  if (areComplementary) {
    return 70 + Math.floor(Math.random() * 15); // 70-85% compatibility
  }
  
  // Mission code similarity
  if (mission1 === mission2) {
    return 65 + Math.floor(Math.random() * 15); // 65-80% compatibility
  }
  
  // For other combinations, generate a random value between 40-70%
  return 40 + Math.floor(Math.random() * 30);
};

/**
 * Calculate intellectual compatibility based on connector codes
 */
const calculateIntellectualCompatibility = (connector1: number, connector2: number): number => {
  // Exact match indicates similar thinking styles
  if (connector1 === connector2) {
    return 75 + Math.floor(Math.random() * 25); // 75-100% compatibility
  }
  
  // Complementary connectors
  const complementaryPairs: [number, number][] = [
    [1, 8], [2, 9], [3, 1], [4, 2], [5, 7], 
    [6, 5], [7, 6], [8, 3], [9, 4]
  ];
  
  const areComplementary = complementaryPairs.some(
    ([a, b]) => 
      (connector1 === a && connector2 === b) || 
      (connector1 === b && connector2 === a)
  );
  
  if (areComplementary) {
    return 60 + Math.floor(Math.random() * 15); // 60-75% compatibility
  }
  
  // For other combinations, generate a random value between 35-60%
  return 35 + Math.floor(Math.random() * 25);
};

/**
 * Calculate physical compatibility based on generator codes
 */
const calculatePhysicalCompatibility = (generator1: number, generator2: number): number => {
  // Exact match indicates similar energy patterns
  if (generator1 === generator2) {
    return 70 + Math.floor(Math.random() * 30); // 70-100% compatibility
  }
  
  // Complementary generators
  const complementaryPairs: [number, number][] = [
    [1, 5], [2, 7], [3, 6], [4, 8], [5, 9], 
    [6, 1], [7, 5], [8, 3], [9, 2]
  ];
  
  const areComplementary = complementaryPairs.some(
    ([a, b]) => 
      (generator1 === a && generator2 === b) || 
      (generator1 === b && generator2 === a)
  );
  
  if (areComplementary) {
    return 60 + Math.floor(Math.random() * 20); // 60-80% compatibility
  }
  
  // For other combinations, generate a random value between 30-60%
  return 30 + Math.floor(Math.random() * 30);
};

/**
 * Generate strengths, challenges and recommendations based on compatibility analysis
 */
const generateAnalysis = (
  codes1: { personalityCode: number; connectorCode: number; realizationCode: number; generatorCode: number; missionCode: number },
  codes2: { personalityCode: number; connectorCode: number; realizationCode: number; generatorCode: number; missionCode: number },
  compatibility: { emotionalCompatibility: number; intellectualCompatibility: number; physicalCompatibility: number; overall: number }
) => {
  const strengths: string[] = [];
  const challenges: string[] = [];
  const recommendations: string[] = [];
  
  // Add default strengths and challenges
  strengths.push("Понимание индивидуальных особенностей друг друга");
  challenges.push("Адаптация к разным энергетическим ритмам");
  
  // Analyze emotional compatibility
  if (compatibility.emotionalCompatibility >= 80) {
    strengths.push("Глубокое эмоциональное понимание");
    if (codes1.personalityCode === codes2.personalityCode) {
      strengths.push("Схожий подход к восприятию мира");
    }
  } else if (compatibility.emotionalCompatibility >= 60) {
    strengths.push("Взаимодополняющие эмоциональные качества");
    recommendations.push("Развивайте эмпатию, чтобы лучше понимать эмоциональные реакции друг друга");
  } else {
    challenges.push("Разные эмоциональные реакции на одни и те же ситуации");
    recommendations.push("Уделяйте время обсуждению чувств и эмоций открыто");
  }
  
  // Analyze intellectual compatibility
  if (compatibility.intellectualCompatibility >= 80) {
    strengths.push("Превосходное взаимопонимание в обсуждениях и дискуссиях");
    if (codes1.connectorCode === codes2.connectorCode) {
      strengths.push("Схожие интеллектуальные интересы");
    }
  } else if (compatibility.intellectualCompatibility >= 60) {
    strengths.push("Взаимодополняющие когнитивные стили");
    recommendations.push("Используйте разницу в подходах как преимущество для решения задач");
  } else {
    challenges.push("Различия в способах мышления и принятия решений");
    recommendations.push("Практикуйте активное слушание при обсуждении важных вопросов");
  }
  
  // Analyze physical compatibility
  if (compatibility.physicalCompatibility >= 80) {
    strengths.push("Высокая совместимость в повседневных ритмах");
    if (codes1.generatorCode === codes2.generatorCode) {
      strengths.push("Схожие энергетические циклы");
    }
  } else if (compatibility.physicalCompatibility >= 60) {
    strengths.push("Взаимодополняющие энергетические профили");
    recommendations.push("Планируйте совместные активности, учитывая энергетические профили друг друга");
  } else {
    challenges.push("Разные уровни энергии и физической активности");
    recommendations.push("Ищите баланс между периодами высокой активности и отдыха");
  }
  
  // Overall recommendations
  recommendations.push("Регулярно обсуждайте ожидания и потребности друг друга");
  
  // Add more specialized recommendations
  if (compatibility.overall >= 80) {
    recommendations.push("Развивайте совместные долгосрочные цели, используя совместимость как основу");
  } else if (compatibility.overall >= 60) {
    recommendations.push("Сосредоточьтесь на сильных сторонах ваших отношений и работайте над областями различий");
  } else {
    recommendations.push("Начните с принятия различий и изучения интересов друг друга, чтобы укрепить связь");
  }
  
  return { strengths, challenges, recommendations };
};
