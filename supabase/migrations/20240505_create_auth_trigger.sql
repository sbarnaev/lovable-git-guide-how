
-- Создаем функцию для вызова нашей edge-функции
CREATE OR REPLACE FUNCTION public.notify_signup_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Вызываем edge-функцию через webhook
  PERFORM
    net.http_post(
      url := 'https://vahtrfkpnffcjuvhuwgm.supabase.co/functions/v1/send-welcome-email',
      body := json_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW)
      )::text,
      headers := '{"Content-Type": "application/json"}',
      timeout_milliseconds := 5000
    );
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Проверяем, активирован ли расширение для http запросов
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Создаем триггер для вызова функции при добавлении новых пользователей
DROP TRIGGER IF EXISTS notify_signup ON auth.users;

CREATE TRIGGER notify_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.notify_signup_webhook();
