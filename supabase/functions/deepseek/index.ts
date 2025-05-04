
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define the necessary types directly in the Edge Function
export type NumerologyCodeType = 
  | 'personality'  // Код личности
  | 'connector'    // Код коннектора
  | 'realization'  // Код реализации
  | 'generator'    // Код генератора
  | 'mission'      // Код миссии
  | 'target'       // Целевой расчет
  | 'all';         // Все коды

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

const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

// Default prompts if none are provided in the request
const DEFAULT_PROMPTS = {
  summary: `Ты - опытный нумеролог и психолог. Проанализируй и представь краткий обзор личности на основе предоставленных нумерологических архетипов.`,
  
  'strengths-weaknesses': `Ты - опытный нумеролог и психолог. На основе предоставленных нумерологических архетипов составь детальный анализ сильных и слабых сторон личности.`,
  
  'code-conflicts': `Ты - опытный нумеролог и психолог. На основе предоставленных нумерологических архетипов проанализируй потенциальные конфликты между различными аспектами личности.`,
  
  'potential-problems': `Ты - опытный нумеролог и психолог. На основе предоставленных нумерологических архетипов выяви и опиши потенциальные проблемы, с которыми может столкнуться человек в своём развитии.`,
  
  'practices': `Ты - опытный нумеролог, психолог и коуч. На основе предоставленных нумерологических архетипов разработай комплекс практических упражнений и рекомендаций для личностного роста.`,
  
  chat: `Ты - опытный нумеролог и психолог-консультант, помогающий специалисту проводить нумерологическую консультацию. Используй полный анализ всех предоставленных нумерологических архетипов клиента.`
};

// Additional partnership-specific prompts
const PARTNERSHIP_PROMPTS = {
  summary: `Ты - опытный нумеролог и психолог. Проанализируй и представь анализ совместимости двух людей на основе их нумерологических архетипов. Покажи, как их коды взаимодействуют между собой, где есть синергия, а где потенциальные конфликты.`,
  
  'strengths-weaknesses': `Ты - опытный нумеролог и психолог. На основе предоставленных нумерологических архетипов двух людей составь детальный анализ сильных и слабых сторон их взаимодействия в отношениях.`,
  
  'code-conflicts': `Ты - опытный нумеролог и психолог. На основе предоставленных нумерологических архетипов двух людей проанализируй потенциальные конфликты между ними и предложи способы их гармонизации.`,
  
  'practices': `Ты - опытный нумеролог, психолог и коуч. На основе предоставленных нумерологических архетипов двух людей разработай комплекс практических рекомендаций для улучшения их взаимопонимания и взаимодействия.`,
  
  chat: `Ты - опытный нумеролог и психолог-консультант, помогающий специалисту проводить нумерологическую консультацию по совместимости двух людей. Используй полный анализ всех предоставленных нумерологических архетипов обоих людей. Даже если в вопросе не упомянуты оба человека, рассматривай ситуацию как взаимодействие между ними.`
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

    const { contentType, archetypes, userMessage, prompt, isPartnership } = await req.json();
    
    if (!contentType || !archetypes || archetypes.length === 0) {
      throw new Error("Missing required parameters: contentType, archetypes");
    }

    // Format the archetypes data for the prompt - now with more detailed formatting
    const archetypesText = archetypes.map((arch: ArchetypeDescription, index: number) => {
      let personPrefix = "";
      
      // If this is a partnership calculation, split the archetypes between two people
      if (isPartnership) {
        const halfLength = Math.floor(archetypes.length / 2);
        if (index < halfLength) {
          personPrefix = "Первый человек - ";
        } else {
          personPrefix = "Второй человек - ";
        }
      }
      
      let text = `# ${personPrefix}${arch.title} (Код ${arch.code}: ${arch.value})\n`;
      
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

    // Select appropriate prompt set based on whether this is a partnership calculation
    const promptSet = isPartnership ? PARTNERSHIP_PROMPTS : DEFAULT_PROMPTS;
    
    // Use provided prompt or fallback to default from the appropriate set
    const promptToUse = prompt || promptSet[contentType] || DEFAULT_PROMPTS[contentType];
    
    // Build the full system message
    let systemMessage = promptToUse;
    
    // For chat type, include the user message in the prompt
    if (contentType === "chat" && userMessage) {
      systemMessage = `${systemMessage}\n\nВопрос клиента: "${userMessage}"`;
    }

    console.log("Sending request to DeepSeek with system message:", systemMessage.substring(0, 100) + "...");

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
          { role: "user", content: `Данные по нумерологическим архетипам клиента:\n\n${archetypesText}` }
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
