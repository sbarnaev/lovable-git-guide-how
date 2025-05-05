
import { useState, useEffect } from 'react';
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';
import { 
  getArchetypeDescription, 
  getAllArchetypeDescriptions,
  loadArchetypesFromDb
} from '@/utils/archetypeDescriptions';
import { toast } from "sonner";

export const useArchetypesData = () => {
  const [descriptions, setDescriptions] = useState<ArchetypeDescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load all descriptions
  useEffect(() => {
    const loadDescriptions = async () => {
      setLoading(true);
      try {
        await loadArchetypesFromDb(true);
        const allDescriptions = getAllArchetypeDescriptions();
        setDescriptions(allDescriptions);
      } catch (error) {
        console.error("Error loading descriptions:", error);
        toast.error("Не удалось загрузить архетипы");
      } finally {
        setLoading(false);
      }
    };
    
    loadDescriptions();
  }, []);

  /**
   * Загружает архетип по коду и значению
   */
  const loadArchetype = async (code: NumerologyCodeType, value: number) => {
    setLoading(true);
    
    try {
      const desc = await getArchetypeDescription(code, value);
      return desc;
    } catch (error) {
      console.error("Error loading archetype:", error);
      toast.error(`Ошибка загрузки архетипа: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обновляет список всех архетипов
   */
  const refreshArchetypes = async () => {
    try {
      await loadArchetypesFromDb(true);
      const allDescriptions = getAllArchetypeDescriptions();
      setDescriptions(allDescriptions);
    } catch (error) {
      console.error("Error refreshing archetypes:", error);
    }
  };

  return {
    descriptions,
    setDescriptions,
    loading,
    setLoading,
    loadArchetype,
    refreshArchetypes
  };
};
