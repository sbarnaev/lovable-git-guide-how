
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Локальный кеш для архетипов, чтобы минимизировать запросы к БД
let archetypeDescriptionsCache: ArchetypeDescription[] = [];

/**
 * Добавляет описание архетипа в базу данных
 */
export async function addArchetypeDescription(description: ArchetypeDescription): Promise<boolean> {
  try {
    // Проверяем, есть ли уже такой архетип в базе
    const { data: existingRecord } = await supabase
      .from('archetype_descriptions')
      .select('id')
      .eq('code', description.code)
      .eq('value', description.value)
      .single();
    
    // Преобразуем описание архетипа в формат для БД
    const dbRecord = {
      code: description.code,
      value: description.value,
      title: description.title,
      description: description.description,
      male_image_url: description.maleImageUrl,
      female_image_url: description.femaleImageUrl,
      
      // Код личности
      resource_manifestation: description.resourceManifestation,
      distorted_manifestation: description.distortedManifestation,
      development_task: description.developmentTask,
      resource_qualities: description.resourceQualities,
      key_distortions: description.keyDistortions,
      
      // Код коннектора
      key_task: description.keyTask,
      working_aspects: description.workingAspects,
      non_working_aspects: description.nonWorkingAspects,
      world_contact_basis: description.worldContactBasis,
      
      // Код реализации
      formula: description.formula,
      potential_realization_ways: description.potentialRealizationWays,
      success_sources: description.successSources,
      realization_type: description.realizationType,
      realization_obstacles: description.realizationObstacles,
      recommendations: description.recommendations,
      
      // Код генератора
      generator_formula: description.generatorFormula,
      energy_sources: description.energySources,
      energy_drains: description.energyDrains,
      flow_signs: description.flowSigns,
      burnout_signs: description.burnoutSigns,
      generator_recommendation: description.generatorRecommendation,
      
      // Код миссии
      mission_essence: description.missionEssence,
      mission_realization_factors: description.missionRealizationFactors,
      mission_challenges: description.missionChallenges,
      mission_obstacles: description.missionObstacles,
      main_transformation: description.mainTransformation,
      
      // Для обратной совместимости
      strengths: description.strengths,
      challenges: description.challenges,
    };

    if (existingRecord) {
      // Обновляем существующую запись
      const { error } = await supabase
        .from('archetype_descriptions')
        .update(dbRecord)
        .eq('id', existingRecord.id);
        
      if (error) {
        console.error('Error updating archetype:', error);
        return false;
      }
      
      console.log(`Updated archetype: ${description.code}-${description.value}`);
      
      // Обновляем запись в кеше
      const index = archetypeDescriptionsCache.findIndex(
        desc => desc.code === description.code && desc.value === description.value
      );
      
      if (index >= 0) {
        archetypeDescriptionsCache[index] = description;
      } else {
        archetypeDescriptionsCache.push(description);
      }
      
      return true;
    } else {
      // Создаем новую запись
      const { error } = await supabase
        .from('archetype_descriptions')
        .insert(dbRecord);
        
      if (error) {
        console.error('Error adding archetype:', error);
        return false;
      }
      
      console.log(`Added new archetype: ${description.code}-${description.value}`);
      
      // Добавляем запись в кеш
      archetypeDescriptionsCache.push(description);
      
      return true;
    }
  } catch (error) {
    console.error('Error in addArchetypeDescription:', error);
    return false;
  }
}

/**
 * Добавляет несколько описаний архетипов
 */
export async function addMultipleArchetypeDescriptions(descriptions: ArchetypeDescription[]): Promise<boolean> {
  try {
    // Создаем массив промисов для параллельного выполнения
    const promises = descriptions.map(desc => addArchetypeDescription(desc));
    
    // Ждем, пока все промисы завершатся
    const results = await Promise.all(promises);
    
    // Проверяем, что все операции выполнены успешно
    return results.every(result => result === true);
  } catch (error) {
    console.error('Error in addMultipleArchetypeDescriptions:', error);
    return false;
  }
}

/**
 * Загружает описания всех архетипов из базы данных в кеш
 */
