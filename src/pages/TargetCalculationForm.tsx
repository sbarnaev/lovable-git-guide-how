
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCalculations } from "@/contexts/calculations";
import { useToast } from "@/hooks/use-toast";
import { generateDeepSeekContent, saveGeneratedContent } from "@/services/deepseekService";
import { NumerologyCodeType } from "@/types/numerology";

const TargetCalculationForm = () => {
  const navigate = useNavigate();
  const { addCalculation } = useCalculations();
  const { toast } = useToast();
  
  const [clientName, setClientName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [targetQuery, setTargetQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      // Initial calculation result structure with properly initialized properties
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
      
      // Create the calculation data
      const calculationData = {
        type: 'target' as const,
        clientName,
        birthDate,
        targetQuery,
        results,
      };
      
      // Save the calculation to get an ID
      const newCalculation = await addCalculation(calculationData);
      
      // Prepare for AI content generation
      const targetArchetypes = [{ 
        code: 'target' as NumerologyCodeType, 
        title: "Целевой расчет",
        description: `Запрос клиента: ${targetQuery}`,
        value: 0
      }];
      
      // Start background generation of content
      // We'll use Promise.all but not await it, so it continues in the background
      const generatePromises = [
        generateDeepSeekContent('summary', targetArchetypes)
          .then(response => saveGeneratedContent(newCalculation.id, 'summary', response.content))
          .catch(error => console.error("Error generating summary content:", error)),
        
        generateDeepSeekContent('practices', targetArchetypes)
          .then(response => saveGeneratedContent(newCalculation.id, 'practices', response.content))
          .catch(error => console.error("Error generating practices content:", error)),
          
        generateDeepSeekContent('potential-problems', targetArchetypes)
          .then(response => saveGeneratedContent(newCalculation.id, 'potential-problems', response.content))
          .catch(error => console.error("Error generating potential-problems content:", error))
      ];
      
      // Start the generation process in the background
      Promise.all(generatePromises)
        .then(() => {
          console.log("AI content generated and saved for calculation:", newCalculation.id);
        })
        .catch(error => {
          console.error("Failed to generate some AI content:", error);
        });
      
      toast({
        title: "Успешно",
        description: "Расчет успешно создан",
      });
      
      // Navigate directly to the calculation result page
      navigate(`/calculations/${newCalculation.id}`);
    } catch (error) {
      console.error("Error creating calculation:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать расчет",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
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
