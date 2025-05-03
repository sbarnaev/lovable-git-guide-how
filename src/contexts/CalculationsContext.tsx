
import { createContext, useContext, useState, ReactNode } from 'react';
import { Calculation } from '@/types';

interface CalculationsContextType {
  calculations: Calculation[];
  createCalculation: (calculation: Omit<Calculation, 'id' | 'createdAt'>) => Calculation;
  getCalculation: (id: string) => Calculation | undefined;
}

const CalculationsContext = createContext<CalculationsContextType | undefined>(undefined);

export const CalculationsProvider = ({ children }: { children: ReactNode }) => {
  const [calculations, setCalculations] = useState<Calculation[]>(() => {
    const storedCalculations = localStorage.getItem('numerica_calculations');
    return storedCalculations ? JSON.parse(storedCalculations) : [];
  });

  const createCalculation = (calculationData: Omit<Calculation, 'id' | 'createdAt'>) => {
    const newCalculation: Calculation = {
      ...calculationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedCalculations = [...calculations, newCalculation];
    setCalculations(updatedCalculations);
    localStorage.setItem('numerica_calculations', JSON.stringify(updatedCalculations));
    
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
