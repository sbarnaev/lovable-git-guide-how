
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
    if (!DEEPSEEK_API_KEY) {
      throw new Error('Missing DeepSeek API key');
    }

    // Parse request body
    const { prompt, archetypes, type } = await req.json();

    // Prepare the system prompt
    let systemPrompt = "Ты — эксперт по нумерологии, который помогает анализировать и интерпретировать нумерологические коды. ";

    if (type === 'chat') {
      systemPrompt += "Отвечай на вопросы пользователя на основе предоставленных нумерологических данных. Твои ответы должны быть информативными, конкретными и полезными. Давай практические советы и рекомендации, основанные на архетипах пользователя.";
    } else {
      systemPrompt += "Твоя задача — генерировать подробный аналитический контент на основе нумерологических данных.";
    }

    // Building the final prompt
    const finalPrompt = `${prompt}\n\nДанные об архетипах клиента:\n${archetypes}`;

    // Make request to DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user", 
            content: finalPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('DeepSeek API error:', data);
      throw new Error(`DeepSeek API error: ${data.error?.message || 'Unknown error'}`);
    }

    // Extract the content from the AI response
    const content = data.choices[0].message.content;

    // Return success response
    return new Response(
      JSON.stringify({ 
        content,
        type 
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
      }
    );
  } catch (error) {
    console.error('Error processing deepseek request:', error.message);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
      }
    );
  }
});
