import { useNavigate, useParams } from "react-router-dom";
import { useCalculations } from "@/contexts/CalculationsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, File, User } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";
import { BasicCalculation } from "@/types";
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";
import { AIContentSection } from "@/components/AIContentSection";
import { AIChat } from "@/components/AIChat";
import { NoteEditor } from "@/components/NoteEditor";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const CalculationResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCalculation } = useCalculations();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const calculation = id ? getCalculation(id) : undefined;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: ru });
    } catch {
      return dateString;
    }
  };
  
  const getCalculationTitle = () => {
    switch (calculation?.type) {
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
  
  // Get archetypes from the calculation
  const getArchetypes = (): ArchetypeDescription[] => {
    if (!calculation || calculation.type !== 'basic') return [];
    
    const typedCalculation = calculation as (BasicCalculation & { id: string; createdAt: string });
    return typedCalculation.results.archetypeDescriptions || [];
  };
  
  // Get title for code
  const getCodeTitle = (codeType: NumerologyCodeType): string => {
    switch (codeType) {
      case 'personality':
        return 'Код Личности';
      case 'connector':
        return 'Код Коннектора';
      case 'realization':
        return 'Код Реализации';
      case 'generator':
        return 'Код Генератора';
      case 'mission':
        return 'Код Миссии';
      default:
        return '';
    }
  };
  
  // Render archetype details
  const renderArchetypeDetails = (archetype: ArchetypeDescription | undefined) => {
    if (!archetype) {
      return (
        <div className="text-center text-muted-foreground py-4">
          Описание архетипа не найдено
        </div>
      );
    }

    // Отображаем соответствующее содержимое в зависимости от типа кода
    switch (archetype.code) {
      case 'personality':
        return (
          <div className="space-y-4">
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
          </div>
        );
        
      case 'connector':
        return (
          <div className="space-y-4">
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
          </div>
        );
        
      case 'realization':
        return (
          <div className="space-y-4">
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
          </div>
        );
        
      case 'generator':
        return (
          <div className="space-y-4">
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
          </div>
        );
        
      case 'mission':
        return (
          <div className="space-y-4">
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
          </div>
        );
        
      default:
        return (
          <div className="text-center text-muted-foreground py-4">
            Данные для этого типа кода отсутствуют
          </div>
        );
    }
  };
  
  const renderBasicResults = () => {
    const archetypes = getArchetypes();
    
    // Check if this is a basic calculation
    if (!calculation || calculation.type !== 'basic') {
      return <div>Неподдерживаемый тип расчета</div>;
    }
    
    const typedCalculation = calculation as (BasicCalculation & { id: string; createdAt: string });
    const { fullCodes } = typedCalculation.results;
    
    if (!fullCodes) {
      return <div>Нумерологические коды не найдены</div>;
    }
    
    const toggleSection = (section: string) => {
      if (activeSection === section) {
        setActiveSection(null);
      } else {
        setActiveSection(section);
      }
    };
    
    // Find archetype by code
    const findArchetype = (code: NumerologyCodeType): ArchetypeDescription | undefined => {
      return archetypes.find(arch => arch.code === code);
    };
    
    return (
      <div className="space-y-6">
        {/* Profile (renamed from "Нумерологические коды") */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Профиль</CardTitle>
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
        
        {/* Summary */}
        {archetypes.length > 0 && (
          <AIContentSection 
            title="Саммари" 
            type="summary"
            archetypes={archetypes} 
          />
        )}
        
        {/* Consultation Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Консультация</h2>
          
          {/* Кнопки в одну линию */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeSection === 'strengths-weaknesses' ? "secondary" : "outline"} 
              onClick={() => toggleSection('strengths-weaknesses')}
              className="flex-1"
            >
              Сильные и слабые стороны
            </Button>
            
            <Button 
              variant={activeSection === 'code-conflicts' ? "secondary" : "outline"} 
              onClick={() => toggleSection('code-conflicts')}
              className="flex-1"
            >
              Конфликты кодов
            </Button>
            
            <Button 
              variant={activeSection === 'potential-problems' ? "secondary" : "outline"} 
              onClick={() => toggleSection('potential-problems')}
              className="flex-1"
            >
              Потенциальные проблемы
            </Button>
            
            <Button 
              variant={activeSection === 'practices' ? "secondary" : "outline"} 
              onClick={() => toggleSection('practices')}
              className="flex-1"
            >
              Практики
            </Button>
            
            <Button 
              variant={activeSection === 'assistant' ? "secondary" : "outline"} 
              onClick={() => toggleSection('assistant')}
              className="flex-1"
            >
              Помощник
            </Button>
          </div>
          
          {/* Контент секций */}
          {activeSection === 'strengths-weaknesses' && (
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && (
                  <AIContentSection 
                    title=""
                    type="strengths-weaknesses"
                    archetypes={archetypes} 
                  />
                )}
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'code-conflicts' && (
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && (
                  <AIContentSection 
                    title=""
                    type="code-conflicts"
                    archetypes={archetypes} 
                  />
                )}
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'potential-problems' && (
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && (
                  <AIContentSection 
                    title=""
                    type="potential-problems"
                    archetypes={archetypes} 
                  />
                )}
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'practices' && (
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && (
                  <AIContentSection 
                    title=""
                    type="practices"
                    archetypes={archetypes} 
                  />
                )}
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'assistant' && (
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && (
                  <AIChat archetypes={archetypes} />
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Textbook Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Учебник</h2>
          
          {/* Кнопки в одну линию */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeSection === 'personality' ? "secondary" : "outline"} 
              onClick={() => toggleSection('personality')}
              className="flex-1"
            >
              Код Личности {fullCodes.personalityCode}
            </Button>
            
            <Button 
              variant={activeSection === 'connector' ? "secondary" : "outline"} 
              onClick={() => toggleSection('connector')}
              className="flex-1"
            >
              Код Коннектора {fullCodes.connectorCode}
            </Button>
            
            <Button 
              variant={activeSection === 'realization' ? "secondary" : "outline"} 
              onClick={() => toggleSection('realization')}
              className="flex-1"
            >
              Код Реализации {fullCodes.realizationCode}
            </Button>
            
            <Button 
              variant={activeSection === 'generator' ? "secondary" : "outline"} 
              onClick={() => toggleSection('generator')}
              className="flex-1"
            >
              Код Генератора {fullCodes.generatorCode}
            </Button>
            
            <Button 
              variant={activeSection === 'mission' ? "secondary" : "outline"} 
              onClick={() => toggleSection('mission')}
              className="flex-1"
            >
              Код Миссии {fullCodes.missionCode}
            </Button>
          </div>
          
          {/* Контент секций */}
          {activeSection === 'personality' && (
            <Card>
              <CardContent className="pt-6">
                {renderArchetypeDetails(findArchetype('personality'))}
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'connector' && (
            <Card>
              <CardContent className="pt-6">
                {renderArchetypeDetails(findArchetype('connector'))}
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'realization' && (
            <Card>
              <CardContent className="pt-6">
                {renderArchetypeDetails(findArchetype('realization'))}
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'generator' && (
            <Card>
              <CardContent className="pt-6">
                {renderArchetypeDetails(findArchetype('generator'))}
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'mission' && (
            <Card>
              <CardContent className="pt-6">
                {renderArchetypeDetails(findArchetype('mission'))}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Notes Section */}
        {id && (
          <div className="space-y-4">
            <NoteEditor calculationId={id} />
          </div>
        )}
      </div>
    );
  };
  
  const renderPartnershipResults = () => {
    const typedCalculation = calculation as any;
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
    const typedCalculation = calculation as any;
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
    switch (calculation?.type) {
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

  if (!calculation) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="text-center text-muted-foreground">
          <p className="text-lg">Расчет не найден</p>
          <Button
            variant="link"
            className="mt-4"
            onClick={() => navigate("/calculations")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться к расчетам
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => navigate("/calculations")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к расчетам
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">{getCalculationTitle()}</h1>
            <div className="flex items-center text-muted-foreground mt-1 text-sm">
              <User size={14} className="mr-1" />
              <span className="mr-4">{calculation.clientName}</span>
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(calculation.birthDate)}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground flex items-center">
            <File size={14} className="mr-1" />
            <span>{formatDate(calculation.createdAt)}</span>
          </div>
        </div>
      </div>
      
      {renderResults()}
    </div>
  );
};

export default CalculationResult;
