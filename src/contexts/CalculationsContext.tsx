
import { createContext, useContext, useState, ReactNode } from 'react';
import { Calculation, CalculationData, BasicCalculation, PartnershipCalculation, TargetCalculation } from '@/types';
import { getArchetypeDescription } from '@/utils/archetypeDescriptions';
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';

interface CalculationsContextType {
  calculations: Calculation[];
  createCalculation: (calculation: CalculationData) => Promise<Calculation>;
  getCalculation: (id: string) => Calculation | undefined;
}

const CalculationsContext = createContext<CalculationsContextType | undefined>(undefined);

export const CalculationsProvider = ({ children }: { children: ReactNode }) => {
  const [calculations, setCalculations] = useState<Calculation[]>(() => {
    const storedCalculations = localStorage.getItem('numerica_calculations');
    return storedCalculations ? JSON.parse(storedCalculations) : [];
  });

  const createCalculation = async (calculationData: CalculationData): Promise<Calculation> => {
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
          
          try {
            // Получаем и добавляем каждый архетип
            const descriptions = await Promise.all([
              getArchetypeDescription('personality', personalityCode),
              getArchetypeDescription('connector', connectorCode),
              getArchetypeDescription('realization', realizationCode),
              getArchetypeDescription('generator', generatorCode),
              getArchetypeDescription('mission', missionCode)
            ]);
            
            // Фильтруем undefined значения
            descriptions.forEach(desc => {
              if (desc) archetypeDescriptions.push(desc);
            });
            
            // Добавляем описания архетипов к результатам
            basicData.results.archetypeDescriptions = archetypeDescriptions;
          } catch (error) {
            console.error('Error fetching archetype descriptions:', error);
          }
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
