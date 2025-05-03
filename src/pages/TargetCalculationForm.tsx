
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCalculations } from "@/contexts/CalculationsContext";
import { useToast } from "@/hooks/use-toast";
import { TargetCalculation } from "@/types";

const TargetCalculationForm = () => {
  const navigate = useNavigate();
  const { createCalculation } = useCalculations();
  const { toast } = useToast();
  
  const [clientName, setClientName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [targetQuery, setTargetQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !birthDate || !targetQuery) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Mock calculation result
    const results = {
      analysis: {
        mainFactors: ["Фактор карьеры", "Фактор личных отношений", "Фактор самореализации"],
        currentPhase: "Период трансформации",
        potentialOutcomes: ["Рост в профессиональной сфере", "Углубление личных отношений", "Обретение новых навыков"]
      },
      recommendations: [
        "Сосредоточиться на развитии профессиональных навыков",
        "Уделить внимание межличностным отношениям",
        "Регулярно проводить рефлексию действий и результатов",
        "Выделить приоритеты на ближайший период"
      ],
      timeframe: "3-6 месяцев"
    };
    
    setTimeout(() => {
      try {
        const calculationData: TargetCalculation = {
          type: 'target',
          clientName,
          birthDate,
          targetQuery,
          results,
        };
        
        const calculation = createCalculation(calculationData);
        
        toast({
          title: "Успешно",
          description: "Расчет успешно создан",
        });
        
        navigate(`/calculations/${calculation.id}`);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось создать расчет",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/calculations")}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Целевой расчет</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Данные для целевого анализа</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">ФИО клиента</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Иванов Иван Иванович"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Дата рождения</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetQuery">Запрос клиента</Label>
              <Textarea
                id="targetQuery"
                value={targetQuery}
                onChange={(e) => setTargetQuery(e.target.value)}
                placeholder="Опишите вопрос или проблему, требующую анализа..."
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/calculations")}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Расчет...
                </>
              ) : (
                "Создать расчет"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default TargetCalculationForm;
