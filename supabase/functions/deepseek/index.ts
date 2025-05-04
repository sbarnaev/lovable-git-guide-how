
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");
const SYSTEM_PROMPT = `Ты эксперт по нумерологии, специализирующийся на прочтении нумерологических профилей. Твоя задача — анализировать нумерологические архетипы и предоставлять информацию о них в структурированном и понятном формате. Ты общаешься на русском языке. Не используй маркеры форматирования, такие как ** или ##.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!DEEPSEEK_API_KEY) {
      throw new Error("Missing DeepSeek API Key");
    }

    const { contentType, archetypes, userMessage } = await req.json();
    
    console.log(`Processing ${contentType} request with ${archetypes.length} archetypes`);
    
    let systemPrompt = SYSTEM_PROMPT;
    let userPromptContent = "";
    
    const archetypesJson = JSON.stringify(archetypes, null, 2);
    
    // Define different prompt structures based on content type
    switch (contentType) {
      case 'summary':
        userPromptContent = `Вот мои нумерологические архетипы: ${archetypesJson}\n\nСоздай краткое саммари (5-7 абзацев) моего нумерологического профиля, основанное на этих архетипах. Используй понятный язык, опиши мои ключевые сильные стороны, вызовы и возможности для роста. Не используй маркеры форматирования как ** или ##.`;
        break;
        
      case 'strengths-weaknesses':
        userPromptContent = `Вот мои нумерологические архетипы: ${archetypesJson}\n\nПроанализируй мои ключевые сильные и слабые стороны на основе этих архетипов. Создай два отдельных раздела: "Сильные стороны:" и "Области для развития:". В каждом разделе перечисли не менее 5-7 ключевых пунктов с кратким объяснением. Используй понятный язык без маркеров форматирования как ** или ##.`;
        break;
        
      case 'code-conflicts':
        userPromptContent = `Вот мои нумерологические архетипы: ${archetypesJson}\n\nПроанализируй потенциальные конфликты между разными кодами в моём профиле. Опиши, как эти коды могут противоречить друг другу и создавать внутренние противоречия. Для каждого конфликта предложи стратегию его разрешения. Не используй маркеры форматирования как ** или ##.`;
        break;
        
      case 'potential-problems':
        userPromptContent = `Вот мои нумерологические архетипы: ${archetypesJson}\n\nНа основе моего нумерологического профиля выяви потенциальные проблемы, с которыми я могу столкнуться в жизни, включая эмоциональные трудности, проблемы в отношениях и профессиональные вызовы. Для каждой проблемы предложи практические способы их предотвращения или преодоления. Не используй маркеры форматирования как ** или ##.`;
        break;
        
      case 'practices':
        userPromptContent = `Вот мои нумерологические архетипы: ${archetypesJson}\n\nПредложи практические упражнения и практики, которые помогут мне усилить положительные аспекты моего нумерологического профиля и работать над слабостями. Включи ежедневные практики, медитации и аффирмации, соответствующие моему нумерологическому профилю. Не используй маркеры форматирования как ** или ##.`;
        break;
        
      case 'chat':
        // For chat, use the user's message directly
        systemPrompt = `${SYSTEM_PROMPT}\n\nИнформация о профиле пользователя: ${archetypesJson}`;
        userPromptContent = userMessage || "Привет! Расскажи мне о моём профиле.";
        break;
        
      default:
        userPromptContent = `Вот мои нумерологические архетипы: ${archetypesJson}\n\nПредоставь анализ моего нумерологического профиля на основе этих архетипов. Не используй маркеры форматирования как ** или ##.`;
    }
    
    console.log(`Sending request to DeepSeek API for ${contentType}`);
    
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPromptContent }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DeepSeek API error:", errorData);
      throw new Error(`DeepSeek API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    // Remove any markdown formatting like ** or ##
    let content = data.choices[0].message.content;
    content = content.replace(/\*\*/g, '').replace(/##/g, '');
    
    console.log(`Successfully generated ${contentType} content`);
    
    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in deepseek function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
