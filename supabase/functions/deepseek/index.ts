
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Используем API ключ из переменных окружения или из клиента
const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY") || "sk-c41441aa0398496691ab4276756da8cb";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Respond to OPTIONS requests for CORS
const handleCorsRequest = () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

const generateContentPrompt = (contentType, archetypes) => {
  const basicInfo = archetypes.map((a) => 
    `Код ${a.code}: ${a.value}, название: ${a.title}`
  ).join("\n");
  
  const detailedInfo = archetypes.map((a) => {
    let details = `Код ${a.code} (значение ${a.value}):\n`;
    details += a.description ? `Описание: ${a.description}\n` : '';
    
    // Add details based on the archetype code
    if (a.code === 'personality') {
      details += a.resourceManifestation ? `Ресурсное проявление: ${a.resourceManifestation}\n` : '';
      details += a.distortedManifestation ? `Искаженное проявление: ${a.distortedManifestation}\n` : '';
      details += a.developmentTask ? `Задача развития: ${a.developmentTask}\n` : '';
      if (a.resourceQualities && a.resourceQualities.length > 0) {
        details += `Ключевые качества в ресурсе: ${a.resourceQualities.join(", ")}\n`;
      }
      if (a.keyDistortions && a.keyDistortions.length > 0) {
        details += `Ключевые искажения: ${a.keyDistortions.join(", ")}\n`;
      }
    } 
    else if (a.code === 'connector') {
      details += a.keyTask ? `Ключевая задача: ${a.keyTask}\n` : '';
      if (a.workingAspects && a.workingAspects.length > 0) {
        details += `Что работает (в ресурсе): ${a.workingAspects.join(", ")}\n`;
      }
      if (a.nonWorkingAspects && a.nonWorkingAspects.length > 0) {
        details += `Что не работает (искажения): ${a.nonWorkingAspects.join(", ")}\n`;
      }
      details += a.worldContactBasis ? `Контакт с миром должен строиться на: ${a.worldContactBasis}\n` : '';
    }
    else if (a.code === 'realization') {
      details += a.formula ? `Формула: ${a.formula}\n` : '';
      if (a.potentialRealizationWays && a.potentialRealizationWays.length > 0) {
        details += `Как реализуется потенциал: ${a.potentialRealizationWays.join(", ")}\n`;
      }
      if (a.successSources && a.successSources.length > 0) {
        details += `Источники успеха: ${a.successSources.join(", ")}\n`;
      }
      details += a.realizationType ? `Тип реализации: ${a.realizationType}\n` : '';
      if (a.realizationObstacles && a.realizationObstacles.length > 0) {
        details += `Искажения (что мешает реализовываться): ${a.realizationObstacles.join(", ")}\n`;
      }
    }
    else if (a.code === 'generator') {
      details += a.generatorFormula ? `Формула: ${a.generatorFormula}\n` : '';
      if (a.energySources && a.energySources.length > 0) {
        details += `Что дает энергию: ${a.energySources.join(", ")}\n`;
      }
      if (a.energyDrains && a.energyDrains.length > 0) {
        details += `Что забирает энергию: ${a.energyDrains.join(", ")}\n`;
      }
      if (a.flowSigns && a.flowSigns.length > 0) {
        details += `Признаки, что человек в потоке: ${a.flowSigns.join(", ")}\n`;
      }
      if (a.burnoutSigns && a.burnoutSigns.length > 0) {
        details += `Признаки, что человек выгорел: ${a.burnoutSigns.join(", ")}\n`;
      }
      details += a.generatorRecommendation ? `Рекомендация: ${a.generatorRecommendation}\n` : '';
    }
    else if (a.code === 'mission') {
      details += a.missionEssence ? `Суть миссии: ${a.missionEssence}\n` : '';
      if (a.missionRealizationFactors && a.missionRealizationFactors.length > 0) {
        details += `Что реализует миссию: ${a.missionRealizationFactors.join(", ")}\n`;
      }
      details += a.missionChallenges ? `Испытания миссии: ${a.missionChallenges}\n` : '';
      if (a.missionObstacles && a.missionObstacles.length > 0) {
        details += `Что мешает реализовываться: ${a.missionObstacles.join(", ")}\n`;
      }
      details += a.mainTransformation ? `Главная трансформация: ${a.mainTransformation}\n` : '';
    }
    
    return details;
  }).join("\n\n");
  
  // Base prompt for all content types
  let prompt = `Ты - эксперт по нумерологии. Ответь на русском языке, основываясь на следующих данных профиля пользователя:

${basicInfo}

Подробная информация:
${detailedInfo}

`;

  // Content type specific prompts
  switch (contentType) {
    case 'summary':
      prompt += `Напиши краткое саммари (до 250 слов) по этому нумерологическому профилю. Опиши основные черты характера, сильные стороны и потенциальные зоны роста. Не упоминай номера кодов, говори о качествах человека.`;
      break;
    
    case 'strengths-weaknesses':
      prompt += `Опиши сильные и слабые стороны этого нумерологического профиля. Структурируй текст, разделяя сильные и слабые стороны. Приведи примеры проявлений этих качеств в повседневной жизни. Пиши подробно, но понятно.`;
      break;
      
    case 'code-conflicts':
      prompt += `Проанализируй возможные конфликты между разными нумерологическими кодами в этом профиле. Какие коды могут противоречить друг другу и к каким проблемам это может приводить? Как эти конфликты проявляются в жизни человека? Как их можно гармонизировать?`;
      break;
      
    case 'potential-problems':
      prompt += `Опиши потенциальные проблемы и сложности, которые могут возникнуть у человека с таким нумерологическим профилем. На что стоит обратить особое внимание? Какие скрытые препятствия могут мешать раскрытию потенциала? Приведи конкретные ситуации и проявления.`;
      break;
      
    case 'practices':
      prompt += `Предложи практические упражнения и рекомендации для работы с этим нумерологическим профилем. Как можно развить сильные стороны? Как преодолеть ограничения? Дай не менее 5 конкретных практик с описанием и ожидаемым результатом.`;
      break;
    
    case 'chat':
      // This will be handled separately
      break;
      
    default:
      prompt += `Напиши общее описание этого нумерологического профиля.`;
  }
  
  return prompt;
};

