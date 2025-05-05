
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    // If this is a manual test request, we can return success
    if (req.headers.get("x-test-call") === "true") {
      console.log("This is a test call, returning success");
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    // Parse the request body as JSON
    const event: UserSignupEvent = await req.json();
    
    // Verify this is a user signup event
    if (event.type !== "INSERT" || event.table !== "users" || event.schema !== "auth") {
      return new Response(
        JSON.stringify({ error: "Not a user signup event" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { email } = event.record;
    const name = event.record.raw_user_meta_data?.name || "новый пользователь";
    
    // We don't have the password in clear text since it's hashed
    // We'll instruct the user to use the "Forgot Password" feature if needed
    
    console.log(`Sending welcome email to ${email}`);
    
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
            <a href="${Deno.env.get("SITE_URL") || "https://lovable.dev"}/reset-password" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Создать пароль</a>
          </div>
          
          <p style="font-size: 16px; color: #555;">Если кнопка выше не работает, перейдите на страницу входа и нажмите <strong>"Забыли пароль?"</strong>, чтобы получить ссылку для создания пароля.</p>
          
          <p style="font-size: 16px; color: #555;">Если у вас возникли вопросы или проблемы с доступом к системе, пожалуйста, свяжитесь с нашей службой поддержки.</p>
          
          <p style="font-size: 16px; color: #555;">С уважением,<br>Команда SALISTICA</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
