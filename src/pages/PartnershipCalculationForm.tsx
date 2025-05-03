import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCalculations } from "@/contexts/CalculationsContext";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { PartnershipCalculation } from "@/types";

const PartnershipCalculationForm = () => {
  const navigate = useNavigate();
  const { createCalculation } = useCalculations();
  const { toast } = useToast();
  
  const [clientName, setClientName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthDate, setPartnerBirthDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !birthDate || !partnerName || !partnerBirthDate) {
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
      compatibility: {
        overall: Math.floor(Math.random() * 100),
        emotional: Math.floor(Math.random() * 100),
        intellectual: Math.floor(Math.random() * 100),
        physical: Math.floor(Math.random() * 100),
      },
      strengths: ["Глубокое взаимопонимание", "Схожие ценности", "Дополняющие качества"],
      challenges: ["Разные типы коммуникации", "Противоположные подходы к решению проблем"],
      recommendations: ["Развивать совместные интересы", "Уделять внимание активному слушанию", "Прояснять ожидания"]
    };
    
    setTimeout(async () => {
      try {
        const calculationData: PartnershipCalculation = {
          type: 'partnership',
          clientName,
          birthDate,
          partnerName,
          partnerBirthDate,
          results,
        };
        
        const calculation = await createCalculation(calculationData);
        
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
        <h1 className="text-2xl font-bold tracking-tight">Партнерский расчет</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Данные для анализа совместимости</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Первый человек</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">ФИО</Label>
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
              </div>
            </div>

            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Второй человек</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="partnerName">ФИО</Label>
                  <Input
                    id="partnerName"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Петрова Мария Ивановна"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerBirthDate">Дата рождения</Label>
                  <Input
                    id="partnerBirthDate"
                    type="date"
                    value={partnerBirthDate}
                    onChange={(e) => setPartnerBirthDate(e.target.value)}
                  />
                </div>
              </div>
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

export default PartnershipCalculationForm;
