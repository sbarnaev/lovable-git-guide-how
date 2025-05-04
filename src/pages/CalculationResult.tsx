
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCalculations } from '@/contexts/calculations';
import { BasicCalculation, Calculation } from '@/types';
import { ArchetypeDescription } from '@/types/numerology';
import { AIContentSection } from '@/components/AIContentSection';
import { NoteEditor } from '@/components/note-editor';
import { ClientInfo } from '@/components/calculation-result/ClientInfo';
import { ProfileCodes } from '@/components/calculation-result/ProfileCodes';
import { ConsultationSection } from '@/components/calculation-result/ConsultationSection';
import { TextbookSection } from '@/components/calculation-result/TextbookSection';

const CalculationResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCalculation } = useCalculations();
  const [calculation, setCalculation] = useState<Calculation | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [archetypes, setArchetypes] = useState<ArchetypeDescription[]>([]);
  
  // Fetch calculation data only once on component mount
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
  
  // Determine if we're showing a basic calculation
  const isBasicCalculation = useMemo(() => {
    return calculation?.type === 'basic';
  }, [calculation]);
  
  // Memoize the typed calculation to avoid unnecessary re-renders
  const typedCalculation = useMemo(() => {
    if (isBasicCalculation) {
      return calculation as (BasicCalculation & { id: string; createdAt: string });
    }
    return undefined;
  }, [calculation, isBasicCalculation]);

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
