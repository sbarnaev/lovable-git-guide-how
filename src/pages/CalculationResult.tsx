
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
import { NoteEditor } from '@/components/note-editor';
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
        <h3 className="text-xl font-semibold">{archetype.title}</h3>
        
        {archetype.description && (
          <div className="prose prose-slate max-w-none text-sm">
            <p>{archetype.description}</p>
          </div>
        )}
        
        {/* Personality specific fields */}
        {archetype.code === 'personality' && (
          <>
            {archetype.resourceManifestation && (
              <div className="space-y-1">
                <h4 className="text-md font-semibold">Ресурсное проявление:</h4>
                <p className="text-sm bg-green-50 p-3 rounded-md border border-green-200">{archetype.resourceManifestation}</p>
              </div>
            )}
            
            {archetype.distortedManifestation && (
              <div className="space-y-1">
                <h4 className="text-md font-semibold">Искаженное проявление:</h4>
                <p className="text-sm bg-red-50 p-3 rounded-md border border-red-200">{archetype.distortedManifestation}</p>
              </div>
            )}
            
            {archetype.developmentTask && (
              <div className="space-y-1">
                <h4 className="text-md font-semibold">Задача развития:</h4>
                <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{archetype.developmentTask}</p>
              </div>
            )}
          </>
        )}
        
        {/* Connector specific fields */}
        {archetype.code === 'connector' && (
          <>
            {archetype.keyTask && (
              <div className="space-y-1">
                <h4 className="text-md font-semibold">Ключевая задача:</h4>
                <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{archetype.keyTask}</p>
              </div>
            )}
            
            {archetype.worldContactBasis && (
              <div className="space-y-1">
                <h4 className="text-md font-semibold">Контакт с миром должен строиться на:</h4>
                <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{archetype.worldContactBasis}</p>
              </div>
            )}
          </>
        )}
        
        {/* Realization specific fields */}
        {archetype.code === 'realization' && (
          <>
            {archetype.formula && (
              <div className="space-y-1">
                <h4 className="text-md font-semibold">Формула:</h4>
                <p className="text-sm bg-purple-50 p-3 rounded-md border border-purple-200">{archetype.formula}</p>
              </div>
            )}
            
            {archetype.realizationType && (
              <div className="space-y-1">
                <h4 className="text-md font-semibold">Тип реализации:</h4>
                <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{archetype.realizationType}</p>
              </div>
            )}
          </>
        )}
        
        {/* Generator specific fields */}
        {archetype.code === 'generator' && (
          <>
            {archetype.generatorFormula && (
              <div className="space-y-1">
                <h4 className="text-md font-semibold">Формула:</h4>
                <p className="text-sm bg-purple-50 p-3 rounded-md border border-purple-200">{archetype.generatorFormula}</p>
              </div>
            )}
            
            {archetype.generatorRecommendation && (
              <div className="space-y-1">
                <h4 className="text-md font-semibold">Рекомендация:</h4>
                <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{archetype.generatorRecommendation}</p>
              </div>
            )}
          </>
        )}
        
        {/* Mission specific fields */}
        {archetype.code === 'mission' && (
          <>
            {archetype.missionEssence && (
              <div className="space-y-1">
                <h4 className="text-md font-semibold">Суть миссии:</h4>
                <p className="text-sm bg-purple-50 p-3 rounded-md border border-purple-200">{archetype.missionEssence}</p>
              </div>
            )}
            
            {archetype.mainTransformation && (
              <div className="space-y-1">
                <h4 className="text-md font-semibold">Главная трансформация:</h4>
                <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{archetype.mainTransformation}</p>
              </div>
            )}
            
            {archetype.missionChallenges && (
              <div className="space-y-1">
                <h4 className="text-md font-semibold">Испытания миссии:</h4>
                <p className="text-sm bg-yellow-50 p-3 rounded-md border border-yellow-200">{archetype.missionChallenges}</p>
              </div>
            )}
          </>
        )}
        
        {/* Common fields - split into columns for better layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Left column - positive aspects */}
          <div className="space-y-4">
            {archetype.resourceQualities && archetype.resourceQualities.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Ресурсные качества:</h4>
                <ul className="space-y-2">
                  {archetype.resourceQualities.map((quality, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                      <span>{quality}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype.workingAspects && archetype.workingAspects.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Что работает (в ресурсе):</h4>
                <ul className="space-y-2">
                  {archetype.workingAspects.map((aspect, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                      <span>{aspect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype.potentialRealizationWays && archetype.potentialRealizationWays.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Как реализуется потенциал:</h4>
                <ul className="space-y-2">
                  {archetype.potentialRealizationWays.map((way, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                      <span>{way}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype.successSources && archetype.successSources.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Источники успеха:</h4>
                <ul className="space-y-2">
                  {archetype.successSources.map((source, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                      <span>{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype.energySources && archetype.energySources.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Что дает энергию:</h4>
                <ul className="space-y-2">
                  {archetype.energySources.map((source, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                      <span>{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype.flowSigns && archetype.flowSigns.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Признаки, что человек в потоке:</h4>
                <ul className="space-y-2">
                  {archetype.flowSigns.map((sign, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype.missionRealizationFactors && archetype.missionRealizationFactors.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Что реализует миссию:</h4>
                <ul className="space-y-2">
                  {archetype.missionRealizationFactors.map((factor, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Right column - challenges and issues */}
          <div className="space-y-4">
            {archetype.keyDistortions && archetype.keyDistortions.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Ключевые искажения:</h4>
                <ul className="space-y-2">
                  {archetype.keyDistortions.map((distortion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                      <span>{distortion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype.nonWorkingAspects && archetype.nonWorkingAspects.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Что не работает (искажения):</h4>
                <ul className="space-y-2">
                  {archetype.nonWorkingAspects.map((aspect, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                      <span>{aspect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype.realizationObstacles && archetype.realizationObstacles.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Искажения (что мешает реализовываться):</h4>
                <ul className="space-y-2">
                  {archetype.realizationObstacles.map((obstacle, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                      <span>{obstacle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype.energyDrains && archetype.energyDrains.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Что забирает энергию:</h4>
                <ul className="space-y-2">
                  {archetype.energyDrains.map((drain, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                      <span>{drain}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype.burnoutSigns && archetype.burnoutSigns.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Признаки, что человек выгорел:</h4>
                <ul className="space-y-2">
                  {archetype.burnoutSigns.map((sign, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype.missionObstacles && archetype.missionObstacles.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Что мешает реализовываться:</h4>
                <ul className="space-y-2">
                  {archetype.missionObstacles.map((obstacle, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                      <span>{obstacle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Recommendations at the bottom */}
        {archetype.recommendations && archetype.recommendations.length > 0 && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-md font-semibold mb-2">Рекомендации:</h4>
            <ul className="space-y-2">
              {archetype.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block h-5 w-5 text-blue-600 mr-2">✓</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
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

  const renderClientInfo = () => {
    if (!calculation || calculation.type !== 'basic') return null;
    
    const basicCalculation = calculation as (BasicCalculation & { id: string; createdAt: string });
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Информация о клиенте</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {basicCalculation.clientName}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {format(new Date(basicCalculation.birthDate), 'dd MMMM yyyy', { locale: ru })}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground">
                Создано: {format(new Date(calculation.createdAt), 'dd.MM.yyyy')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
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
        {/* Client Information */}
        {renderClientInfo()}
        
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
        {archetypes.length > 0 && id && (
          <AIContentSection 
            title="Саммари" 
            type="summary"
            archetypes={archetypes}
            calculationId={id}
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
          {activeSection === 'strengths-weaknesses' && id && (
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && (
                  <AIContentSection 
                    title=""
                    type="strengths-weaknesses"
                    archetypes={archetypes}
                    calculationId={id}
                  />
                )}
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'code-conflicts' && id && (
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && (
                  <AIContentSection 
                    title=""
                    type="code-conflicts"
                    archetypes={archetypes}
                    calculationId={id}
                  />
                )}
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'potential-problems' && id && (
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && (
                  <AIContentSection 
                    title=""
                    type="potential-problems"
                    archetypes={archetypes}
                    calculationId={id}
                  />
                )}
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'practices' && id && (
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && (
                  <AIContentSection 
                    title=""
                    type="practices"
                    archetypes={archetypes}
                    calculationId={id}
                  />
                )}
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'assistant' && id && (
            <Card>
              <CardContent className="pt-6">
                {archetypes.length > 0 && (
                  <AIChat 
                    archetypes={archetypes}
                    calculationId={id}
                  />
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
