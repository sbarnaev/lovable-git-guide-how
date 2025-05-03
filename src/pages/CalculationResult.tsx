
import { useNavigate, useParams } from "react-router-dom";
import { useCalculations } from "@/contexts/CalculationsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, File, User } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { BasicCalculation, BasicCalculationResults, Calculation, PartnershipCalculation, TargetCalculation } from "@/types";
import { getArchetypeDescription } from "@/utils/archetypeDescriptions";
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";

const CalculationResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCalculation } = useCalculations();
  const [activeArchetypeTab, setActiveArchetypeTab] = useState<NumerologyCodeType>("personality");
  
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
    // Приведение типа calculation к BasicCalculation
    const typedCalculation = calculation as (BasicCalculation & { id: string; createdAt: string });
    const { numerology, strengths, challenges, recommendations, fullCodes } = typedCalculation.results;

    // Получаем архетипы для каждого кода, если они есть в базе
    const archetypes: Record<NumerologyCodeType, ArchetypeDescription | undefined> = {
      personality: fullCodes ? getArchetypeDescription('personality', fullCodes.personalityCode) : undefined,
      connector: fullCodes ? getArchetypeDescription('connector', fullCodes.connectorCode) : undefined,
      realization: fullCodes ? getArchetypeDescription('realization', fullCodes.realizationCode) : undefined,
      generator: fullCodes ? getArchetypeDescription('generator', fullCodes.generatorCode) : undefined,
      mission: fullCodes ? getArchetypeDescription('mission', fullCodes.missionCode) : undefined
    };
    
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
        
        {fullCodes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Нумерологические коды</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-numerica">{fullCodes.personalityCode}</div>
                  <div className="text-sm text-muted-foreground">Код Личности</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-numerica">{fullCodes.connectorCode}</div>
                  <div className="text-sm text-muted-foreground">Код Коннектора</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-numerica">{fullCodes.realizationCode}</div>
                  <div className="text-sm text-muted-foreground">Код Реализации</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-numerica">{fullCodes.generatorCode}</div>
                  <div className="text-sm text-muted-foreground">Код Генератора</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-numerica">{fullCodes.missionCode}</div>
                  <div className="text-sm text-muted-foreground">Код Миссии</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
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
        
        {fullCodes && (
          <div>
            <h2 className="text-xl font-bold mb-4">Подробные архетипы</h2>
            
            <Tabs value={activeArchetypeTab} onValueChange={(value: NumerologyCodeType) => setActiveArchetypeTab(value)}>
              <TabsList className="grid grid-cols-5 mb-4 w-full">
                <TabsTrigger value="personality">
                  Личность {fullCodes.personalityCode}
                </TabsTrigger>
                <TabsTrigger value="connector">
                  Коннектор {fullCodes.connectorCode}
                </TabsTrigger>
                <TabsTrigger value="realization">
                  Реализация {fullCodes.realizationCode}
                </TabsTrigger>
                <TabsTrigger value="generator">
                  Генератор {fullCodes.generatorCode}
                </TabsTrigger>
                <TabsTrigger value="mission">
                  Миссия {fullCodes.missionCode}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personality">
                {renderArchetypeDetails(archetypes.personality)}
              </TabsContent>
              
              <TabsContent value="connector">
                {renderArchetypeDetails(archetypes.connector)}
              </TabsContent>
              
              <TabsContent value="realization">
                {renderArchetypeDetails(archetypes.realization)}
              </TabsContent>
              
              <TabsContent value="generator">
                {renderArchetypeDetails(archetypes.generator)}
              </TabsContent>
              
              <TabsContent value="mission">
                {renderArchetypeDetails(archetypes.mission)}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    );
  };
  
  const renderArchetypeDetails = (archetype: ArchetypeDescription | undefined) => {
    if (!archetype) {
      return (
        <Card>
          <CardContent className="py-4">
            <div className="text-center text-muted-foreground">
              Описание архетипа не найдено
            </div>
          </CardContent>
        </Card>
      );
    }

    // Отображаем соответствующее содержимое в зависимости от типа кода
    switch (archetype.code) {
      case 'personality':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{archetype.title || `Архетип личности ${archetype.value}`}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {archetype.description && (
                <div>
                  <h3 className="font-medium mb-2">Описание:</h3>
                  <p>{archetype.description}</p>
                </div>
              )}
              
              {archetype.resourceManifestation && (
                <div>
                  <h3 className="font-medium mb-2">Ресурсное проявление:</h3>
                  <p>{archetype.resourceManifestation}</p>
                </div>
              )}
              
              {archetype.distortedManifestation && (
                <div>
                  <h3 className="font-medium mb-2">Искаженное проявление:</h3>
                  <p>{archetype.distortedManifestation}</p>
                </div>
              )}
              
              {archetype.developmentTask && (
                <div>
                  <h3 className="font-medium mb-2">Задача развития:</h3>
                  <p>{archetype.developmentTask}</p>
                </div>
              )}
              
              {archetype.resourceQualities && archetype.resourceQualities.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Ключевые качества в ресурсе:</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.resourceQualities.map((quality, idx) => (
                      <li key={idx}>{quality}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {archetype.keyDistortions && archetype.keyDistortions.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Ключевые искажения:</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.keyDistortions.map((distortion, idx) => (
                      <li key={idx}>{distortion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case 'connector':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{archetype.title || `Архетип коннектора ${archetype.value}`}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {archetype.description && (
                <div>
                  <h3 className="font-medium mb-2">Описание:</h3>
                  <p>{archetype.description}</p>
                </div>
              )}
              
              {archetype.keyTask && (
                <div>
                  <h3 className="font-medium mb-2">Ключевая задача:</h3>
                  <p>{archetype.keyTask}</p>
                </div>
              )}
              
              {archetype.workingAspects && archetype.workingAspects.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Что работает (в ресурсе):</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.workingAspects.map((aspect, idx) => (
                      <li key={idx}>{aspect}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {archetype.nonWorkingAspects && archetype.nonWorkingAspects.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Что не работает (искажения):</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.nonWorkingAspects.map((aspect, idx) => (
                      <li key={idx}>{aspect}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {archetype.worldContactBasis && (
                <div>
                  <h3 className="font-medium mb-2">Контакт с миром должен строиться на:</h3>
                  <p>{archetype.worldContactBasis}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case 'realization':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{archetype.title || `Архетип реализации ${archetype.value}`}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {archetype.description && (
                <div>
                  <h3 className="font-medium mb-2">Описание:</h3>
                  <p>{archetype.description}</p>
                </div>
              )}
              
              {archetype.formula && (
                <div>
                  <h3 className="font-medium mb-2">Формула:</h3>
                  <p>{archetype.formula}</p>
                </div>
              )}
              
              {archetype.potentialRealizationWays && archetype.potentialRealizationWays.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Как реализуется потенциал:</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.potentialRealizationWays.map((way, idx) => (
                      <li key={idx}>{way}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {archetype.successSources && archetype.successSources.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Где находится источник дохода и успеха:</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.successSources.map((source, idx) => (
                      <li key={idx}>{source}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {archetype.realizationType && (
                <div>
                  <h3 className="font-medium mb-2">Тип реализации:</h3>
                  <p>{archetype.realizationType}</p>
                </div>
              )}
              
              {archetype.realizationObstacles && archetype.realizationObstacles.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Искажения (что мешает реализовываться):</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.realizationObstacles.map((obstacle, idx) => (
                      <li key={idx}>{obstacle}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {archetype.recommendations && archetype.recommendations.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Рекомендации:</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.recommendations.map((recommendation, idx) => (
                      <li key={idx}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case 'generator':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{archetype.title || `Архетип генератора ${archetype.value}`}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {archetype.description && (
                <div>
                  <h3 className="font-medium mb-2">Описание:</h3>
                  <p>{archetype.description}</p>
                </div>
              )}
              
              {archetype.generatorFormula && (
                <div>
                  <h3 className="font-medium mb-2">Формула:</h3>
                  <p>{archetype.generatorFormula}</p>
                </div>
              )}
              
              {archetype.energySources && archetype.energySources.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Что дает энергию:</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.energySources.map((source, idx) => (
                      <li key={idx}>{source}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {archetype.energyDrains && archetype.energyDrains.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Что забирает энергию:</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.energyDrains.map((drain, idx) => (
                      <li key={idx}>{drain}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {archetype.flowSigns && archetype.flowSigns.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Признаки, что человек в потоке:</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.flowSigns.map((sign, idx) => (
                      <li key={idx}>{sign}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {archetype.burnoutSigns && archetype.burnoutSigns.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Признаки, что человек выгорел:</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.burnoutSigns.map((sign, idx) => (
                      <li key={idx}>{sign}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {archetype.generatorRecommendation && (
                <div>
                  <h3 className="font-medium mb-2">Рекомендация:</h3>
                  <p>{archetype.generatorRecommendation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case 'mission':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{archetype.title || `Архетип миссии ${archetype.value}`}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {archetype.description && (
                <div>
                  <h3 className="font-medium mb-2">Описание:</h3>
                  <p>{archetype.description}</p>
                </div>
              )}
              
              {archetype.missionEssence && (
                <div>
                  <h3 className="font-medium mb-2">Суть миссии:</h3>
                  <p>{archetype.missionEssence}</p>
                </div>
              )}
              
              {archetype.missionRealizationFactors && archetype.missionRealizationFactors.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Что реализует миссию:</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.missionRealizationFactors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {archetype.missionChallenges && (
                <div>
                  <h3 className="font-medium mb-2">Испытания миссии:</h3>
                  <p>{archetype.missionChallenges}</p>
                </div>
              )}
              
              {archetype.missionObstacles && archetype.missionObstacles.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Что мешает реализовываться:</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    {archetype.missionObstacles.map((obstacle, idx) => (
                      <li key={idx}>{obstacle}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {archetype.mainTransformation && (
                <div>
                  <h3 className="font-medium mb-2">Главная трансформация:</h3>
                  <p>{archetype.mainTransformation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <Card>
            <CardContent className="py-4">
              <div className="text-center text-muted-foreground">
                Данные для этого типа кода отсутствуют
              </div>
            </CardContent>
          </Card>
        );
    }
  };
  
  const renderPartnershipResults = () => {
    // Приведение типа calculation к PartnershipCalculation
    const typedCalculation = calculation as (PartnershipCalculation & { id: string; createdAt: string });
    const { compatibility, strengths, challenges, recommendations } = typedCalculation.results;
    
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
    // Приведение типа calculation к TargetCalculation
    const typedCalculation = calculation as (TargetCalculation & { id: string; createdAt: string });
    const { analysis, recommendations, timeframe } = typedCalculation.results;
    
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
                  <div>{(calculation as PartnershipCalculation).partnerName}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Дата рождения партнера:</span>
                  </div>
                  <div>{formatDate((calculation as PartnershipCalculation).partnerBirthDate || '')}</div>
                </div>
              </>
            )}
            
            {calculation.type === 'target' && (
              <div className="col-span-full space-y-1">
                <div className="text-sm font-medium">Запрос:</div>
                <div className="text-sm p-3 bg-muted rounded-md">{(calculation as TargetCalculation).targetQuery}</div>
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
