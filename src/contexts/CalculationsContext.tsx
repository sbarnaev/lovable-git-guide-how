
import { createContext, useContext, useState, ReactNode } from 'react';
import { Calculation, CalculationData, BasicCalculation, PartnershipCalculation, TargetCalculation } from '@/types';
import { getArchetypeDescription } from '@/utils/archetypeDescriptions';
import { ArchetypeDescription } from '@/types/numerology';

interface CalculationsContextType {
  calculations: Calculation[];
  createCalculation: (calculation: CalculationData) => Calculation;
  getCalculation: (id: string) => Calculation | undefined;
}

const CalculationsContext = createContext<CalculationsContextType | undefined>(undefined);

export const CalculationsProvider = ({ children }: { children: ReactNode }) => {
  const [calculations, setCalculations] = useState<Calculation[]>(() => {
    const storedCalculations = localStorage.getItem('numerica_calculations');
    return storedCalculations ? JSON.parse(storedCalculations) : [];
  });

  const createCalculation = (calculationData: CalculationData) => {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    
    // Создаем новое вычисление на основе типа входных данных
    let newCalculation: Calculation;
    
    switch (calculationData.type) {
      case 'partnership':
        newCalculation = {
          ...(calculationData as PartnershipCalculation),
          id,
          createdAt
        };
        break;
      case 'target':
        newCalculation = {
          ...(calculationData as TargetCalculation),
          id,
          createdAt
        };
        break;
      case 'basic':
      default:
        // Для базового расчета добавляем описания архетипов
        const basicData = calculationData as BasicCalculation;
        
        // Если есть полные коды, получаем описания архетипов для них
        if (basicData.results.fullCodes) {
          const { personalityCode, connectorCode, realizationCode, generatorCode, missionCode } = basicData.results.fullCodes;
          
          // Получаем описания для каждого кода
          const archetypeDescriptions: ArchetypeDescription[] = [];
          
          // Получаем и добавляем каждый архетип
          const personalityArchetype = getArchetypeDescription('personality', personalityCode);
          const connectorArchetype = getArchetypeDescription('connector', connectorCode);
          const realizationArchetype = getArchetypeDescription('realization', realizationCode);
          const generatorArchetype = getArchetypeDescription('generator', generatorCode);
          const missionArchetype = getArchetypeDescription('mission', missionCode);
          
          if (personalityArchetype) archetypeDescriptions.push(personalityArchetype);
          if (connectorArchetype) archetypeDescriptions.push(connectorArchetype);
          if (realizationArchetype) archetypeDescriptions.push(realizationArchetype);
          if (generatorArchetype) archetypeDescriptions.push(generatorArchetype);
          if (missionArchetype) archetypeDescriptions.push(missionArchetype);
          
          // Добавляем описания архетипов к результатам
          basicData.results.archetypeDescriptions = archetypeDescriptions;
        }
        
        newCalculation = {
          ...basicData,
          id,
          createdAt
        };
    }

    const updatedCalculations = [...calculations, newCalculation];
    setCalculations(updatedCalculations);
    localStorage.setItem('numerica_calculations', JSON.stringify(updatedCalculations));
    
    console.log('Created calculation:', newCalculation);
    
    return newCalculation;
  };

  const getCalculation = (id: string) => {
    return calculations.find(calc => calc.id === id);
  };

  return (
    <CalculationsContext.Provider
      value={{
        calculations,
        createCalculation,
        getCalculation
      }}
    >
      {children}
    </CalculationsContext.Provider>
  );
};

export const useCalculations = () => {
  const context = useContext(CalculationsContext);
  if (context === undefined) {
    throw new Error('useCalculations must be used within a CalculationsProvider');
  }
  return context;
};
