
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Calculation, CalculationData, BasicCalculation, PartnershipCalculation, TargetCalculation } from '@/types';
import { getArchetypeDescription } from '@/utils/archetypeDescriptions';
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CalculationNote {
  id: string;
  calculation_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface StoredCalculation {
  id: string;
  data: Calculation;
  created_at: string;
}

interface CalculationsContextType {
  calculations: Calculation[];
  createCalculation: (calculation: CalculationData) => Promise<Calculation>;
  getCalculation: (id: string) => Calculation | undefined;
  saveNote: (calculation_id: string, content: string) => Promise<CalculationNote | null>;
  getNote: (calculation_id: string) => Promise<CalculationNote | null>;
  updateNote: (id: string, content: string) => Promise<CalculationNote | null>;
}

const CalculationsContext = createContext<CalculationsContextType | undefined>(undefined);

export const CalculationsProvider = ({ children }: { children: ReactNode }) => {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // При инициализации загружаем расчеты из БД
  useEffect(() => {
    const loadCalculations = async () => {
      try {
        setIsLoading(true);
        
        // Загрузим все сохраненные расчеты из Supabase
        const { data: storedCalculations, error } = await supabase
          .from('calculations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Ошибка загрузки расчетов:', error);
          // Если есть ошибка с загрузкой из БД, пытаемся загрузить из localStorage как запасной вариант
          const storedCalcsInLocalStorage = localStorage.getItem('numerica_calculations');
          const localCalcs = storedCalcsInLocalStorage ? JSON.parse(storedCalcsInLocalStorage) : [];
          setCalculations(localCalcs);
          return;
        }

        if (storedCalculations) {
          // Преобразуем данные из БД в нужный формат
          const calcs = storedCalculations.map((item: StoredCalculation) => item.data) as Calculation[];
          setCalculations(calcs);
          console.log('Расчеты загружены из БД:', calcs.length);
        }
      } catch (error) {
        console.error('Ошибка при загрузке расчетов:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalculations();
  }, []);

  const createCalculation = async (calculationData: CalculationData): Promise<Calculation> => {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    
    // Creating a new calculation based on the type of input data
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
        // For basic calculation, add archetype descriptions
        const basicData = calculationData as BasicCalculation;
        
        // If there are full codes, get archetype descriptions for them
        if (basicData.results.fullCodes) {
          const { personalityCode, connectorCode, realizationCode, generatorCode, missionCode } = basicData.results.fullCodes;
          
          // Get descriptions for each code
          const archetypeDescriptions: ArchetypeDescription[] = [];
          
          try {
            // Get and add each archetype
            const descriptions = await Promise.all([
              getArchetypeDescription('personality', personalityCode),
              getArchetypeDescription('connector', connectorCode),
              getArchetypeDescription('realization', realizationCode),
              getArchetypeDescription('generator', generatorCode),
              getArchetypeDescription('mission', missionCode)
            ]);
            
            // Filter undefined values
            descriptions.forEach(desc => {
              if (desc) archetypeDescriptions.push(desc);
            });
            
            // Add archetype descriptions to results
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

    // Сохраняем расчет в Supabase
    try {
      const { error } = await supabase
        .from('calculations')
        .insert([{ 
          id, 
          data: newCalculation,
          created_at: createdAt
        }]);
      
      if (error) {
        console.error('Ошибка сохранения расчета в БД:', error);
        throw error;
      } else {
        console.log('Расчет успешно сохранен в БД');
      }
    } catch (error) {
      console.error('Ошибка при сохранении расчета:', error);
      // В случае ошибки с БД, сохраняем в localStorage
      try {
        const updatedCalculations = [...calculations, newCalculation];
        setCalculations(updatedCalculations);
        localStorage.setItem('numerica_calculations', JSON.stringify(updatedCalculations));
      } catch (localStorageError) {
        console.error('Не удалось сохранить в localStorage:', localStorageError);
      }
    }

    // Обновляем список расчетов в состоянии
    setCalculations(prevCalculations => [...prevCalculations, newCalculation]);
    
    console.log('Created calculation:', newCalculation);
    
    return newCalculation;
  };

  const getCalculation = (id: string) => {
    return calculations.find(calc => calc.id === id);
  };
  
  const saveNote = async (calculation_id: string, content: string): Promise<CalculationNote | null> => {
    try {
      const { data: existingNote, error: fetchError } = await supabase
        .from('calculation_notes')
        .select('*')
        .eq('calculation_id', calculation_id)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      
      if (existingNote) {
        return await updateNote(existingNote.id, content);
      }
      
      const { data, error } = await supabase
        .from('calculation_notes')
        .insert([{ calculation_id, content }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Ошибка при сохранении заметки');
      return null;
    }
  };
  
  const getNote = async (calculation_id: string): Promise<CalculationNote | null> => {
    try {
      const { data, error } = await supabase
        .from('calculation_notes')
        .select('*')
        .eq('calculation_id', calculation_id)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting note:', error);
      return null;
    }
  };
  
  const updateNote = async (id: string, content: string): Promise<CalculationNote | null> => {
    try {
      const { data, error } = await supabase
        .from('calculation_notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Ошибка при обновлении заметки');
      return null;
    }
  };

  if (isLoading) {
    // Можно было бы добавить компонент загрузки, но т.к. контекст используется при инициализации,
    // лучше просто вернуть значения по умолчанию
    return (
      <CalculationsContext.Provider
        value={{
          calculations: [],
          createCalculation,
          getCalculation,
          saveNote,
          getNote,
          updateNote
        }}
      >
        {children}
      </CalculationsContext.Provider>
    );
  }

  return (
    <CalculationsContext.Provider
      value={{
        calculations,
        createCalculation,
        getCalculation,
        saveNote,
        getNote,
        updateNote
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
