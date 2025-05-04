
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BasicCalculation, Calculation, PartnershipCalculation, TargetCalculation } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { CalculationContextProps } from './types';
import { 
  fetchUserCalculations, 
  saveCalculation, 
  saveMultipleCalculations, 
  deleteCalculationById,
  saveCalculationNote,
  getCalculationNote,
  updateCalculationNote
} from './calculationsApi';

const CalculationContext = createContext<CalculationContextProps | undefined>(undefined);

export const CalculationsProvider = ({ children }: { children: ReactNode }) => {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCalculations();
    } else {
      setCalculations([]);
    }
  }, [user]);

  const loadCalculations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const fetchedCalculations = await fetchUserCalculations(user.id);
      setCalculations(fetchedCalculations);
    } catch (error) {
      console.error('Error loading calculations:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCalculation = async (calculation: BasicCalculation | PartnershipCalculation | TargetCalculation) => {
    const newCalculation = { ...calculation, id: uuidv4(), createdAt: new Date().toISOString() } as Calculation;
    
    setCalculations((prevCalculations) => [...prevCalculations, newCalculation]);
    
    if (user) {
      await saveCalculation(newCalculation, user.id);
    }
    
    return newCalculation;
  };

  const getCalculation = (id: string): Calculation | undefined => {
    return calculations.find((calculation) => calculation.id === id);
  };

  const saveCalculations = async (calculationsToSave: Calculation[]) => {
    if (user) {
      await saveMultipleCalculations(calculationsToSave, user.id);
    }
  };

  const deleteCalculation = async (id: string) => {
    if (user) {
      await deleteCalculationById(id, user.id);
      setCalculations(prevCalculations => prevCalculations.filter(calc => calc.id !== id));
    }
  };

  const saveNote = async (calculationId: string, content: string) => {
    if (user) {
      return await saveCalculationNote(calculationId, content, user.id);
    }
    return undefined;
  };

  const getNote = async (calculationId: string) => {
    if (user) {
      return await getCalculationNote(calculationId, user.id);
    }
    return undefined;
  };

  const updateNote = async (noteId: string, content: string) => {
    if (user) {
      return await updateCalculationNote(noteId, content, user.id);
    }
    return undefined;
  };

  const value = {
    calculations,
    loading,
    addCalculation,
    getCalculation,
    saveCalculations,
    deleteCalculation,
    saveNote,
    getNote,
    updateNote,
  };

  return (
    <CalculationContext.Provider value={value}>
      {children}
    </CalculationContext.Provider>
  );
};

export const useCalculations = () => {
  const context = useContext(CalculationContext);
  if (!context) {
    throw new Error('useCalculations must be used within a CalculationsProvider');
  }
  return context;
};
