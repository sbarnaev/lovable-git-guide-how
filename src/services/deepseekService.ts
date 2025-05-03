
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

export const generateDeepSeekContent = async (
  type: DeepSeekContentType,
  archetypes: ArchetypeDescription[]
): Promise<DeepSeekResponse> => {
  try {
    console.log(`Generating DeepSeek content for ${type} with ${archetypes.length} archetypes`);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('deepseek', {
      body: {
        contentType: type,
        archetypes,
        userMessage: type === 'chat' ? 'Привет! Расскажи про мой профиль.' : undefined
      }
    });

    if (error) {
      console.error('Error calling DeepSeek function:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }

    return {
      content: data.content || 'Контент не сгенерирован. Попробуйте позже.'
    };
  } catch (error) {
    console.error('DeepSeek service error:', error);
    throw error;
  }
};
