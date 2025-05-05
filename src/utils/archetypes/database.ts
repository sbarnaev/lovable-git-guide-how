
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { archetypeDescriptionsCache } from "./types";
import { normalizeCodeType, parseTextToArray } from "./helpers";
import { ArchetypeDbRecord } from "./types";
import { loadDescriptionsFromStorage } from "./storage";

/**
 * Преобразует описание архетипа в формат для БД
 */
export function convertToDbRecord(description: ArchetypeDescription): ArchetypeDbRecord {
  // Normalize the code type to ensure consistency
  const normalizedCode = normalizeCodeType(description.code);
  
  return {
    code: normalizedCode,
    value: description.value,
    title: description.title || `Архетип ${description.value}`,
    description: description.description || null,
    male_image_url: description.maleImageUrl || null,
    female_image_url: description.femaleImageUrl || null,
    
    // Код личности
    resource_manifestation: description.resourceManifestation || null,
    distorted_manifestation: description.distortedManifestation || null,
    development_task: description.developmentTask || null,
    resource_qualities: description.resourceQualities || null,
    key_distortions: description.keyDistortions || null,
    
    // Код коннектора
    key_task: description.keyTask || null,
    working_aspects: description.workingAspects || null,
    non_working_aspects: description.nonWorkingAspects || null,
    world_contact_basis: description.worldContactBasis || null,
    
    // Код реализации
    formula: description.formula || null,
    potential_realization_ways: description.potentialRealizationWays || null,
    success_sources: description.successSources || null,
    realization_type: description.realizationType || null,
    realization_obstacles: description.realizationObstacles || null,
    recommendations: description.recommendations || null,
    
    // Код генератора
    generator_formula: description.generatorFormula || null,
    energy_sources: description.energySources || null,
    energy_drains: description.energyDrains || null,
    flow_signs: description.flowSigns || null,
    burnout_signs: description.burnoutSigns || null,
    generator_recommendation: description.generatorRecommendation || null,
    
    // Код миссии
    mission_essence: description.missionEssence || null,
    mission_realization_factors: description.missionRealizationFactors || null,
    mission_challenges: description.missionChallenges || null,
    mission_obstacles: description.missionObstacles || null,
    main_transformation: description.mainTransformation || null,
    
    // Для обратной совместимости
    strengths: description.strengths || null,
    challenges: description.challenges || null,
  };
}

/**
 * Преобразует запись из БД в формат ArchetypeDescription
 */
