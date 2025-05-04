import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BasicCalculation, Calculation, PartnershipCalculation, TargetCalculation } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { useAuth } from './AuthContext';

interface StoredCalculation {
  id: string;
  data: Json;
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

interface CalculationContextProps {
  calculations: Calculation[];
  loading: boolean;
  addCalculation: (calculation: BasicCalculation | PartnershipCalculation | TargetCalculation) => Promise<Calculation>;
  getCalculation: (id: string) => Calculation | undefined;
  saveCalculations: (calculationsToSave: Calculation[]) => Promise<void>;
  deleteCalculation: (id: string) => Promise<void>;
  saveNote: (calculationId: string, content: string) => Promise<{ id: string } | undefined>;
  getNote: (calculationId: string) => Promise<{ id: string; content: string } | undefined>;
  updateNote: (noteId: string, content: string) => Promise<{ id: string } | undefined>;
}

const CalculationContext = createContext<CalculationContextProps | undefined>(undefined);

export const CalculationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCalculations();
    } else {
      setCalculations([]);
    }
  }, [user]);

  const fetchCalculations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: storedCalculations, error } = await supabase
        .from('calculations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const calculations = storedCalculations?.map((item: StoredCalculation): Calculation => {
        return {
          ...item.data as unknown as Calculation,
          id: item.id,
          createdAt: item.created_at,
        };
      }) ?? [];
      
      setCalculations(calculations);
    } catch (error) {
      console.error('Error fetching calculations:', error);
      toast.error('Не удалось загрузить расчеты');
    } finally {
      setLoading(false);
    }
  };

  const addCalculation = async (calculation: BasicCalculation | PartnershipCalculation | TargetCalculation) => {
    const newCalculation = { ...calculation, id: uuidv4(), createdAt: new Date().toISOString() } as Calculation;
    
    setCalculations((prevCalculations) => [...prevCalculations, newCalculation]);
    
    // If user is logged in, save to Supabase
    if (user) {
      try {
        const { error } = await supabase.from('calculations').insert({
          id: newCalculation.id,
          data: newCalculation as unknown as Json,
          user_id: user.id
        });
        
        if (error) throw error;
      } catch (error) {
        console.error('Error saving calculation:', error);
        toast.error('Не удалось сохранить расчет на сервере');
      }
    }
    
    return newCalculation;
  };

  const getCalculation = (id: string): Calculation | undefined => {
    return calculations.find((calculation) => calculation.id === id);
  };

  const saveCalculations = async (calculationsToSave: Calculation[]) => {
    if (!user) {
      toast.error('Для сохранения расчетов необходимо авторизоваться');
      return;
    }
    
    try {
      const formattedData = calculationsToSave.map(calculation => ({
        id: calculation.id,
        data: calculation as unknown as Json,
        created_at: calculation.createdAt,
        user_id: user.id
      }));
      
      const { error } = await supabase
        .from('calculations')
        .upsert(formattedData);
        
      if (error) throw error;
      
      toast.success('Расчеты сохранены');
    } catch (error) {
      console.error('Error saving calculations:', error);
      toast.error('Не удалось сохранить расчеты');
    }
  };

  const deleteCalculation = async (id: string) => {
    if (!user) {
      toast.error('Для удаления расчетов необходимо авторизоваться');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('calculations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setCalculations(prevCalculations => prevCalculations.filter(calc => calc.id !== id));
      toast.success('Расчет удален');
    } catch (error) {
      console.error('Error deleting calculation:', error);
      toast.error('Не удалось удалить расчет');
    }
  };

  const saveNote = async (calculationId: string, content: string) => {
    if (!user) {
      toast.error('Для сохранения заметок необходимо авторизоваться');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('calculation_notes')
        .insert([{ calculation_id: calculationId, content }])
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Заметка сохранена');
      return { id: data.id };
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Не удалось сохранить заметку');
    }
  };

  const getNote = async (calculationId: string) => {
    if (!user) return undefined;
    
    try {
      const { data, error } = await supabase
        .from('calculation_notes')
        .select('*')
        .eq('calculation_id', calculationId)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        return { id: data.id, content: data.content };
      }
      return undefined;
    } catch (error: any) {
      // Только логируем ошибку, если это не "no data found"
      if (error.code !== 'PGRST116') {
        console.error('Error fetching note:', error);
        toast.error('Не удалось загрузить заметку');
      }
      return undefined;
    }
  };

  const updateNote = async (noteId: string, content: string) => {
    if (!user) {
      toast.error('Для обновления заметок необходимо авторизоваться');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('calculation_notes')
        .update({ content })
        .eq('id', noteId)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Заметка обновлена');
      return { id: data.id };
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Не удалось обновить заметку');
    }
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
