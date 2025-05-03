import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCalculations } from '@/contexts/CalculationsContext';
import { BasicCalculation, Calculation, NumerologyCodeType } from '@/types';
import { toast } from 'sonner';
import { AIContentSection } from '@/components/AIContentSection';
import { AIChat } from '@/components/AIChat';
import { NoteEditor } from '@/components/NoteEditor';
import { ArchetypeDescription } from '@/types/numerology';
import { getArchetypeDescription } from '@/utils/archetypeDescriptions';
import { cn } from '@/lib/utils';

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
          
          // If it's a basic calculation, fetch archetype descriptions
          if (fetchedCalculation.type === 'basic' && fetchedCalculation.results.fullCodes) {
            const { personalityCode, connectorCode, realizationCode, generatorCode, missionCode } = fetchedCalculation.results.fullCodes;
            
            const descriptions = await Promise.all([
              getArchetypeDescription('personality', personalityCode),
              getArchetypeDescription('connector', connectorCode),
              getArchetypeDescription('realization', realizationCode),
              getArchetypeDescription('generator', generatorCode),
              getArchetypeDescription('mission', missionCode)
            ]);
            
            // Filter undefined values
            const filteredDescriptions = descriptions.filter((desc): desc is ArchetypeDescription => desc !== undefined);
            setArchetypes(filteredDescriptions);
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
    if (!calculation || calculation.type !== 'basic' || !calculation.results.fullCodes) {
      return [];
    }
    
    return archetypes;
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
      </div>
    );
  };

// Just updating the renderBasicResults function to change the layout of buttons
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card 
            className={cn(
              "cursor-pointer hover:bg-muted/50 transition-colors",
              activeSection === 'strengths-weaknesses' ? "border-numerica" : ""
            )}
            onClick={() => toggleSection('strengths-weaknesses')}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-center">Сильные и слабые стороны</CardTitle>
            </CardHeader>
          </Card>
          
          <Card 
            className={cn(
              "cursor-pointer hover:bg-muted/50 transition-colors",
              activeSection === 'code-conflicts' ? "border-numerica" : ""
            )}
            onClick={() => toggleSection('code-conflicts')}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-center">Конфликты кодов</CardTitle>
            </CardHeader>
          </Card>
          
          <Card 
            className={cn(
              "cursor-pointer hover:bg-muted/50 transition-colors",
              activeSection === 'potential-problems' ? "border-numerica" : ""
            )}
            onClick={() => toggleSection('potential-problems')}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-center">Потенциальные проблемы</CardTitle>
            </CardHeader>
          </Card>
          
          <Card 
            className={cn(
              "cursor-pointer hover:bg-muted/50 transition-colors",
              activeSection === 'practices' ? "border-numerica" : ""
            )}
            onClick={() => toggleSection('practices')}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-center">Практики</CardTitle>
            </CardHeader>
          </Card>
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
        
        {/* AI Assistant - moved to a button in the row */}
        <div className="mt-4">
          <Card 
            className={cn(
              "cursor-pointer hover:bg-muted/50 transition-colors",
              activeSection === 'assistant' ? "border-numerica" : ""
            )}
            onClick={() => toggleSection('assistant')}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-center">Помощник</CardTitle>
            </CardHeader>
          </Card>
          
          {activeSection === 'assistant' && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                {archetypes.length > 0 && (
                  <AIChat archetypes={archetypes} />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Textbook Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Учебник</h2>
        
        {/* Buttons in a horizontal row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <Card 
            className={cn(
              "cursor-pointer hover:bg-muted/50 transition-colors",
              activeSection === 'personality' ? "border-numerica" : ""
            )}
            onClick={() => toggleSection('personality')}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-center">Код Личности {fullCodes.personalityCode}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card 
            className={cn(
              "cursor-pointer hover:bg-muted/50 transition-colors",
              activeSection === 'connector' ? "border-numerica" : ""
            )}
            onClick={() => toggleSection('connector')}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-center">Код Коннектора {fullCodes.connectorCode}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card 
            className={cn(
              "cursor-pointer hover:bg-muted/50 transition-colors",
              activeSection === 'realization' ? "border-numerica" : ""
            )}
            onClick={() => toggleSection('realization')}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-center">Код Реализации {fullCodes.realizationCode}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card 
            className={cn(
              "cursor-pointer hover:bg-muted/50 transition-colors",
              activeSection === 'generator' ? "border-numerica" : ""
            )}
            onClick={() => toggleSection('generator')}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-center">Код Генератора {fullCodes.generatorCode}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card 
            className={cn(
              "cursor-pointer hover:bg-muted/50 transition-colors",
              activeSection === 'mission' ? "border-numerica" : ""
            )}
            onClick={() => toggleSection('mission')}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-center">Код Миссии {fullCodes.missionCode}</CardTitle>
            </CardHeader>
          </Card>
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
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
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
      ) : (
        <div>Неподдерживаемый тип расчета</div>
      )}
    </div>
  );
};

export default CalculationResult;
