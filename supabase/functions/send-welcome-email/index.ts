
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { supabaseClient } from 'npm:@supabase/supabase-js@2.39.8';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SITE_URL = Deno.env.get("SITE_URL") || "https://lovable.dev";

if (!RESEND_API_KEY) {
  console.error("Ошибка: RESEND_API_KEY не задан. Пожалуйста, установите секрет RESEND_API_KEY.");
}

const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UserSignupEvent {
  type: string;
  table: string;
  schema: string;
  record: {
    id: string;
    email: string;
    created_at: string;
    raw_user_meta_data?: {
      name?: string;
    };
  };
  old_record: null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Функция send-welcome-email вызвана");
    
    // If this is a manual test request, we can return success
    if (req.headers.get("x-test-call") === "true") {
      console.log("Это тестовый вызов, возвращаем успех");
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    console.log("Получен запрос на отправку письма");
    
    // Parse the request body as JSON
    const body = await req.text();
    console.log("Получены данные:", body);
    
    let event: UserSignupEvent;
    try {
      event = JSON.parse(body);
      console.log("Распарсенные данные события:", JSON.stringify(event, null, 2));
    } catch (parseError) {
      console.error("Ошибка при парсинге JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload", details: parseError.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Verify this is a user signup event
    if (!event.type || event.type !== "INSERT" || event.table !== "users" || event.schema !== "auth") {
      console.log("Это не событие регистрации пользователя:", event.type, event.table, event.schema);
      return new Response(
        JSON.stringify({ 
          error: "Not a user signup event",
          receivedEvent: {
            type: event.type,
            table: event.table,
            schema: event.schema
          }
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    if (!event.record || !event.record.email) {
      console.error("Email отсутствует в данных пользователя");
      return new Response(
        JSON.stringify({ error: "Email is missing in user data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { email } = event.record;
    const name = event.record.raw_user_meta_data?.name || "новый пользователь";
    
    console.log(`Отправка приветственного письма на адрес ${email}`);
    console.log(`Ссылка на сайт: ${SITE_URL}`);
    
    // Send welcome email with Resend
    const emailResponse = await resend.emails.send({
      from: "SALISTICA <onboarding@resend.dev>",
      to: [email],
      subject: "Добро пожаловать в SALISTICA!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Добро пожаловать в SALISTICA!</h1>
          
          <p style="font-size: 16px; color: #555;">Здравствуйте${name ? ", " + name : ""}!</p>
          
          <p style="font-size: 16px; color: #555;">Мы рады приветствовать вас в нашей платформе SALISTICA. Ваша учетная запись была успешно создана.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0 0 0; font-size: 14px;"><strong>Доступ:</strong> Активирован на 7 дней</p>
          </div>
          
          <p style="font-size: 16px; color: #555;">Для начала работы с системой, вам необходимо создать пароль для вашей учетной записи:</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${SITE_URL}/reset-password" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Создать пароль</a>
          </div>
          
          <p style="font-size: 16px; color: #555;">Если кнопка выше не работает, перейдите на страницу входа и нажмите <strong>"Забыли пароль?"</strong>, чтобы получить ссылку для создания пароля.</p>
          
          <p style="font-size: 16px; color: #555;">Если у вас возникли вопросы или проблемы с доступом к системе, пожалуйста, свяжитесь с нашей службой поддержки.</p>
          
          <p style="font-size: 16px; color: #555;">С уважением,<br>Команда SALISTICA</p>
        </div>
      `,
    });

    console.log("Email отправлен успешно:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Ошибка в функции send-welcome-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
