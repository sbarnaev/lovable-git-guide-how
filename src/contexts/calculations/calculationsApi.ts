
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { Calculation } from '@/types';
import { toast } from 'sonner';
import { NoteData } from './types';

interface StoredCalculation {
  id: string;
  data: Json;
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

export const fetchUserCalculations = async (userId?: string): Promise<Calculation[]> => {
  if (!userId) return [];
  
  try {
    const { data: storedCalculations, error } = await supabase
      .from('calculations')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return storedCalculations?.map((item: StoredCalculation): Calculation => {
      return {
        ...item.data as unknown as Calculation,
        id: item.id,
        createdAt: item.created_at,
      };
    }) ?? [];
  } catch (error) {
    console.error('Error fetching calculations:', error);
    toast.error('Не удалось загрузить расчеты');
    return [];
  }
};

export const saveCalculation = async (calculation: Calculation, userId?: string): Promise<void> => {
  if (!userId) {
    toast.error('Для сохранения расчетов необходимо авторизоваться');
    return;
  }
  
  try {
    console.log("Saving calculation with user_id:", userId);
    const { error } = await supabase.from('calculations').insert({
      id: calculation.id,
      data: calculation as unknown as Json,
      user_id: userId
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving calculation:', error);
    toast.error('Не удалось сохранить расчет на сервере');
  }
};

export const saveMultipleCalculations = async (calculationsToSave: Calculation[], userId?: string): Promise<void> => {
  if (!userId) {
    toast.error('Для сохранения расчетов необходимо авторизоваться');
    return;
  }
  
  try {
    const formattedData = calculationsToSave.map(calculation => ({
      id: calculation.id,
      data: calculation as unknown as Json,
      created_at: calculation.createdAt,
      user_id: userId
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

export const deleteCalculationById = async (id: string, userId?: string): Promise<void> => {
  if (!userId) {
    toast.error('Для удаления расчетов необходимо авторизоваться');
    return;
  }
  
  try {
    const { error } = await supabase
      .from('calculations')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast.success('Расчет удален');
  } catch (error) {
    console.error('Error deleting calculation:', error);
    toast.error('Не удалось удалить расчет');
  }
};

export const saveCalculationNote = async (calculationId: string, content: string, userId?: string): Promise<NoteData | undefined> => {
  if (!userId) {
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
    return { id: data.id, content: data.content };
  } catch (error) {
    console.error('Error saving note:', error);
    toast.error('Не удалось сохранить заметку');
    return undefined;
  }
};

export const getCalculationNote = async (calculationId: string, userId?: string): Promise<NoteData | undefined> => {
  if (!userId) return undefined;
  
  try {
    const { data, error } = await supabase
      .from('calculation_notes')
      .select('*')
      .eq('calculation_id', calculationId)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    if (data) {
      return { id: data.id, content: data.content, calculation_id: data.calculation_id };
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

export const updateCalculationNote = async (noteId: string, content: string, userId?: string): Promise<NoteData | undefined> => {
  if (!userId) {
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
    return { id: data.id, content: data.content };
  } catch (error) {
    console.error('Error updating note:', error);
    toast.error('Не удалось обновить заметку');
    return undefined;
  }
};
