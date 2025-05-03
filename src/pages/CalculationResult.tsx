import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, User } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useCalculations } from '@/contexts/CalculationsContext';
import { BasicCalculation, Calculation } from '@/types';
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';
import { AIContentSection } from '@/components/AIContentSection';
import { AIChat } from '@/components/AIChat';
import { NoteEditor } from '@/components/NoteEditor';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const CalculationResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCalculation } = useCalculations();
  const [calculation, setCalculation] = useState<Calculation | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [archetypes, setArchetypes] = useState<ArchetypeDescription[]>([]);
  
  useEffect(() => {
    const fetchCalculation = async () => {
      if (!id) {
        setError('Calculation ID is missing.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const fetchedCalculation = getCalculation(id);
        if (fetchedCalculation) {
          setCalculation(fetchedCalculation);
          
          // If it's a basic calculation with archetypeDescriptions, use those
          if (fetchedCalculation.type === 'basic') {
            const basicCalc = fetchedCalculation as (BasicCalculation & { id: string; createdAt: string });
            if (basicCalc.results.archetypeDescriptions) {
              setArchetypes(basicCalc.results.archetypeDescriptions);
            }
          }
        } else {
          setError('Calculation not found.');
        }
      } catch (err) {
        console.error('Error fetching calculation:', err);
        setError('Failed to load calculation.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCalculation();
  }, [id, getCalculation]);
  
  const getArchetypes = (): ArchetypeDescription[] => {
    if (!calculation || calculation.type !== 'basic') {
      return [];
    }
    
    return archetypes;
  };
  
  const findArchetype = (code: NumerologyCodeType): ArchetypeDescription | undefined => {
    if (!archetypes || archetypes.length === 0) {
      console.log("Archetypes array is empty or undefined");
      return undefined;
    }
    
    console.log("Looking for code:", code);
    console.log("Available archetypes:", archetypes.map(a => a.code));
    
    const codeMap: Record<string, NumerologyCodeType> = {
      'personality': 'personality',
      'connector': 'connector',
      'realization': 'realization',
      'generator': 'generator',
      'mission': 'mission'
    };
    
    const searchCode = codeMap[code] || code;
    return archetypes.find(arch => arch.code === searchCode);
  };
  
  const renderArchetypeDetails = (archetype: ArchetypeDescription | undefined) => {
    if (!archetype) {
      return <div className="text-muted-foreground">Информация отсутствует.</div>;
    }
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{archetype.title}</h3>
        <p className="text-sm">{archetype.description}</p>
        
        {archetype.resourceQualities && archetype.resourceQualities.length > 0 && (
          <div>
            <h4 className="text-md font-semibold">Ресурсные качества:</h4>
            <ul className="list-disc pl-5 text-sm">
              {archetype.resourceQualities.map((quality, index) => (
                <li key={index}>{quality}</li>
              ))}
            </ul>
          </div>
        )}
        
        {archetype.keyDistortions && archetype.keyDistortions.length > 0 && (
          <div>
            <h4 className="text-md font-semibold">Ключевые искажения:</h4>
            <ul className="list-disc pl-5 text-sm">
              {archetype.keyDistortions.map((distortion, index) => (
                <li key={index}>{distortion}</li>
              ))}
            </ul>
          </div>
        )}
        
        {archetype.recommendations && archetype.recommendations.length > 0 && (
          <div>
            <h4 className="text-md font-semibold">Рекомендации:</h4>
            <ul className="list-disc pl-5 text-sm">
              {archetype.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}

        {archetype.code === 'personality' && (
          <>
            {archetype.resourceManifestation && (
              <div>
                <h4 className="text-md font-semibold">Ресурсное проявление:</h4>
                <p className="text-sm">{archetype.resourceManifestation}</p>
              </div>
            )}
            {archetype.distortedManifestation && (
              <div>
                <h4 className="text-md font-semibold">Искаженное проявление:</h4>
                <p className="text-sm">{archetype.distortedManifestation}</p>
              </div>
            )}
            {archetype.developmentTask && (
              <div>
                <h4 className="text-md font-semibold">Задача развития:</h4>
                <p className="text-sm">{archetype.developmentTask}</p>
              </div>
            )}
          </>
        )}
        
        {archetype.code === 'connector' && (
          <>
            {archetype.keyTask && (
              <div>
                <h4 className="text-md font-semibold">Ключевая задача:</h4>
                <p className="text-sm">{archetype.keyTask}</p>
              </div>
            )}
            {archetype.workingAspects && archetype.workingAspects.length > 0 && (
              <div>
                <h4 className="text-md font-semibold">Что работает (в ресурсе):</h4>
                <ul className="list-disc pl-5 text-sm">
                  {archetype.workingAspects.map((aspect, index) => (
                    <li key={index}>{aspect}</li>
                  ))}
                </ul>
              </div>
            )}
            {archetype.nonWorkingAspects && archetype.nonWorkingAspects.length > 0 && (
              <div>
                <h4 className="text-md font-semibold">Что не работает (искажения):</h4>
                <ul className="list-disc pl-5 text-sm">
                  {archetype.nonWorkingAspects.map((aspect, index) => (
                    <li key={index}>{aspect}</li>
                  ))}
                </ul>
              </div>
            )}
            {archetype.worldContactBasis && (
              <div>
                <h4 className="text-md font-semibold">Контакт с миром должен строиться на:</h4>
                <p className="text-sm">{archetype.worldContactBasis}</p>
              </div>
            )}
          </>
        )}
        
        {archetype.code === 'realization' && (
          <>
            {archetype.formula && (
              <div>
                <h4 className="text-md font-semibold">Формула:</h4>
                <p className="text-sm">{archetype.formula}</p>
              </div>
            )}
            {archetype.potentialRealizationWays && archetype.potentialRealizationWays.length > 0 && (
              <div>
                <h4 className="text-md font-semibold">Как реализуется потенциал:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {archetype.potentialRealizationWays.map((way, index) => (
                    <li key={index}>{way}</li>
                  ))}
                </ul>
              </div>
            )}
            {archetype.successSources && archetype.successSources.length > 0 && (
              <div>
                <h4 className="text-md font-semibold">Источники успеха:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {archetype.successSources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
            {archetype.realizationType && (
              <div>
                <h4 className="text-md font-semibold">Тип реализации:</h4>
                <p className="text-sm">{archetype.realizationType}</p>
              </div>
            )}
            {archetype.realizationObstacles && archetype.realizationObstacles.length > 0 && (
              <div>
                <h4 className="text-md font-semibold">Искажения (что мешает реализовываться):</h4>
                <ul className="list-disc pl-5 text-sm">
                  {archetype.realizationObstacles.map((obstacle, index) => (
                    <li key={index}>{obstacle}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
        
        {archetype.code === 'generator' && (
          <>
            {archetype.generatorFormula && (
              <div>
                <h4 className="text-md font-semibold">Формула:</h4>
                <p className="text-sm">{archetype.generatorFormula}</p>
              </div>
            )}
            {archetype.energySources && archetype.energySources.length > 0 && (
              <div>
                <h4 className="text-md font-semibold">Что дает энергию:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {archetype.energySources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
            {archetype.energyDrains && archetype.energyDrains.length > 0 && (
              <div>
                <h4 className="text-md font-semibold">Что забирает энергию:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {archetype.energyDrains.map((drain, index) => (
                    <li key={index}>{drain}</li>
                  ))}
                </ul>
              </div>
            )}
            {archetype.flowSigns && archetype.flowSigns.length > 0 && (
              <div>
                <h4 className="text-md font-semibold">Признаки, что человек в потоке:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {archetype.flowSigns.map((sign, index) => (
                    <li key={index}>{sign}</li>
                  ))}
                </ul>
              </div>
            )}
            {archetype.burnoutSigns && archetype.burnoutSigns.length > 0 && (
              <div>
                <h4 className="text-md font-semibold">Признаки, что человек выгорел:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {archetype.burnoutSigns.map((sign, index) => (
                    <li key={index}>{sign}</li>
                  ))}
                </ul>
              </div>
            )}
            {archetype.generatorRecommendation && (
              <div>
                <h4 className="text-md font-semibold">Рекомендация:</h4>
                <p className="text-sm">{archetype.generatorRecommendation}</p>
              </div>
            )}
          </>
        )}
        
        {archetype.code === 'mission' && (
          <>
            {archetype.missionEssence && (
              <div>
                <h4 className="text-md font-semibold">Суть миссии:</h4>
                <p className="text-sm">{archetype.missionEssence}</p>
              </div>
            )}
            {archetype.missionRealizationFactors && archetype.missionRealizationFactors.length > 0 && (
              <div>
                <h4 className="text-md font-semibold">Что реализует миссию:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {archetype.missionRealizationFactors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
            {archetype.missionChallenges && (
              <div>
                <h4 className="text-md font-semibold">Испытания миссии:</h4>
                <p className="text-sm">{archetype.missionChallenges}</p>
              </div>
            )}
            {archetype.missionObstacles && archetype.missionObstacles.length > 0 && (
              <div>
                <h4 className="text-md font-semibold">Что мешает реализовываться:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {archetype.missionObstacles.map((obstacle, index) => (
                    <li key={index}>{obstacle}</li>
                  ))}
                </ul>
              </div>
            )}
            {archetype.mainTransformation && (
              <div>
                <h4 className="text-md font-semibold">Главная трансформация:</h4>
                <p className="text-sm">{archetype.mainTransformation}</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderPartnershipResults = () => {
    return (
      <div className="text-center p-4">
        <div className="text-muted-foreground">Расчет партнерства в разработке.</div>
      </div>
    );
  };

  const renderTargetResults = () => {
    return (
      <div className="text-center p-4">
        <div className="text-muted-foreground">Целевой расчет в разработке.</div>
      </div>
    );
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
          
          {/* Buttons in a horizontal row */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeSection === 'strengths-weaknesses' ? 'default' : 'outline'}
              onClick={() => toggleSection('strengths-weaknesses')}
              className="flex-grow md:flex-grow-0"
            >
              Сильные и слабые стороны
            </Button>
            
            <Button 
              variant={activeSection === 'code-conflicts' ? 'default' : 'outline'}
              onClick={() => toggleSection('code-conflicts')}
              className="flex-grow md:flex-grow-0"
            >
              Конфликты кодов
            </Button>
            
            <Button 
              variant={activeSection === 'potential-problems' ? 'default' : 'outline'}
              onClick={() => toggleSection('potential-problems')}
              className="flex-grow md:flex-grow-0"
            >
              Потенциальные проблемы
            </Button>
            
            <Button 
              variant={activeSection === 'practices' ? 'default' : 'outline'}
              onClick={() => toggleSection('practices')}
              className="flex-grow md:flex-grow-0"
            >
              Практики
            </Button>
            
            <Button 
              variant={activeSection === 'assistant' ? 'default' : 'outline'}
              onClick={() => toggleSection('assistant')}
              className="flex-grow md:flex-grow-0"
            >
              Помощник
            </Button>
          </div>
          
          {/* Content panel based on active section */}
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
          
          {/* Buttons in a horizontal row */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeSection === 'personality' ? 'default' : 'outline'}
              onClick={() => toggleSection('personality')}
              className="flex-grow md:flex-grow-0"
            >
              Код Личности {fullCodes.personalityCode}
            </Button>
            
            <Button 
              variant={activeSection === 'connector' ? 'default' : 'outline'}
              onClick={() => toggleSection('connector')}
              className="flex-grow md:flex-grow-0"
            >
              Код Коннектора {fullCodes.connectorCode}
            </Button>
            
            <Button 
              variant={activeSection === 'realization' ? 'default' : 'outline'}
              onClick={() => toggleSection('realization')}
              className="flex-grow md:flex-grow-0"
            >
              Код Реализации {fullCodes.realizationCode}
            </Button>
            
            <Button 
              variant={activeSection === 'generator' ? 'default' : 'outline'}
              onClick={() => toggleSection('generator')}
              className="flex-grow md:flex-grow-0"
            >
              Код Генератора {fullCodes.generatorCode}
            </Button>
            
            <Button 
              variant={activeSection === 'mission' ? 'default' : 'outline'}
              onClick={() => toggleSection('mission')}
              className="flex-grow md:flex-grow-0"
            >
              Код Миссии {fullCodes.missionCode}
            </Button>
          </div>
          
          {/* Content panel based on active section */}
          {(activeSection === 'personality' || activeSection === 'connector' || 
            activeSection === 'realization' || activeSection === 'generator' || 
            activeSection === 'mission') && (
            <Card>
              <CardContent className="pt-6">
                {renderArchetypeDetails(findArchetype(activeSection as NumerologyCodeType))}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-numerica border-t-transparent rounded-full mr-3"></div>
        Загрузка расчета...
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        Ошибка: {error}
      </div>
    );
  }
  
  if (!calculation) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Расчет не найден.
      </div>
    );
  }
  
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
        <h1 className="text-2xl font-bold tracking-tight">
          Результат расчета
        </h1>
      </div>
      
      {calculation.type === 'basic' ? (
        renderBasicResults()
      ) : calculation.type === 'partnership' ? (
        renderPartnershipResults()
      ) : calculation.type === 'target' ? (
        renderTargetResults()
      ) : (
        <div>Неподдерживаемый тип расчета</div>
      )}
    </div>
  );
};

export default CalculationResult;
