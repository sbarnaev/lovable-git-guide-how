
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCalculations } from '@/contexts/calculations';
import { BasicCalculation, Calculation, TargetCalculation } from '@/types';
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';
import { AIContentSection } from '@/components/AIContentSection';
import { NoteEditor } from '@/components/note-editor';
import { ClientInfo } from '@/components/calculation-result/ClientInfo';
import { ProfileCodes } from '@/components/calculation-result/ProfileCodes';
import { ConsultationSection } from '@/components/calculation-result/ConsultationSection';
import { TextbookSection } from '@/components/calculation-result/TextbookSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CalculationResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCalculation } = useCalculations();
  const [calculation, setCalculation] = useState<Calculation | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [archetypes, setArchetypes] = useState<ArchetypeDescription[]>([]);
  
  // Fetch calculation data only once on component mount or when id changes
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
          
          // For target calculations, we create a simplified archetype for AI content
          if (fetchedCalculation.type === 'target') {
            const targetCalc = fetchedCalculation as (TargetCalculation & { id: string; createdAt: string });
            const simplifiedArchetypes = [{ 
              code: 'target' as NumerologyCodeType, 
              title: "Целевой расчет",
              description: `Запрос клиента: ${targetCalc.targetQuery}`,
              value: 0
            }];
            
            setArchetypes(simplifiedArchetypes);
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
  
  // Determine if we're showing a basic calculation
  const isBasicCalculation = useMemo(() => {
    return calculation?.type === 'basic';
  }, [calculation]);
  
  // Determine if we're showing a target calculation
  const isTargetCalculation = useMemo(() => {
    return calculation?.type === 'target';
  }, [calculation]);
  
  // Memoize the typed calculation to avoid unnecessary re-renders
  const typedCalculation = useMemo(() => {
    if (isBasicCalculation) {
      return calculation as (BasicCalculation & { id: string; createdAt: string });
    }
    return undefined;
  }, [calculation, isBasicCalculation]);

  // Memoize the content of these functions to prevent unnecessary re-renders
  const renderPartnershipResults = useMemo(() => {
    return (
      <div className="text-center p-4">
        <div className="text-muted-foreground">Расчет партнерства в разработке.</div>
      </div>
    );
  }, []);

  const renderTargetResults = useMemo(() => {
    if (!id || !calculation) return null;
    
    const targetCalc = calculation as (TargetCalculation & { id: string; createdAt: string });
    
    return (
      <div className="space-y-6">
        {/* Client Information */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Информация о клиенте</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm">ФИО клиента</h3>
                <p>{targetCalc.clientName}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Дата рождения</h3>
                <p>{new Date(targetCalc.birthDate).toLocaleDateString('ru-RU')}</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <h3 className="font-medium text-sm">Запрос</h3>
                <p>{targetCalc.targetQuery}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* AI Summary */}
        {archetypes.length > 0 && (
          <AIContentSection 
            title="Саммари" 
            type="summary"
            archetypes={archetypes}
            calculationId={id}
          />
        )}
        
        {/* Target Analysis */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Анализ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Основные факторы:</h3>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {targetCalc.results.analysis.mainFactors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Текущая фаза:</h3>
                <p className="mt-1">{targetCalc.results.analysis.currentPhase}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Потенциальные результаты:</h3>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {targetCalc.results.analysis.potentialOutcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recommendations */}
        {archetypes.length > 0 && (
          <AIContentSection 
            title="Детальные рекомендации" 
            type="practices"
            archetypes={archetypes}
            calculationId={id}
          />
        )}
        
        {/* Potential Problems */}
        {archetypes.length > 0 && (
          <AIContentSection 
            title="Потенциальные проблемы и решения" 
            type="potential-problems"
            archetypes={archetypes}
            calculationId={id}
          />
        )}
        
        {/* Notes */}
        {id && (
          <div className="space-y-4">
            <NoteEditor calculationId={id} />
          </div>
        )}
      </div>
    );
  }, [id, calculation, archetypes]);

  const renderBasicResults = useMemo(() => {
    // Only render if we have both calculation and ID
    if (!typedCalculation || !id) {
      return null;
    }
    
    return (
      <div className="space-y-6">
        {/* Client Information */}
        <ClientInfo calculation={typedCalculation} />
        
        {/* Profile Codes */}
        <ProfileCodes calculation={typedCalculation} />
        
        {/* Summary - Only show when we have archetypes and an ID */}
        {archetypes.length > 0 && id && (
          <AIContentSection 
            title="Саммари" 
            type="summary"
            archetypes={archetypes}
            calculationId={id}
          />
        )}
        
        {/* Consultation Section */}
        {archetypes.length > 0 && id && (
          <ConsultationSection 
            archetypes={archetypes} 
            calculationId={id} 
          />
        )}
        
        {/* Textbook Section */}
        <TextbookSection calculation={typedCalculation} archetypes={archetypes} />
        
        {/* Notes Section */}
        {id && (
          <div className="space-y-4">
            <NoteEditor calculationId={id} />
          </div>
        )}
      </div>
    );
  }, [typedCalculation, id, archetypes]);

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
        renderBasicResults
      ) : calculation.type === 'partnership' ? (
        renderPartnershipResults
      ) : calculation.type === 'target' ? (
        renderTargetResults
      ) : (
        <div>Неподдерживаемый тип расчета</div>
      )}
    </div>
  );
};

export default CalculationResult;
