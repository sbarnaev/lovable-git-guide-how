import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCalculations } from "@/contexts/calculations";
import { toast } from "sonner";
import { calculateAllCodes } from "@/utils/numerologyCalculator";
import { getArchetypeDescriptions } from "@/utils/archetypeDescriptions";
import { ArchetypePreview } from "@/components/archetypes/ArchetypePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NumerologyCodeType } from "@/types/numerology";

const BasicCalculationForm = () => {
  const navigate = useNavigate();
  const { addCalculation } = useCalculations();
  
  const [clientName, setClientName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewCodes, setPreviewCodes] = useState<{
    personalityCode: number;
    connectorCode: number;
    realizationCode: number;
    generatorCode: number;
    missionCode: number;
  } | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState("personality");

  const handleCalculatePreview = () => {
    if (!birthDate) {
      toast.error("Пожалуйста, введите дату рождения для предварительного просмотра");
      return;
    }
    
    try {
      const codes = calculateAllCodes(birthDate);
      setPreviewCodes(codes);
      toast.success("Коды рассчитаны успешно");
    } catch (error) {
      toast.error("Ошибка расчета кодов. Проверьте правильность даты рождения.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !birthDate) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const codes = calculateAllCodes(birthDate);
      
      // Fetch archetype descriptions
      const archetypeDescriptions = await getArchetypeDescriptions([
        { type: 'personality', value: codes.personalityCode },
        { type: 'connector', value: codes.connectorCode },
        { type: 'realization', value: codes.realizationCode },
        { type: 'generator', value: codes.generatorCode },
        { type: 'mission', value: codes.missionCode },
      ]);
      
      // Извлекаем ключевые качества и искажения для результатов
      let strengths: string[] = [];
      let challenges: string[] = [];
      let recommendations: string[] = [];
      
      if (archetypeDescriptions.length > 0) {
        strengths = archetypeDescriptions
          .flatMap(desc => desc.resourceQualities || [])
          .slice(0, 5);
        
        challenges = archetypeDescriptions
          .flatMap(desc => desc.keyDistortions || [])
          .slice(0, 3);
        
        recommendations = archetypeDescriptions
          .flatMap(desc => desc.recommendations || [])
          .slice(0, 5);
      }
      
      // Создаем расчет с полученными данными
      const calculationData = {
        type: 'basic' as const,
        clientName,
        birthDate,
        results: {
          numerology: {
            lifePath: codes.personalityCode,
            destiny: codes.missionCode,
            personality: codes.connectorCode,
          },
          strengths: strengths.length > 0 ? strengths : ["Аналитический ум", "Творческое мышление", "Лидерские качества"],
          challenges: challenges.length > 0 ? challenges : ["Нетерпеливость", "Перфекционизм"],
          recommendations: recommendations.length > 0 ? recommendations : ["Развивать эмпатию", "Практиковать осознанность", "Работать над коммуникацией"],
          fullCodes: codes,
          archetypeDescriptions
        },
      };
      
      const newCalculation = await addCalculation(calculationData);
      toast.success("Расчет успешно создан");
      
      // Navigate directly to the calculation result page
      navigate(`/calculations/${newCalculation.id}`);
    } catch (error) {
      toast.error("Не удалось создать расчет");
      console.error("Ошибка при создании расчета:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
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
            
            <div className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCalculatePreview}
                className="w-full"
              >
                Предварительный просмотр
              </Button>
            </div>
          </CardContent>
          
          {previewCodes && (
            <CardContent>
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Результаты расчета</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2 text-center mb-4">
                    <div className="p-2 bg-background rounded-md shadow-sm">
                      <div className="font-bold text-xl text-numerica">{previewCodes.personalityCode}</div>
                      <div className="text-xs">Код Личности</div>
                    </div>
                    <div className="p-2 bg-background rounded-md shadow-sm">
                      <div className="font-bold text-xl text-numerica">{previewCodes.connectorCode}</div>
                      <div className="text-xs">Код Коннектора</div>
                    </div>
                    <div className="p-2 bg-background rounded-md shadow-sm">
                      <div className="font-bold text-xl text-numerica">{previewCodes.realizationCode}</div>
                      <div className="text-xs">Код Реализации</div>
                    </div>
                    <div className="p-2 bg-background rounded-md shadow-sm">
                      <div className="font-bold text-xl text-numerica">{previewCodes.generatorCode}</div>
                      <div className="text-xs">Код Генератора</div>
                    </div>
                    <div className="p-2 bg-background rounded-md shadow-sm">
                      <div className="font-bold text-xl text-numerica">{previewCodes.missionCode}</div>
                      <div className="text-xs">Код Миссии</div>
                    </div>
                  </div>
                  
                  <Tabs value={activePreviewTab} onValueChange={setActivePreviewTab}>
                    <TabsList className="grid grid-cols-5 mb-4 w-full">
                      <TabsTrigger value="personality">Личность</TabsTrigger>
                      <TabsTrigger value="connector">Коннектор</TabsTrigger>
                      <TabsTrigger value="realization">Реализация</TabsTrigger>
                      <TabsTrigger value="generator">Генератор</TabsTrigger>
                      <TabsTrigger value="mission">Миссия</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="personality">
                      <ArchetypePreview selectedCode="personalityCode" selectedValue={previewCodes.personalityCode} />
                    </TabsContent>
                    
                    <TabsContent value="connector">
                      <ArchetypePreview selectedCode="connectorCode" selectedValue={previewCodes.connectorCode} />
                    </TabsContent>
                    
                    <TabsContent value="realization">
                      <ArchetypePreview selectedCode="realizationCode" selectedValue={previewCodes.realizationCode} />
                    </TabsContent>
                    
                    <TabsContent value="generator">
                      <ArchetypePreview selectedCode="generatorCode" selectedValue={previewCodes.generatorCode} />
                    </TabsContent>
                    
                    <TabsContent value="mission">
                      <ArchetypePreview selectedCode="missionCode" selectedValue={previewCodes.missionCode} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </CardContent>
          )}
          
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