export async function loadArchetypesFromDb(forceRefresh = false): Promise<boolean> {
  try {
    // Если кеш уже заполнен и не требуется обновление, возвращаем true
    if (archetypeDescriptionsCache.length > 0 && !forceRefresh) {
      return true;
    }
    
    // Получаем все архетипы из базы данных
    const { data, error } = await supabase
      .from('archetype_descriptions')
      .select('*');
      
    if (error) {
      console.error('Error loading archetypes from DB:', error);
      
      // Проверяем наличие данных в localStorage для обратной совместимости
      loadDescriptionsFromStorage();
      
      return false;
    }
    
    if (data && data.length > 0) {
      // Очищаем кеш
      archetypeDescriptionsCache = [];
      
      // Преобразуем данные из БД в формат ArchetypeDescription и добавляем в кеш
      data.forEach(record => {
        const archetype: ArchetypeDescription = {
          code: record.code as NumerologyCodeType,
          value: record.value,
          title: record.title,
          description: record.description || undefined,
          maleImageUrl: record.male_image_url || undefined,
          femaleImageUrl: record.female_image_url || undefined,
          
          // Код личности
          resourceManifestation: record.resource_manifestation || undefined,
          distortedManifestation: record.distorted_manifestation || undefined,
          developmentTask: record.development_task || undefined,
          resourceQualities: record.resource_qualities || undefined,
          keyDistortions: record.key_distortions || undefined,
          
          // Код коннектора
          keyTask: record.key_task || undefined,
          workingAspects: record.working_aspects || undefined,
          nonWorkingAspects: record.non_working_aspects || undefined,
          worldContactBasis: record.world_contact_basis || undefined,
          
          // Код реализации
          formula: record.formula || undefined,
          potentialRealizationWays: record.potential_realization_ways || undefined,
          successSources: record.success_sources || undefined,
          realizationType: record.realization_type || undefined,
          realizationObstacles: record.realization_obstacles || undefined,
          recommendations: record.recommendations || undefined,
          
          // Код генератора
          generatorFormula: record.generator_formula || undefined,
          energySources: record.energy_sources || undefined,
          energyDrains: record.energy_drains || undefined,
          flowSigns: record.flow_signs || undefined,
          burnoutSigns: record.burnout_signs || undefined,
          generatorRecommendation: record.generator_recommendation || undefined,
          
          // Код миссии
          missionEssence: record.mission_essence || undefined,
          missionRealizationFactors: record.mission_realization_factors || undefined,
          missionChallenges: record.mission_challenges || undefined,
          missionObstacles: record.mission_obstacles || undefined,
          mainTransformation: record.main_transformation || undefined,
          
          // Для обратной совместимости
          strengths: record.strengths || undefined,
          challenges: record.challenges || undefined,
        };
        
        archetypeDescriptionsCache.push(archetype);
      });
      
      console.log(`Loaded ${archetypeDescriptionsCache.length} archetypes from DB`);
      return true;
    } else {
      console.log('No archetypes found in the database');
      
      // Проверяем наличие данных в localStorage для обратной совместимости
      loadDescriptionsFromStorage();
      
      // Если есть данные в localStorage, сохраняем их в БД
      if (archetypeDescriptionsCache.length > 0) {
        console.log(`Migrating ${archetypeDescriptionsCache.length} archetypes from localStorage to DB`);
        await addMultipleArchetypeDescriptions(archetypeDescriptionsCache);
      }
      
      return archetypeDescriptionsCache.length > 0;
    }
  } catch (error) {
    console.error('Error in loadArchetypesFromDb:', error);
    
    // Проверяем наличие данных в localStorage для обратной совместимости
    loadDescriptionsFromStorage();
    
    return false;
  }
}

/**
 * Получает описание архетипа по коду и значению
 */
