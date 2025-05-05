
import { supabase } from "@/integrations/supabase/client";

/**
 * Обновляет email пользователя
 * @param newEmail новый email адрес
 */
export async function updateEmail(newEmail: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ email: newEmail });
  
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Обновляет пароль пользователя
 * @param currentPassword текущий пароль для проверки
 * @param newPassword новый пароль
 */
export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
  // Сначала получаем текущего пользователя
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user?.email) {
    throw new Error("Не удалось получить информацию о текущем пользователе");
  }
  
  // Проверяем текущий пароль, выполнив вход
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: currentPassword,
  });
  
  if (signInError) {
    throw new Error("Неверный текущий пароль");
  }
  
  // Если текущий пароль верный, обновляем пароль
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  
  if (error) {
    throw new Error(error.message);
  }
}
