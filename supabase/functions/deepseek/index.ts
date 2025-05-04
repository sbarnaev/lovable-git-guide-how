
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ArchetypeDescription } from "../../../src/types/numerology.ts";

const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

// Default prompts if none are provided in the request
const DEFAULT_PROMPTS = {
  summary: `Ты - опытный нумеролог и психолог. Проанализируй и представь краткий обзор личности на основе предоставленных нумерологических архетипов.`,
  
  'strengths-weaknesses': `Ты - опытный нумеролог и психолог. На основе предоставленных нумерологических архетипов составь детальный анализ сильных и слабых сторон личности.`,
  
  'code-conflicts': `Ты - опытный нумеролог и психолог. На основе предоставленных нумерологических архетипов проанализируй потенциальные конфликты между различными аспектами личности.`,
  
  'potential-problems': `Ты - опытный нумеролог и психолог. На основе предоставленных нумерологических архетипов выяви и опиши потенциальные проблемы, с которыми может столкнуться человек в своём развитии.`,
  
  'practices': `Ты - опытный нумеролог, психолог и коуч. На основе предоставленных нумерологических архетипов разработай комплекс практических упражнений и рекомендаций для личностного роста.`,
  
  chat: `Ты - опытный нумеролог и психолог-консультант. Ты отвечаешь на вопросы клиента на основе архетипов его нумерологического профиля.`
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!DEEPSEEK_API_KEY) {
      throw new Error("DEEPSEEK_API_KEY is not set");
    }

    const { contentType, archetypes, userMessage, prompt } = await req.json();
    
    if (!contentType || !archetypes || archetypes.length === 0) {
      throw new Error("Missing required parameters: contentType, archetypes");
    }

    // Format the archetypes data for the prompt
    const archetypesText = archetypes.map((arch: ArchetypeDescription) => {
      let text = `# ${arch.title} (Код ${arch.code}: ${arch.value})\n`;
      
      // Add description if available
      if (arch.description) {
        text += `Описание: ${arch.description}\n\n`;
      }
      
      // Add resource manifestation for Personality
      if (arch.code === 'personality' && arch.resourceManifestation) {
        text += `Ресурсное проявление: ${arch.resourceManifestation}\n`;
      }
      
      // Add distorted manifestation for Personality
      if (arch.code === 'personality' && arch.distortedManifestation) {
        text += `Искаженное проявление: ${arch.distortedManifestation}\n`;
      }
      
      // Add development task for Personality
      if (arch.code === 'personality' && arch.developmentTask) {
        text += `Задача развития: ${arch.developmentTask}\n`;
      }
      
      // Add key task for Connector
      if (arch.code === 'connector' && arch.keyTask) {
        text += `Ключевая задача: ${arch.keyTask}\n`;
      }
      
      // Add formula for Realization
      if (arch.code === 'realization' && arch.formula) {
        text += `Формула: ${arch.formula}\n`;
      }
      
      // Add resource qualities if available
      if (arch.resourceQualities && arch.resourceQualities.length > 0) {
        text += `\nРесурсные качества:\n`;
        arch.resourceQualities.forEach((quality, index) => {
          text += `${index + 1}. ${quality}\n`;
        });
      }
      
      // Add key distortions if available
      if (arch.keyDistortions && arch.keyDistortions.length > 0) {
        text += `\nКлючевые искажения:\n`;
        arch.keyDistortions.forEach((distortion, index) => {
          text += `${index + 1}. ${distortion}\n`;
        });
      }
      
      // Add recommendations if available
      if (arch.recommendations && arch.recommendations.length > 0) {
        text += `\nРекомендации:\n`;
        arch.recommendations.forEach((rec, index) => {
          text += `${index + 1}. ${rec}\n`;
        });
      }
      
      return text;
    }).join('\n\n');

    // Use provided prompt or fallback to default
    const promptToUse = prompt || DEFAULT_PROMPTS[contentType];
    
    // Build the full system message
    let systemMessage = promptToUse;
    
    // For chat type, include the user message in the prompt
    if (contentType === "chat" && userMessage) {
      systemMessage = systemMessage.replace('{{userMessage}}', userMessage);
    }

    // Request to the DeepSeek API
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: `Данные по нумерологическим архетипам:\n\n${archetypesText}` }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      console.error("Invalid response from DeepSeek:", data);
      throw new Error("Invalid response from DeepSeek API");
    }

    return new Response(
      JSON.stringify({ content: data.choices[0].message.content }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in deepseek function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
