
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

const CalculationsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Расчеты</h1>
        <p className="text-muted-foreground">
          Выберите тип расчета для проведения консультации
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Базовый расчет
            </CardTitle>
            <CardDescription>
              Индивидуальный анализ личности по дате рождения
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Анализ личностных качеств на основании даты рождения. Включает:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Таланты и способности</li>
              <li>Сильные стороны личности</li>
              <li>Потенциальные сложности</li>
              <li>Рекомендации по развитию</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => navigate('/calculations/new/basic')}
              className="w-full"
            >
              Создать базовый расчет
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Партнерский расчет
            </CardTitle>
            <CardDescription>
              Анализ совместимости двух людей
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Сравнительный анализ совместимости двух личностей. Включает:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Потенциал отношений</li>
              <li>Общие точки интересов</li>
              <li>Возможные сложности</li>
              <li>Рекомендации по улучшению взаимопонимания</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => navigate('/calculations/new/partnership')}
              className="w-full"
            >
              Создать партнерский расчет
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Целевой расчет
            </CardTitle>
            <CardDescription>
              Анализ по конкретному запросу клиента
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Специализированный анализ по индивидуальному запросу. Включает:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Детальный разбор конкретных вопросов</li>
              <li>Прогностический анализ</li>
              <li>Индивидуальные рекомендации</li>
              <li>Стратегии развития в нужной области</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => navigate('/calculations/new/target')}
              className="w-full"
            >
              Создать целевой расчет
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CalculationsPage;
