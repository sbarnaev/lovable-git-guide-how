
import { supabase } from "@/integrations/supabase/client";

export type DeepSeekContentType = 'summary' | 'strengths-weaknesses' | 'code-conflicts' | 'potential-problems' | 'practices';

const getPromptForType = (type: DeepSeekContentType): string => {
  switch (type) {
    case 'summary':
      return 'Создай саммари 2-3 абзаца о человеке с такими архетипами. Опиши его основные особенности, таланты и возможные сложности.';
    case 'strengths-weaknesses':
      return 'Опиши сильные и слабые стороны человека с такими архетипами. Выдели 5-7 сильных качеств и 3-4 потенциальных слабостей.';
    case 'code-conflicts':
      return 'Проанализируй данные архетипы и опиши возможные конфликты между кодами этого человека. Например, что из одного кода может противоречить или мешать другому коду.';
    case 'potential-problems':
      return 'Опиши потенциальные проблемы и сложности, с которыми может столкнуться человек с такими архетипами. Это могут быть как внутренние конфликты, так и сложности во взаимодействии с миром.';
    case 'practices':
      return 'Предложи 4-5 практических упражнений или рекомендаций, которые помогут человеку с такими архетипами развить свои сильные стороны и проработать слабости.';
    default:
      return 'Создай саммари о человеке с такими архетипами.';
  }
};

const formatArchetypesForPrompt = (archetypes: any[]): string => {
  if (!archetypes || archetypes.length === 0) {
    return '';
  }

  return archetypes.map(arch => {
    const parts = [];
    parts.push(`Код ${arch.code === 'personality' ? 'Личности' : 
                arch.code === 'connector' ? 'Коннектора' : 
                arch.code === 'realization' ? 'Реализации' : 
                arch.code === 'generator' ? 'Генератора' : 
                arch.code === 'mission' ? 'Миссии' : arch.code} ${arch.value}:`);
    
    if (arch.description) parts.push(`- Описание: ${arch.description}`);
    if (arch.resourceQualities && arch.resourceQualities.length) 
      parts.push(`- Ресурсные качества: ${arch.resourceQualities.join(', ')}`);
    if (arch.keyDistortions && arch.keyDistortions.length) 
      parts.push(`- Ключевые искажения: ${arch.keyDistortions.join(', ')}`);
    
    // Добавляем специфичные поля для разных типов кодов
    switch (arch.code) {
      case 'personality':
        if (arch.resourceManifestation) parts.push(`- Ресурсное проявление: ${arch.resourceManifestation}`);
        if (arch.distortedManifestation) parts.push(`- Искаженное проявление: ${arch.distortedManifestation}`);
        break;
      case 'connector':
        if (arch.workingAspects && arch.workingAspects.length) 
          parts.push(`- Рабочие аспекты: ${arch.workingAspects.join(', ')}`);
        if (arch.nonWorkingAspects && arch.nonWorkingAspects.length) 
          parts.push(`- Нерабочие аспекты: ${arch.nonWorkingAspects.join(', ')}`);
        break;
      case 'realization':
        if (arch.potentialRealizationWays && arch.potentialRealizationWays.length)
          parts.push(`- Пути реализации: ${arch.potentialRealizationWays.join(', ')}`);
        if (arch.realizationType) parts.push(`- Тип реализации: ${arch.realizationType}`);
        break;
      case 'generator':
        if (arch.energySources && arch.energySources.length)
          parts.push(`- Источники энергии: ${arch.energySources.join(', ')}`);
        if (arch.energyDrains && arch.energyDrains.length)
          parts.push(`- Что забирает энергию: ${arch.energyDrains.join(', ')}`);
        break;
      case 'mission':
        if (arch.missionEssence) parts.push(`- Суть миссии: ${arch.missionEssence}`);
        if (arch.missionRealizationFactors && arch.missionRealizationFactors.length)
          parts.push(`- Факторы реализации миссии: ${arch.missionRealizationFactors.join(', ')}`);
        break;
    }
    
    return parts.join('\n');
  }).join('\n\n');
};

export const generateDeepSeekContent = async (type: DeepSeekContentType, archetypes: any[]) => {
  try {
    const prompt = getPromptForType(type);
    const archetypesInfo = formatArchetypesForPrompt(archetypes);

    const { data, error } = await supabase.functions.invoke('deepseek', {
      body: {
        prompt,
        archetypes: archetypesInfo,
        type
      }
    });

    if (error) {
      console.error('Error invoking deepseek function:', error);
      throw new Error(error.message || 'Failed to generate content');
    }

    return data;
  } catch (err) {
    console.error('Error in generateDeepSeekContent:', err);
    throw err;
  }
};
