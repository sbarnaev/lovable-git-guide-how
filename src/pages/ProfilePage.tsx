
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { updateEmail, updatePassword } from "@/utils/authUtils";

const emailSchema = z.object({
  email: z.string().email("Введите корректный email"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Минимальная длина пароля 6 символов"),
  newPassword: z.string().min(6, "Минимальная длина пароля 6 символов"),
  confirmPassword: z.string().min(6, "Минимальная длина пароля 6 символов"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

const ProfilePage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isEmailLoading, setEmailLoading] = useState(false);
  const [isPasswordLoading, setPasswordLoading] = useState(false);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleEmailUpdate = async (values: z.infer<typeof emailSchema>) => {
    setEmailLoading(true);
    try {
      await updateEmail(values.email);
      toast.success("Email успешно обновлен", {
        description: "На ваш новый email отправлено письмо для подтверждения",
      });
    } catch (error: any) {
      toast.error("Ошибка при обновлении email", {
        description: error.message || "Попробуйте еще раз или обратитесь в поддержку",
      });
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (values: z.infer<typeof passwordSchema>) => {
    setPasswordLoading(true);
    try {
      await updatePassword(values.currentPassword, values.newPassword);
      passwordForm.reset();
      toast.success("Пароль успешно обновлен");
    } catch (error: any) {
      toast.error("Ошибка при обновлении пароля", {
        description: error.message || "Проверьте правильность текущего пароля",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-6">Настройки профиля</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Информация о профиле</CardTitle>
          <CardDescription>
            Ваша текущая информация о профиле
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Имя</Label>
            <div className="text-lg font-medium">{profile?.name || "Не указано"}</div>
          </div>
          <div>
            <Label>Email</Label>
            <div className="text-lg font-medium">{user?.email}</div>
          </div>
          <div>
            <Label>Роль</Label>
            <div className="text-lg font-medium">{profile?.role || "Не указана"}</div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Изменить email</TabsTrigger>
          <TabsTrigger value="password">Изменить пароль</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Изменить email</CardTitle>
              <CardDescription>
                Введите новый email. На него будет отправлено письмо для подтверждения.
              </CardDescription>
            </CardHeader>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleEmailUpdate)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Новый email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="example@mail.com" 
                            {...field} 
                            disabled={isEmailLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isEmailLoading}
                  >
                    {isEmailLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Обновление...
                      </>
                    ) : (
                      "Обновить email"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Изменить пароль</CardTitle>
              <CardDescription>
                Для смены пароля необходимо указать текущий пароль.
              </CardDescription>
            </CardHeader>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Текущий пароль</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isPasswordLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Новый пароль</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isPasswordLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Подтвердите новый пароль</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isPasswordLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isPasswordLoading}
                  >
                    {isPasswordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Обновление...
                      </>
                    ) : (
                      "Обновить пароль"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