export function convertFromDbRecord(data: any): ArchetypeDescription {
  return {
    code: data.code as NumerologyCodeType,
    value: data.value,
    title: data.title,
    description: data.description || undefined,
    maleImageUrl: data.male_image_url || undefined,
    femaleImageUrl: data.female_image_url || undefined,
    
    // Код личности
    resourceManifestation: data.resource_manifestation || undefined,
    distortedManifestation: data.distorted_manifestation || undefined,
    developmentTask: data.development_task || undefined,
    resourceQualities: data.resource_qualities || undefined,
    keyDistortions: data.key_distortions || undefined,
    
    // Код коннектора
    keyTask: data.key_task || undefined,
    workingAspects: data.working_aspects || undefined,
    nonWorkingAspects: data.non_working_aspects || undefined,
    worldContactBasis: data.world_contact_basis || undefined,
    
    // Код реализации
    formula: data.formula || undefined,
    potentialRealizationWays: data.potential_realization_ways || undefined,
    successSources: data.success_sources || undefined,
    realizationType: data.realization_type || undefined,
    realizationObstacles: data.realization_obstacles || undefined,
    recommendations: data.recommendations || undefined,
    
    // Код генератора
    generatorFormula: data.generator_formula || undefined,
    energySources: data.energy_sources || undefined,
    energyDrains: data.energy_drains || undefined,
    flowSigns: data.flow_signs || undefined,
    burnoutSigns: data.burnout_signs || undefined,
    generatorRecommendation: data.generator_recommendation || undefined,
    
    // Код миссии
    missionEssence: data.mission_essence || undefined,
    missionRealizationFactors: data.mission_realization_factors || undefined,
    missionChallenges: data.mission_challenges || undefined,
    missionObstacles: data.mission_obstacles || undefined,
    mainTransformation: data.main_transformation || undefined,
    
    // Для обратной совместимости
    strengths: data.strengths || undefined,
    challenges: data.challenges || undefined,
  };
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
      toast.error(`Ошибка загрузки архетипов: ${error.message}`);
      
      // Проверяем наличие данных в localStorage для обратной совместимости
      loadDescriptionsFromStorage();
      
      return false;
    }
    
    if (data && data.length > 0) {
      // Очищаем кеш
      archetypeDescriptionsCache.splice(0, archetypeDescriptionsCache.length);
      
      // Преобразуем данные из БД в формат ArchetypeDescription и добавляем в кеш
      data.forEach(record => {
        const archetype = convertFromDbRecord(record);
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
    toast.error(`Ошибка загрузки архетипов: ${error instanceof Error ? error.message : String(error)}`);
    
    // Проверяем наличие данных в localStorage для обратной совместимости
    loadDescriptionsFromStorage();
    
    return false;
  }
}

/**
 * Добавляет описание архетипа в базу данных
 */
export async function addArchetypeDescription(description: ArchetypeDescription): Promise<boolean> {
  try {
    // Normalize the code type to ensure consistency
    const normalizedCode = normalizeCodeType(description.code);
    console.log('Сохранение архетипа:', normalizedCode, description.value);
    
    // Проверяем, есть ли уже такой архетип в базе
    const { data: existingRecord, error: fetchError } = await supabase
      .from('archetype_descriptions')
      .select('id')
      .eq('code', normalizedCode)
      .eq('value', description.value)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Ошибка при поиске архетипа:', fetchError);
      toast.error(`Ошибка при поиске архетипа: ${fetchError.message}`);
      return false;
    }
    
    // Преобразуем описание архетипа в формат для БД
    const dbRecord = convertToDbRecord(description);

    let result;
    if (existingRecord) {
      // Обновляем существующую запись
      console.log('Обновляем существующий архетип с ID:', existingRecord.id);
      result = await supabase
        .from('archetype_descriptions')
        .update(dbRecord)
        .eq('id', existingRecord.id);
        
      if (result.error) {
        console.error('Ошибка при обновлении архетипа:', result.error);
        toast.error(`Ошибка при обновлении архетипа: ${result.error.message}`);
        throw new Error(`Ошибка при обновлении архетипа: ${result.error.message}`);
      }
      
      console.log(`Архетип обновлен: ${normalizedCode}-${description.value}`);
      toast.success(`Архетип ${normalizedCode}-${description.value} обновлен`);
      
      // Обновляем запись в кеше
      const index = archetypeDescriptionsCache.findIndex(
        desc => normalizeCodeType(desc.code) === normalizedCode && desc.value === description.value
      );
      
      if (index >= 0) {
        archetypeDescriptionsCache[index] = {...description, code: normalizedCode};
      } else {
        archetypeDescriptionsCache.push({...description, code: normalizedCode});
      }
      
      return true;
    } else {
      // Создаем новую запись
      console.log('Создаем новый архетип');
      result = await supabase
        .from('archetype_descriptions')
        .insert(dbRecord);
        
      if (result.error) {
        console.error('Ошибка при добавлении архетипа:', result.error);
        toast.error(`Ошибка при добавлении архетипа: ${result.error.message}`);
        throw new Error(`Ошибка при добавлении архетипа: ${result.error.message}`);
      }
      
      console.log(`Добавлен новый архетип: ${normalizedCode}-${description.value}`);
      toast.success(`Добавлен новый архетип: ${normalizedCode}-${description.value}`);
      
      // Добавляем запись в кеш
      archetypeDescriptionsCache.push({...description, code: normalizedCode});
      
      return true;
    }
  } catch (error) {
    console.error('Ошибка в addArchetypeDescription:', error);
    toast.error(`Ошибка при сохранении архетипа: ${error instanceof Error ? error.message : String(error)}`);
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
 * Получает описание архетипа по коду и значению
 */
export async function getArchetypeDescription(code: NumerologyCodeType, value: number): Promise<ArchetypeDescription | undefined> {
  try {
    // Normalize the code type
    const normalizedCode = normalizeCodeType(code);
    
    // Сначала проверяем кеш
    if (archetypeDescriptionsCache.length === 0) {
      // Если кеш пуст, загружаем данные из базы данных
      await loadArchetypesFromDb();
    }
    
    // Если код 'all', то попробуем найти любое описание с данным значением
    if (normalizedCode === 'all') {
      const result = archetypeDescriptionsCache.find(desc => desc.value === value);
      if (result) return result;
      
      console.log(`Archetype not found for value: ${value}`);
      return undefined;
    }
    
    // Обычный поиск по коду и значению в кеше
    const result = archetypeDescriptionsCache.find(
      desc => normalizeCodeType(desc.code) === normalizedCode && desc.value === value
    );
    
    if (result) {
      return result;
    }
    
    // Если не найдено в кеше, пробуем запросить из базы данных
    console.log(`Archetype not found in cache, querying DB: ${normalizedCode}-${value}`);
    const { data, error } = await supabase
      .from('archetype_descriptions')
      .select('*')
      .eq('code', normalizedCode)
      .eq('value', value)
      .single();
    
    if (error || !data) {
      console.log(`Archetype not found in DB: ${normalizedCode}-${value}`);
      return undefined;
    }
    
    // Преобразуем данные из БД в формат ArchetypeDescription
    const archetype = convertFromDbRecord(data);
    
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
    return descriptions.filter((desc): desc is ArchetypeDescription => desc !== undefined);
  } catch (error) {
    console.error('Error in getArchetypeDescriptions:', error);
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
