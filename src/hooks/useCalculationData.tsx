
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
              console.log("Calculating fullCodes for basic calculation");
              basicCalc.results.fullCodes = calculateAllCodes(basicCalc.birthDate);
              console.log("Generated codes for basic calculation:", basicCalc.results.fullCodes);
            }
          }
          
          // For target calculations, ensure it has fullCodes and create a simplified archetype for AI content
          if (fetchedCalculation.type === 'target') {
            const targetCalc = fetchedCalculation as (TargetCalculation & { id: string; createdAt: string });
            
            // Calculate codes if not already present
            if (!targetCalc.results.fullCodes) {
              console.log("Calculating fullCodes for target calculation");
              const fullCodes = calculateAllCodes(targetCalc.birthDate);
              targetCalc.results.fullCodes = fullCodes;
              console.log("Generated codes for target calculation:", fullCodes);
            }
            
            // Create a more detailed set of archetypes for the target calculation
            // including both the target info and the person's codes
            const targetArchetypes: ArchetypeDescription[] = [
              { 
                code: 'target' as NumerologyCodeType, 
                title: "Целевой расчет",
                description: `Запрос клиента: ${targetCalc.targetQuery}`,
                value: 0
              }
            ];
            
            // Add archetype descriptions for each code
            if (targetCalc.results.fullCodes) {
              targetArchetypes.push(
                { 
                  code: 'personalityCode' as NumerologyCodeType, 
                  title: "Код личности",
                  description: "Основной код личности",
                  value: targetCalc.results.fullCodes.personalityCode 
                },
                { 
                  code: 'connectorCode' as NumerologyCodeType, 
                  title: "Код коммуникации", 
                  description: "Код взаимодействия с окружающим миром",
                  value: targetCalc.results.fullCodes.connectorCode 
                },
                { 
                  code: 'realizationCode' as NumerologyCodeType, 
                  title: "Код реализации", 
                  description: "Код потенциала и самореализации",
                  value: targetCalc.results.fullCodes.realizationCode 
                },
                { 
                  code: 'generatorCode' as NumerologyCodeType, 
                  title: "Код генератора", 
                  description: "Источник энергии и мотивации",
                  value: targetCalc.results.fullCodes.generatorCode 
                },
                { 
                  code: 'missionCode' as NumerologyCodeType, 
                  title: "Код миссии", 
                  description: "Жизненное предназначение",
                  value: targetCalc.results.fullCodes.missionCode 
                }
              );
            }
            
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
              
              // IMPORTANT: Always recalculate codes for client and partner using the proper calculator
              console.log("Calculating client codes for", partnershipCalc.birthDate);
              const clientCodes = calculateAllCodes(partnershipCalc.birthDate);
              partnershipCalc.results.clientProfile.fullCodes = clientCodes;
              console.log("Generated client codes:", clientCodes);
              
              console.log("Calculating partner codes for", partnershipCalc.partnerBirthDate);
              const partnerCodes = calculateAllCodes(partnershipCalc.partnerBirthDate);
              partnershipCalc.results.partnerProfile.fullCodes = partnerCodes;
              console.log("Generated partner codes:", partnerCodes);
              
              // Now let's create basic archetypes for client and partner based on their codes
              if (!partnershipCalc.results.clientArchetypes || partnershipCalc.results.clientArchetypes.length === 0) {
                const clientArchetypesData: ArchetypeDescription[] = [
                  { 
                    code: 'personalityCode' as NumerologyCodeType, 
                    title: `Код личности ${clientCodes.personalityCode}`,
                    description: "Основной код личности",
                    value: clientCodes.personalityCode
                  },
                  { 
                    code: 'connectorCode' as NumerologyCodeType, 
                    title: `Код коннектора ${clientCodes.connectorCode}`,
                    description: "Код взаимодействия с окружающим миром",
                    value: clientCodes.connectorCode
                  },
                  { 
                    code: 'realizationCode' as NumerologyCodeType, 
                    title: `Код реализации ${clientCodes.realizationCode}`,
                    description: "Код потенциала и самореализации",
                    value: clientCodes.realizationCode
                  },
                  { 
                    code: 'generatorCode' as NumerologyCodeType, 
                    title: `Код генератора ${clientCodes.generatorCode}`,
                    description: "Источник энергии и мотивации",
                    value: clientCodes.generatorCode
                  },
                  { 
                    code: 'missionCode' as NumerologyCodeType, 
                    title: `Код миссии ${clientCodes.missionCode}`,
                    description: "Жизненное предназначение",
                    value: clientCodes.missionCode
                  }
                ];
                partnershipCalc.results.clientArchetypes = clientArchetypesData;
              }
              
              if (!partnershipCalc.results.partnerArchetypes || partnershipCalc.results.partnerArchetypes.length === 0) {
                const partnerArchetypesData: ArchetypeDescription[] = [
                  { 
                    code: 'personalityCode' as NumerologyCodeType, 
                    title: `Код личности ${partnerCodes.personalityCode}`,
                    description: "Основной код личности",
                    value: partnerCodes.personalityCode
                  },
                  { 
                    code: 'connectorCode' as NumerologyCodeType, 
                    title: `Код коннектора ${partnerCodes.connectorCode}`,
                    description: "Код взаимодействия с окружающим миром",
                    value: partnerCodes.connectorCode
                  },
                  { 
                    code: 'realizationCode' as NumerologyCodeType, 
                    title: `Код реализации ${partnerCodes.realizationCode}`,
                    description: "Код потенциала и самореализации",
                    value: partnerCodes.realizationCode
                  },
                  { 
                    code: 'generatorCode' as NumerologyCodeType, 
                    title: `Код генератора ${partnerCodes.generatorCode}`,
                    description: "Источник энергии и мотивации",
                    value: partnerCodes.generatorCode
                  },
                  { 
                    code: 'missionCode' as NumerologyCodeType, 
                    title: `Код миссии ${partnerCodes.missionCode}`,
                    description: "Жизненное предназначение",
                    value: partnerCodes.missionCode
                  }
                ];
                partnershipCalc.results.partnerArchetypes = partnerArchetypesData;
              }
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
