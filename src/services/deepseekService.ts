
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
        userMessage: type === 'chat' ? userMessage : undefined
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
    
    return data || [];
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
};
