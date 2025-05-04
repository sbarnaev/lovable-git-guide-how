
// This service interfaces with the DeepSeek AI to generate content based on profiles
import { ArchetypeDescription } from '@/types/numerology';
import { supabase } from '@/integrations/supabase/client';

export type DeepSeekContentType = 
  | 'summary'
  | 'strengths-weaknesses'
  | 'code-conflicts'
  | 'potential-problems'
  | 'practices'
  | 'chat';

export interface DeepSeekResponse {
  content: string;
}

export interface SavedContent {
  id: string;
  calculationId: string;
  contentType: DeepSeekContentType;
  content: string;
}

// AI prompts for different content types - edit these to customize the AI responses
export const DEEPSEEK_PROMPTS = {
  summary: `Ты - опытный нумеролог и психолог. Проанализируй и представь краткий обзор личности на основе предоставленных нумерологических архетипов. 
    Составь содержательное саммари (не более 3-4 абзацев), в котором:
    1. Опиши основные черты характера и личности
    2. Укажи ключевые таланты и потенциал развития
    3. Отметь основные вызовы и возможные сложности
    4. Дай 2-3 ключевые рекомендации для личностного роста

    Пиши от третьего лица, профессионально, без лишних технических деталей. Избегай общих фраз и клише.
  `,
  
  'strengths-weaknesses': `Ты - опытный нумеролог и психолог. На основе предоставленных нумерологических архетипов составь детальный анализ сильных и слабых сторон личности.

    Сначала опиши сильные стороны (5-7 пунктов), сгруппированных по категориям:
    - Интеллектуальные способности
    - Эмоциональный интеллект
    - Коммуникативные навыки
    - Творческий потенциал
    - Деловые качества

    Затем опиши слабые стороны (4-6 пунктов), указывая:
    - В чём проявляется слабость
    - При каких обстоятельствах проявляется
    - К каким последствиям может привести
    
    Заверши 3-4 рекомендациями по балансированию сильных сторон и компенсации слабых.
    
    Пиши профессиональным языком с психологическим уклоном. Будь конкретным и избегай общих фраз.
  `,
  
  'code-conflicts': `Ты - опытный нумеролог и психолог. На основе предоставленных нумерологических архетипов проанализируй потенциальные конфликты между различными аспектами личности.

    Сначала укажи 3-4 основных конфликта между нумерологическими кодами, описывая для каждого:
    - Между какими кодами/аспектами возникает конфликт
    - В чём суть противоречия
    - Как это проявляется в поведении и принятии решений
    - Какое влияние оказывает на жизнь человека

    Затем дай 4-5 практических рекомендаций по гармонизации этих конфликтов, включая:
    - Осознание и принятие конфликта
    - Практики для лучшего понимания своих мотивов
    - Конкретные шаги по интеграции противоречивых аспектов
    
    Используй профессиональный язык с элементами психологии и нумерологии. Избегай общих фраз и клише, сосредоточься на конкретике.
  `,
  
  'potential-problems': `Ты - опытный нумеролог и психолог. На основе предоставленных нумерологических архетипов выяви и опиши потенциальные проблемы, с которыми может столкнуться человек в своём развитии.

    Опиши 5-7 потенциальных проблем, сгруппированных по категориям:
    - Личностные блоки и ограничения
    - Проблемы в отношениях с другими
    - Карьерные и профессиональные трудности
    - Эмоциональные и психологические аспекты
    
    Для каждой проблемы укажи:
    - В чём именно заключается проблема
    - Какие коды и архетипы её вызывают
    - Ранние признаки возникновения проблемы
    - Возможные последствия, если не решать проблему
    
    Завершив описание проблем, дай 3-5 ключевых рекомендаций по их предотвращению и преодолению.
    
    Используй профессиональный язык с психологическим уклоном. Будь конкретным и точным в формулировках.
  `,
  
  'practices': `Ты - опытный нумеролог, психолог и коуч. На основе предоставленных нумерологических архетипов разработай комплекс практических упражнений и рекомендаций для личностного роста.

    Составь 7-10 конкретных практик, распределённых по категориям:
    - Ежедневные ритуалы и привычки (2-3 практики)
    - Еженедельные упражнения для саморефлексии (2-3 практики)
    - Ежемесячные практики для глубинной работы (1-2 практики)
    - Долгосрочные стратегии развития (2 практики)
    
    Для каждой практики укажи:
    - Название практики
    - Подробную пошаговую инструкцию по выполнению
    - Рекомендуемую частоту и продолжительность
    - Ожидаемый результат и эффект от регулярного выполнения
    - Связь с конкретными нумерологическими кодами и архетипами
    
    Практики должны быть конкретными, выполнимыми и адаптированными под психологический профиль человека согласно его архетипам.
    
    Используй профессиональный коучинговый язык. Будь конкретным, избегай общих фраз и слишком эзотерической терминологии.
  `,
  
  chat: `Ты - опытный нумеролог и психолог-консультант, помогающий специалисту проводить нумерологическую консультацию. 

    Ты выступаешь в роли эксперта-помощника для специалиста, который консультирует клиента с определенным нумерологическим профилем. Твоя задача - помогать консультанту лучше понимать профиль клиента и давать рекомендации по ведению консультации.

    При ответе:
    - Основывайся на полном анализе всех предоставленных нумерологических архетипов клиента
    - Предлагай глубокие интерпретации взаимодействия различных кодов в профиле
    - Делись практическими рекомендациями, которые консультант может предложить клиенту
    - Предлагай формулировки для объяснения сложных аспектов профиля
    - Помогай находить индивидуальные подходы к развитию и коррекции дисбалансов в профиле
    - Предлагай конкретные упражнения и практики для клиента, соответствующие его профилю
    - Отвечай профессиональным, но доступным языком
    - Структурируй свой ответ четко и логично, с выделением смысловых блоков
    - Используй метафоры и аналогии для лучшего объяснения сложных концепций
    
    Вопрос консультанта: {{userMessage}}
  `
};

