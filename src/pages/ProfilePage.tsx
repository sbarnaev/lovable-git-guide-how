
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useAccess } from "@/contexts/AccessContext";
import { toast } from "sonner";
import { updateEmail, updatePassword } from "@/utils/authUtils";

const ProfilePage = () => {
  const { user, profile } = useAuth();
  const { isAdmin } = useAccess();
  
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    setEmailLoading(true);
    try {
      await updateEmail(newEmail);
      toast.success("Email успешно обновлен. Проверьте почту для подтверждения.");
      setNewEmail("");
    } catch (error: any) {
      toast.error(error.message || "Ошибка при обновлении email");
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }
    
    setPasswordLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      toast.success("Пароль успешно обновлен");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Ошибка при обновлении пароля");
    } finally {
      setPasswordLoading(false);
    }
  };

  const accessStatus = isAdmin ? "Администратор" : "Пользователь";
  const accessStatusColor = isAdmin ? "text-indigo-600" : "text-green-600";

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Профиль пользователя</h1>
        <p className="text-muted-foreground">
          Управление настройками вашего аккаунта
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Информация о профиле</CardTitle>
            <CardDescription>
              Основная информация о вашем аккаунте
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <div className="p-2 border rounded-md bg-muted/30">
                {user?.email}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Имя</Label>
              <div className="p-2 border rounded-md bg-muted/30">
                {profile?.name || "Не указано"}
              </div>
            </div>

            {/* Информация о роли пользователя */}
            <div className="space-y-2 pt-4 border-t">
              <Label>Статус</Label>
              <div className="flex items-center">
                <span className={`font-medium ${accessStatusColor}`}>
                  {accessStatus}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Обновить Email</CardTitle>
              <CardDescription>
                Введите новый email для вашего аккаунта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-email">Новый Email</Label>
                  <Input 
                    id="new-email" 
                    type="email" 
                    placeholder="your@email.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={!newEmail || emailLoading}
                  className="w-full"
                >
                  {emailLoading ? "Обновление..." : "Обновить Email"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Изменить пароль</CardTitle>
              <CardDescription>
                Обновите пароль вашего аккаунта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Текущий пароль</Label>
                  <Input 
                    id="current-password" 
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Новый пароль</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={!currentPassword || !newPassword || newPassword !== confirmPassword || passwordLoading}
                  className="w-full"
                >
                  {passwordLoading ? "Обновление..." : "Обновить пароль"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
