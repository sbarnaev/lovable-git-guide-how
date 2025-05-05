
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";
import { archetypeDescriptionsCache } from "./types";
import { normalizeCodeType } from "./helpers";

/**
 * Сохраняет описания архетипов в локальное хранилище (для обратной совместимости)
 */
export function saveDescriptionsToStorage() {
  localStorage.setItem('numerica_archetype_descriptions', JSON.stringify(archetypeDescriptionsCache));
  console.log(`Saved ${archetypeDescriptionsCache.length} archetypes to storage`);
}

/**
 * Загружает описания архетипов из локального хранилища (для обратной совместимости)
 */
export function loadDescriptionsFromStorage(): boolean {
  try {
    const storedDescriptions = localStorage.getItem('numerica_archetype_descriptions');
    
    if (storedDescriptions) {
      const descriptions = JSON.parse(storedDescriptions);
      
      // Очищаем текущую базу и добавляем загруженные описания
      archetypeDescriptionsCache.splice(0, archetypeDescriptionsCache.length);
      descriptions.forEach((desc: ArchetypeDescription) => archetypeDescriptionsCache.push(desc));
      
      console.log(`Loaded ${archetypeDescriptionsCache.length} archetypes from storage`);
      return true;
    } else {
      console.log('No stored archetype descriptions found');
      return false;
    }
  } catch (error) {
    console.error('Error loading archetype descriptions from storage:', error);
    return false;
  }
}

/**
 * Получает все описания архетипов
 */
export function getAllArchetypeDescriptions(): ArchetypeDescription[] {
  return [...archetypeDescriptionsCache];
}
