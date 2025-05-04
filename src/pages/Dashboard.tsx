
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalculations } from "@/contexts/calculations";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calculator, Calendar, Clock, History, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { calculations } = useCalculations();
  const navigate = useNavigate();
  
  // Get most recent calculation
  const recentCalculation = calculations.length > 0 
    ? calculations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] 
    : null;
    
  // Count by type
  const basicCount = calculations.filter(calc => calc.type === 'basic').length;
  const partnershipCount = calculations.filter(calc => calc.type === 'partnership').length;
  const targetCount = calculations.filter(calc => calc.type === 'target').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Здравствуйте, {profile?.name || user?.email?.split('@')[0]}</h1>
        <p className="text-muted-foreground">
          Добро пожаловать в консультационный портал Numerica
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Всего расчетов</CardDescription>
            <CardTitle className="text-3xl">{calculations.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground flex items-center">
              <Calculator className="h-4 w-4 mr-1" />
              <span className="text-sm">Консультационных анализов</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Базовые расчеты</CardDescription>
            <CardTitle className="text-3xl">{basicCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm">Личностных анализов</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Партнерские расчеты</CardDescription>
            <CardTitle className="text-3xl">{partnershipCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm">Совместимостей</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Целевые расчеты</CardDescription>
            <CardTitle className="text-3xl">{targetCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">Специализированных анализов</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Новая консультация</CardTitle>
            <CardDescription>
              Выберите тип расчета для новой консультации
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Button 
              onClick={() => navigate('/calculations/new/basic')}
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <User className="h-5 w-5" />
              <div>Базовый расчет</div>
              <div className="text-xs text-muted-foreground">Персональный анализ</div>
            </Button>
            
            <Button 
              onClick={() => navigate('/calculations/new/partnership')}
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <User className="h-5 w-5" />
              <div>Партнерский расчет</div>
              <div className="text-xs text-muted-foreground">Анализ совместимости</div>
            </Button>
            
            <Button 
              onClick={() => navigate('/calculations/new/target')}
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Calendar className="h-5 w-5" />
              <div>Целевой расчет</div>
              <div className="text-xs text-muted-foreground">По запросу клиента</div>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <History className="h-5 w-5" /> История
            </CardTitle>
            <CardDescription>
              Последние консультации
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentCalculation ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="font-medium">{recentCalculation.clientName}</div>
                  <div className="text-sm text-muted-foreground">
                    {recentCalculation.type === 'basic' && 'Базовый расчет'}
                    {recentCalculation.type === 'partnership' && 'Партнерский расчет'}
                    {recentCalculation.type === 'target' && 'Целевой расчет'}
                  </div>
                  <div className="text-xs flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(recentCalculation.createdAt), { 
                      addSuffix: true,
                      locale: ru
                    })}
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/history')}
                >
                  Открыть историю
                </Button>
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-4">
                История консультаций пуста
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