export const generateDeepSeekContent = async (
  type: DeepSeekContentType,
  archetypes: ArchetypeDescription[],
  userMessage?: string
): Promise<DeepSeekResponse> => {
  try {
    console.log(`Generating DeepSeek content for ${type} with ${archetypes.length} archetypes`);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('deepseek', {
      body: {
        contentType: type,
        archetypes,
        userMessage: type === 'chat' ? userMessage : undefined,
        prompt: DEEPSEEK_PROMPTS[type].replace('{{userMessage}}', userMessage || '')
      }
    });

    if (error) {
      console.error('Error calling DeepSeek function:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }

    if (!data || !data.content) {
      console.error('Invalid response from DeepSeek function:', data);
      throw new Error('Received invalid response from AI service');
    }

    return {
      content: data.content
    };
  } catch (error) {
    console.error('DeepSeek service error:', error);
    throw error;
  }
};

export const saveGeneratedContent = async (
  calculationId: string,
  contentType: DeepSeekContentType,
  content: string
): Promise<{ id: string } | undefined> => {
  try {
    // First check if content already exists for this calculation and type
    const { data: existingContent, error: fetchError } = await supabase
      .from('ai_generated_content')
      .select('id')
      .eq('calculation_id', calculationId)
      .eq('content_type', contentType)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking for existing content:', fetchError);
      throw fetchError;
    }
    
    if (existingContent) {
      // Update existing content
      const { data, error } = await supabase
        .from('ai_generated_content')
        .update({ content })
        .eq('id', existingContent.id)
        .select()
        .single();
        
      if (error) throw error;
      return { id: data.id };
    } else {
      // Insert new content
      const { data, error } = await supabase
        .from('ai_generated_content')
        .insert([{ 
          calculation_id: calculationId,
          content_type: contentType, 
          content 
        }])
        .select()
        .single();
        
      if (error) throw error;
      return { id: data.id };
    }
  } catch (error) {
    console.error('Error saving generated content:', error);
    return undefined;
  }
};

export const getGeneratedContent = async (
  calculationId: string,
  contentType: DeepSeekContentType
): Promise<{ content: string } | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_generated_content')
      .select('content')
      .eq('calculation_id', calculationId)
      .eq('content_type', contentType)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No content found, return null
        return null;
      }
      throw error;
    }
    
    return { content: data.content };
  } catch (error) {
    console.error('Error fetching generated content:', error);
    throw error;
  }
};

export const saveChatMessage = async (
  calculationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<{ id: string } | undefined> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{ 
        calculation_id: calculationId,
        role, 
        content 
      }])
      .select()
      .single();
      
    if (error) throw error;
    return { id: data.id };
  } catch (error) {
    console.error('Error saving chat message:', error);
    return undefined;
  }
};

export const getChatMessages = async (
  calculationId: string
): Promise<{ role: 'user' | 'assistant'; content: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('calculation_id', calculationId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    // Ensure we're casting the role to the correct type
    return (data || []).map(message => ({
      role: message.role as 'user' | 'assistant',
      content: message.content
    }));
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
};
