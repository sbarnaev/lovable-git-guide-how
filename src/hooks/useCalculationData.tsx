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
            
            // Ensure that basic calculation also has fullCodes
            if (basicCalc.results && !basicCalc.results.fullCodes) {
              basicCalc.results.fullCodes = calculateAllCodes(basicCalc.birthDate);
              console.log("Generated codes for basic calculation:", basicCalc.results.fullCodes);
            }
          }
          
          // For target calculations, we create a simplified archetype for AI content
          // and also calculate the fullCodes if not already present
          if (fetchedCalculation.type === 'target') {
            const targetCalc = fetchedCalculation as (TargetCalculation & { id: string; createdAt: string });
            
            // Calculate codes if not already present
            const fullCodes = calculateAllCodes(targetCalc.birthDate);
            console.log("Generated codes for target calculation:", fullCodes);
            
            // Create a more detailed set of archetypes for the target calculation
            // including both the target info and the person's codes
            const targetArchetypes: ArchetypeDescription[] = [
              { 
                code: 'target' as NumerologyCodeType, 
                title: "Целевой расчет",
                description: `Запрос клиента: ${targetCalc.targetQuery}`,
                value: 0
              },
              { 
                code: 'personalityCode' as NumerologyCodeType, 
                title: "Код личности",
                description: "Основной код личности",
                value: fullCodes.personalityCode 
              },
              { 
                code: 'connectorCode' as NumerologyCodeType, 
                title: "Код коммуникации", 
                description: "Код взаимодействия с окружающим миром",
                value: fullCodes.connectorCode 
              },
              { 
                code: 'realizationCode' as NumerologyCodeType, 
                title: "Код реализации", 
                description: "Код потенциала и самореализации",
                value: fullCodes.realizationCode 
              },
              { 
                code: 'generatorCode' as NumerologyCodeType, 
                title: "Код генератора", 
                description: "Источник энергии и мотивации",
                value: fullCodes.generatorCode 
              },
              { 
                code: 'missionCode' as NumerologyCodeType, 
                title: "Код миссии", 
                description: "Жизненное предназначение",
                value: fullCodes.missionCode 
              }
            ];
            
            setArchetypes(targetArchetypes);
          }

          // For partnership calculation, set both client and partner archetypes and ensure fullCodes
          if (fetchedCalculation.type === 'partnership') {
            const partnershipCalc = fetchedCalculation as (PartnershipCalculation & { id: string; createdAt: string });
            console.log("Partnership calculation:", partnershipCalc);
            
            // Ensure we have the required profile data
            if (partnershipCalc.results) {
              // Make sure clientProfile and partnerProfile exist
              if (!partnershipCalc.results.clientProfile) {
                console.log("Creating clientProfile");
                partnershipCalc.results.clientProfile = {
                  numerology: { lifePath: 0, destiny: 0, personality: 0 },
                  strengths: [],
                  challenges: [],
                  recommendations: []
                };
              }
              
              if (!partnershipCalc.results.partnerProfile) {
                console.log("Creating partnerProfile");
                partnershipCalc.results.partnerProfile = {
                  numerology: { lifePath: 0, destiny: 0, personality: 0 },
                  strengths: [],
                  challenges: [],
                  recommendations: []
                };
              }
              
              // Always recalculate codes for client and partner to ensure accuracy
              console.log("Calculating client codes for", partnershipCalc.birthDate);
              const clientCodes = calculateAllCodes(partnershipCalc.birthDate);
              partnershipCalc.results.clientProfile.fullCodes = clientCodes;
              console.log("Generated client codes:", clientCodes);
              
              console.log("Calculating partner codes for", partnershipCalc.partnerBirthDate);
              const partnerCodes = calculateAllCodes(partnershipCalc.partnerBirthDate);
              partnershipCalc.results.partnerProfile.fullCodes = partnerCodes;
              console.log("Generated partner codes:", partnerCodes);
            }
            
            // Set archetypes for client and partner
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
