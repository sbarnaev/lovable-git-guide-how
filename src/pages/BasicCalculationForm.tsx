
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCalculations } from "@/contexts/CalculationsContext";
import { useToast } from "@/hooks/use-toast";

const BasicCalculationForm = () => {
  const navigate = useNavigate();
  const { createCalculation } = useCalculations();
  const { toast } = useToast();
  
  const [clientName, setClientName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !birthDate) {
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
      numerology: {
        lifePath: Math.floor(Math.random() * 9) + 1,
        destiny: Math.floor(Math.random() * 9) + 1,
        personality: Math.floor(Math.random() * 9) + 1,
      },
      strengths: ["Аналитический ум", "Творческое мышление", "Лидерские качества"],
      challenges: ["Нетерпеливость", "Перфекционизм"],
      recommendations: ["Развивать эмпатию", "Практиковать осознанность", "Работать над коммуникацией"]
    };
    
    setTimeout(() => {
      try {
        const calculation = createCalculation({
          type: 'basic',
          clientName,
          birthDate,
          results,
        });
        
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
        <h1 className="text-2xl font-bold tracking-tight">Базовый расчет</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Данные клиента</CardTitle>
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

export default BasicCalculationForm;