export async function getArchetypeDescription(code: NumerologyCodeType, value: number): Promise<ArchetypeDescription | undefined> {
  try {
    // Сначала проверяем кеш
    if (archetypeDescriptionsCache.length === 0) {
      // Если кеш пуст, загружаем данные из базы данных
      await loadArchetypesFromDb();
    }
    
    // Если код 'all', то попробуем найти любое описание с данным значением
    if (code === 'all') {
      const result = archetypeDescriptionsCache.find(desc => desc.value === value);
      if (result) return result;
      
      console.log(`Archetype not found for value: ${value}`);
      return undefined;
    }
    
    // Обычный поиск по коду и значению в кеше
    const result = archetypeDescriptionsCache.find(desc => desc.code === code && desc.value === value);
    
    if (result) {
      return result;
    }
    
    // Если не найдено в кеше, пробуем запросить из базы данных
    console.log(`Archetype not found in cache, querying DB: ${code}-${value}`);
    const { data, error } = await supabase
      .from('archetype_descriptions')
      .select('*')
      .eq('code', code)
      .eq('value', value)
      .single();
    
    if (error || !data) {
      console.log(`Archetype not found in DB: ${code}-${value}`);
      return undefined;
    }
    
    // Преобразуем данные из БД в формат ArchetypeDescription
    const archetype: ArchetypeDescription = {
      code: data.code as NumerologyCodeType,
      value: data.value,
      title: data.title,
      description: data.description || undefined,
      maleImageUrl: data.male_image_url || undefined,
      femaleImageUrl: data.female_image_url || undefined,
      
      // ... остальные поля аналогично предыдущему преобразованию
      resourceManifestation: data.resource_manifestation || undefined,
      distortedManifestation: data.distorted_manifestation || undefined,
      developmentTask: data.development_task || undefined,
      resourceQualities: data.resource_qualities || undefined,
      keyDistortions: data.key_distortions || undefined,
      
      keyTask: data.key_task || undefined,
      workingAspects: data.working_aspects || undefined,
      nonWorkingAspects: data.non_working_aspects || undefined,
      worldContactBasis: data.world_contact_basis || undefined,
      
      formula: data.formula || undefined,
      potentialRealizationWays: data.potential_realization_ways || undefined,
      successSources: data.success_sources || undefined,
      realizationType: data.realization_type || undefined,
      realizationObstacles: data.realization_obstacles || undefined,
      recommendations: data.recommendations || undefined,
      
      generatorFormula: data.generator_formula || undefined,
      energySources: data.energy_sources || undefined,
      energyDrains: data.energy_drains || undefined,
      flowSigns: data.flow_signs || undefined,
      burnoutSigns: data.burnout_signs || undefined,
      generatorRecommendation: data.generator_recommendation || undefined,
      
      missionEssence: data.mission_essence || undefined,
      missionRealizationFactors: data.mission_realization_factors || undefined,
      missionChallenges: data.mission_challenges || undefined,
      missionObstacles: data.mission_obstacles || undefined,
      mainTransformation: data.main_transformation || undefined,
      
      strengths: data.strengths || undefined,
      challenges: data.challenges || undefined,
    };
    
    // Добавляем в кеш
    archetypeDescriptionsCache.push(archetype);
    
    return archetype;
  } catch (error) {
    console.error('Error in getArchetypeDescription:', error);
    return undefined;
  }
}

/**
 * Получает все описания архетипов для определенных кодов
 */
export async function getArchetypeDescriptions(codes: { type: NumerologyCodeType, value: number }[]): Promise<ArchetypeDescription[]> {
  try {
    const promises = codes.map(code => getArchetypeDescription(code.type, code.value));
    const descriptions = await Promise.all(promises);
    return descriptions.filter(desc => desc !== undefined) as ArchetypeDescription[];
  } catch (error) {
    console.error('Error in getArchetypeDescriptions:', error);
    return [];
  }
}

/**
 * Получает все описания архетипов
 */
export function getAllArchetypeDescriptions(): ArchetypeDescription[] {
  return [...archetypeDescriptionsCache];
}

/**
 * Сохраняет описания архетипов в локальное хранилище (для обратной совместимости)
 */
function saveDescriptionsToStorage() {
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
      archetypeDescriptionsCache = [];
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
 * Получает все значения для конкретного типа кода
 */
export async function getValuesForCodeType(codeType: NumerologyCodeType): Promise<number[]> {
  try {
    // Загружаем архетипы из базы данных, если кеш пуст
    if (archetypeDescriptionsCache.length === 0) {
      await loadArchetypesFromDb();
    }
    
    const values = archetypeDescriptionsCache
      .filter(desc => desc.code === codeType)
      .map(desc => desc.value);
    
    // Возвращаем уникальные значения, отсортированные по возрастанию
    return Array.from(new Set(values)).sort((a, b) => a - b);
  } catch (error) {
    console.error('Error in getValuesForCodeType:', error);
    return [];
  }
}

// Инициализируем загрузкой архетипов из базы данных
loadArchetypesFromDb().then(success => {
  if (!success) {
    console.log('Failed to load archetypes from DB, using localStorage as fallback');
  }
}).catch(error => {
  console.error('Error during initial archetype loading:', error);
});