// Handle chat requests separately
const handleChatRequest = async (archetypes, userMessage) => {
  // Generate system message with profile info
  const systemPrompt = generateContentPrompt('', archetypes) + 
    `\n\nТы - ассистент по нумерологии. Отвечай на вопросы пользователя, используя информацию о его нумерологическом профиле. Давай ясные, полезные и точные ответы. Будь дружелюбным и поддерживающим. Если вопрос не связан с нумерологией, мягко верни разговор к теме профиля пользователя.`;
  
  const messages = [
    { "role": "system", "content": systemPrompt },
    { "role": "user", "content": userMessage }
  ];
  
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    }),
  });
  
  const data = await response.json();
  console.log("DeepSeek response:", JSON.stringify(data));
  
  if (!response.ok || !data.choices || data.choices.length === 0) {
    throw new Error(`DeepSeek API error: ${JSON.stringify(data)}`);
  }
  
  return data.choices[0].message.content;
};

// Main function to handle requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleCorsRequest();
  }
  
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for API key
    if (!DEEPSEEK_API_KEY) {
      console.error("Missing DeepSeek API Key");
      return new Response(
        JSON.stringify({ error: "Server configuration error: DeepSeek API Key not set" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const requestBody = await req.json();
    const { contentType, archetypes, userMessage } = requestBody;
    
    console.log(`Processing ${contentType} request with ${archetypes ? archetypes.length : 0} archetypes`);
    
    if (!archetypes || !Array.isArray(archetypes) || archetypes.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: archetypes array is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let content;
    
    // Handle chat requests differently
    if (contentType === 'chat') {
      content = await handleChatRequest(archetypes, userMessage || "Расскажи про мой профиль");
    } else {
      // For other content types
      const prompt = generateContentPrompt(contentType, archetypes);
      
      const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { "role": "system", "content": "Ты - эксперт по нумерологии. Отвечай на русском языке." },
            { "role": "user", "content": prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500
        }),
      });
      
      const data = await response.json();
      console.log("DeepSeek response status:", response.status);
      
      if (!response.ok || !data.choices || data.choices.length === 0) {
        throw new Error(`DeepSeek API error: ${JSON.stringify(data)}`);
      }
      
      content = data.choices[0].message.content;
    }

    // Return the response
    return new Response(
      JSON.stringify({ content }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
