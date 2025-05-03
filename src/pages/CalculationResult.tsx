
import { useNavigate, useParams } from "react-router-dom";
import { useCalculations } from "@/contexts/CalculationsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, File, User } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";

const CalculationResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCalculation } = useCalculations();
  
  const calculation = id ? getCalculation(id) : undefined;
  
  if (!calculation) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold">Расчет не найден</h2>
        <Button onClick={() => navigate("/calculations")}>
          Вернуться к расчетам
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: ru });
    } catch {
      return dateString;
    }
  };
  
  const getCalculationTitle = () => {
    switch (calculation.type) {
      case 'basic':
        return 'Базовый расчет';
      case 'partnership':
        return 'Партнерский расчет';
      case 'target':
        return 'Целевой расчет';
      default:
        return 'Расчет';
    }
  };
  
  const renderBasicResults = () => {
    const { numerology, strengths, challenges, recommendations } = calculation.results;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Основные числа</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-numerica">{numerology.lifePath}</div>
                <div className="text-sm text-muted-foreground">Путь жизни</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-numerica">{numerology.destiny}</div>
                <div className="text-sm text-muted-foreground">Предназначение</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-numerica">{numerology.personality}</div>
                <div className="text-sm text-muted-foreground">Личность</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Сильные стороны</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-numerica/80" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Потенциальные вызовы</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {challenges.map((challenge, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-numerica/80" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Рекомендации</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-numerica/80 mt-2" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderPartnershipResults = () => {
    const { compatibility, strengths, challenges, recommendations } = calculation.results;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Совместимость</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-numerica">{compatibility.overall}%</div>
                <div className="text-sm text-muted-foreground">Общая совместимость</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-numerica">{compatibility.emotional}%</div>
                  <div className="text-sm text-muted-foreground">Эмоциональная</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-numerica">{compatibility.intellectual}%</div>
                  <div className="text-sm text-muted-foreground">Интеллектуальная</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-numerica">{compatibility.physical}%</div>
                  <div className="text-sm text-muted-foreground">Физическая</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Сильные стороны отношений</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-numerica/80" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Потенциальные сложности</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {challenges.map((challenge, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-numerica/80" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Рекомендации</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-numerica/80 mt-2" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderTargetResults = () => {
    const { analysis, recommendations, timeframe } = calculation.results;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Основной анализ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Ключевые факторы:</h4>
              <ul className="space-y-2">
                {analysis.mainFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-numerica/80" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Текущая фаза:</h4>
              <div className="px-4 py-2 bg-secondary rounded-md">
                {analysis.currentPhase}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Потенциальные результаты:</h4>
              <ul className="space-y-2">
                {analysis.potentialOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-numerica/80" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Рекомендации</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-numerica/80 mt-2" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center p-2 bg-secondary rounded-md">
              <span className="font-medium">Временные рамки: </span>
              <span>{timeframe}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  const renderResults = () => {
    switch (calculation.type) {
      case 'basic':
        return renderBasicResults();
      case 'partnership':
        return renderPartnershipResults();
      case 'target':
        return renderTargetResults();
      default:
        return <div>Неизвестный тип расчета</div>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/history")}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{getCalculationTitle()}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <File className="h-5 w-5" />
            Информация о расчете
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="space-y-1">
              <div className="text-sm font-medium flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Клиент:</span>
              </div>
              <div>{calculation.clientName}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Дата рождения:</span>
              </div>
              <div>{formatDate(calculation.birthDate)}</div>
            </div>
            
            {calculation.type === 'partnership' && (
              <>
                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Партнер:</span>
                  </div>
                  <div>{calculation.partnerName}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Дата рождения партнера:</span>
                  </div>
                  <div>{formatDate(calculation.partnerBirthDate || '')}</div>
                </div>
              </>
            )}
            
            {calculation.type === 'target' && (
              <div className="col-span-full space-y-1">
                <div className="text-sm font-medium">Запрос:</div>
                <div className="text-sm p-3 bg-muted rounded-md">{calculation.targetQuery}</div>
              </div>
            )}
            
            <div className={cn("space-y-1", calculation.type === 'target' ? "col-span-full md:col-span-1" : "")}>
              <div className="text-sm font-medium">Дата создания:</div>
              <div className="text-sm">{formatDate(calculation.createdAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Результаты анализа</h2>
        {renderResults()}
      </div>
      
      <div className="flex justify-center pt-6">
        <Button 
          onClick={() => navigate('/calculations')}
          variant="outline"
        >
          Создать новый расчет
        </Button>
      </div>
    </div>
  );
};

export default CalculationResult;
