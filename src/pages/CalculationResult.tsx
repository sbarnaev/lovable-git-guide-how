
import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BasicCalculation, PartnershipCalculation, TargetCalculation } from '@/types';
import { useCalculationData } from '@/hooks/useCalculationData';
import { LoadingState } from '@/components/calculation-result/LoadingState';
import { ErrorState } from '@/components/calculation-result/ErrorState';
import { BasicView } from '@/components/calculation-result/BasicView';
import { PartnershipView } from '@/components/calculation-result/PartnershipView';
import { TargetView } from '@/components/calculation-result/TargetView';

const CalculationResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Use our custom hook to load calculation data
  const { 
    calculation, 
    loading, 
    error, 
    archetypes, 
    clientArchetypes, 
    partnerArchetypes 
  } = useCalculationData(id);
  
  // Determine calculation types
  const isBasicCalculation = useMemo(() => {
    return calculation?.type === 'basic';
  }, [calculation]);
  
  const isTargetCalculation = useMemo(() => {
    return calculation?.type === 'target';
  }, [calculation]);

  const isPartnershipCalculation = useMemo(() => {
    return calculation?.type === 'partnership';
  }, [calculation]);
  
  // Memoized typed calculations to avoid type errors
  const basicCalculation = useMemo(() => {
    if (isBasicCalculation && calculation) {
      return calculation as (BasicCalculation & { id: string; createdAt: string });
    }
    return undefined;
  }, [calculation, isBasicCalculation]);

  const partnershipCalculation = useMemo(() => {
    if (isPartnershipCalculation && calculation) {
      return calculation as (PartnershipCalculation & { id: string; createdAt: string });
    }
    return undefined;
  }, [calculation, isPartnershipCalculation]);

  const targetCalculation = useMemo(() => {
    if (isTargetCalculation && calculation) {
      return calculation as (TargetCalculation & { id: string; createdAt: string });
    }
    return undefined;
  }, [calculation, isTargetCalculation]);

  if (loading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState error={error} />;
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
      
      {isBasicCalculation && basicCalculation ? (
        <BasicView calculation={basicCalculation} archetypes={archetypes} />
      ) : isPartnershipCalculation && partnershipCalculation ? (
        <PartnershipView 
          calculation={partnershipCalculation} 
          clientArchetypes={clientArchetypes} 
          partnerArchetypes={partnerArchetypes} 
        />
      ) : isTargetCalculation && targetCalculation ? (
        <TargetView calculation={targetCalculation} archetypes={archetypes} />
      ) : (
        <div>Неподдерживаемый тип расчета</div>
      )}
    </div>
  );
};

export default CalculationResult;
