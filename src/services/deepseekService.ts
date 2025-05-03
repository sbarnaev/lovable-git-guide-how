
import { supabase } from "@/integrations/supabase/client";
import { ArchetypeDescription } from "@/types/numerology";

export type DeepSeekContentType = 
  | 'summary'
  | 'strengths-weaknesses'
  | 'code-conflicts'
  | 'potential-problems'
  | 'practices'
  | 'chat';

const PROMPTS: Record<DeepSeekContentType, string> = {
  summary: `Напиши краткое описание личности человека с такими архетипами. Не более 300 слов. Старайся описать сильные стороны личности и ключевые особенности. Не упоминай номера кодов.`,
  
  'strengths-weaknesses': `Опиши основные сильные и слабые стороны человека с такими архетипами. Разбей на два раздела: "Сильные стороны" и "Слабые стороны". Не упоминай номера кодов.`,
  
  'code-conflicts': `Опиши возможные конфликты между архетипами у этого человека. Объясни, как эти конфликты могут проявляться в жизни и как их можно гармонизировать. Не упоминай номера кодов.`,
  
  'potential-problems': `Опиши потенциальные проблемы или вызовы, с которыми может столкнуться человек с такими архетипами. Предложи пути решения этих проблем. Не упоминай номера кодов.`,
  
  practices: `Предложи 5-7 практик или упражнений, которые помогут человеку с такими архетипами лучше раскрыть свой потенциал и преодолеть возможные трудности. Для каждой практики дай название и краткое описание. Не упоминай номера кодов.`,
  
  chat: `Ответь на вопрос пользователя, используя знания о его архетипах. Дай подробный и полезный ответ.`
};

export interface DeepSeekResponse {
  content: string;
  type: DeepSeekContentType;
}

export const getArchetypesString = (archetypes: ArchetypeDescription[]): string => {
  return archetypes.map(arch => {
    let description = `${arch.code.toUpperCase()} КОД ${arch.value}:\n`;
    
    // Add title if available
    if (arch.title) {
      description += `Название: ${arch.title}\n`;
    }
    
    // Add main description if available
    if (arch.description) {
      description += `Описание: ${arch.description}\n`;
    }
    
    // Add code-specific details based on the code type
    switch (arch.code) {
      case 'personality':
        if (arch.resourceManifestation) description += `Ресурсное проявление: ${arch.resourceManifestation}\n`;
        if (arch.distortedManifestation) description += `Искаженное проявление: ${arch.distortedManifestation}\n`;
        if (arch.developmentTask) description += `Задача развития: ${arch.developmentTask}\n`;
        break;
      case 'connector':
        if (arch.keyTask) description += `Ключевая задача: ${arch.keyTask}\n`;
        if (arch.worldContactBasis) description += `Контакт с миром: ${arch.worldContactBasis}\n`;
        break;
      case 'realization':
        if (arch.formula) description += `Формула: ${arch.formula}\n`;
        if (arch.realizationType) description += `Тип реализации: ${arch.realizationType}\n`;
        break;
      case 'generator':
        if (arch.generatorFormula) description += `Формула: ${arch.generatorFormula}\n`;
        if (arch.generatorRecommendation) description += `Рекомендация: ${arch.generatorRecommendation}\n`;
        break;
      case 'mission':
        if (arch.missionEssence) description += `Суть миссии: ${arch.missionEssence}\n`;
        if (arch.missionChallenges) description += `Испытания миссии: ${arch.missionChallenges}\n`;
        if (arch.mainTransformation) description += `Главная трансформация: ${arch.mainTransformation}\n`;
        break;
    }
    
    return description;
  }).join('\n\n');
};

export const generateDeepSeekContent = async (
  type: DeepSeekContentType, 
  archetypes: ArchetypeDescription[],
  customPrompt?: string
): Promise<DeepSeekResponse> => {
  try {
    const archetypesString = getArchetypesString(archetypes);
    const prompt = customPrompt || PROMPTS[type];
    
    const { data, error } = await supabase.functions.invoke('deepseek', {
      body: {
        prompt,
        archetypes: archetypesString,
        type
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating DeepSeek content:', error);
    throw error;
  }
};
