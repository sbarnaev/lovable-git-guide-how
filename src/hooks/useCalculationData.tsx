
import { useState, useEffect } from 'react';
import { useCalculations } from '@/contexts/calculations';
import { Calculation, BasicCalculation, PartnershipCalculation, TargetCalculation } from '@/types';
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';
import { calculateAllCodes } from '@/utils/numerologyCalculator';

export const useCalculationData = (id: string | undefined) => {
  const { getCalculation } = useCalculations();
  const [calculation, setCalculation] = useState<Calculation | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [archetypes, setArchetypes] = useState<ArchetypeDescription[]>([]);
  const [clientArchetypes, setClientArchetypes] = useState<ArchetypeDescription[]>([]);
  const [partnerArchetypes, setPartnerArchetypes] = useState<ArchetypeDescription[]>([]);
  
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
        console.log("Fetched calculation:", fetchedCalculation);
        
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

          // For partnership calculation, set both client and partner archetypes
          if (fetchedCalculation.type === 'partnership') {
            const partnershipCalc = fetchedCalculation as (PartnershipCalculation & { id: string; createdAt: string });
            console.log("Partnership calculation:", partnershipCalc);
            
            // Ensure we have the required profile data
            if (partnershipCalc.results) {
              // Make sure clientProfile and partnerProfile have fullCodes
              if (partnershipCalc.results.clientProfile && !partnershipCalc.results.clientProfile.fullCodes) {
                // Calculate codes if missing
                const clientCodes = calculateAllCodes(partnershipCalc.birthDate);
                if (partnershipCalc.results.clientProfile) {
                  partnershipCalc.results.clientProfile.fullCodes = clientCodes;
                }
              }
              
              if (partnershipCalc.results.partnerProfile && !partnershipCalc.results.partnerProfile.fullCodes) {
                // Calculate codes if missing
                const partnerCodes = calculateAllCodes(partnershipCalc.partnerBirthDate);
                if (partnershipCalc.results.partnerProfile) {
                  partnershipCalc.results.partnerProfile.fullCodes = partnerCodes;
                }
              }
            }
            
            if (partnershipCalc.results.clientArchetypes) {
              setClientArchetypes(partnershipCalc.results.clientArchetypes);
            }
            
            if (partnershipCalc.results.partnerArchetypes) {
              setPartnerArchetypes(partnershipCalc.results.partnerArchetypes);
            }
            
            // Combine both sets of archetypes for AI analysis
            const combined = [
              ...(partnershipCalc.results.clientArchetypes || []),
              ...(partnershipCalc.results.partnerArchetypes || [])
            ];
            
            if (combined.length > 0) {
              setArchetypes(combined);
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
  
  return {
    calculation,
    loading,
    error,
    archetypes,
    clientArchetypes,
    partnerArchetypes
  };
};
