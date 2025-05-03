
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";

// Placeholder for the archetype descriptions database
// This will be populated with your detailed descriptions
const archetypeDescriptionsDB: ArchetypeDescription[] = [];

/**
 * Добавляет описание архетипа в базу данных
 */
export function addArchetypeDescription(description: ArchetypeDescription) {
  // Check if description already exists
  const existingIndex = archetypeDescriptionsDB.findIndex(
    desc => desc.code === description.code && desc.value === description.value
  );
  
  if (existingIndex >= 0) {
    // Replace existing description
    archetypeDescriptionsDB[existingIndex] = description;
    console.log(`Updated archetype: ${description.code}-${description.value}`);
  } else {
    // Add new description
    archetypeDescriptionsDB.push(description);
    console.log(`Added new archetype: ${description.code}-${description.value}`);
  }
  
  // Save to localStorage for persistence
  saveDescriptionsToStorage();
}

/**
 * Добавляет несколько описаний архетипов
 */
export function addMultipleArchetypeDescriptions(descriptions: ArchetypeDescription[]) {
  descriptions.forEach(desc => addArchetypeDescription(desc));
}

/**
 * Получает описание архетипа по коду и значению
 */
export function getArchetypeDescription(code: NumerologyCodeType, value: number): ArchetypeDescription | undefined {
  // Если код 'all', то попробуем найти любое описание с данным значением
  if (code === 'all') {
    const result = archetypeDescriptionsDB.find(desc => desc.value === value);
    if (result) return result;
    
    console.log(`Archetype not found for value: ${value}`);
    return undefined;
  }
  
  // Обычный поиск по коду и значению
  const result = archetypeDescriptionsDB.find(desc => desc.code === code && desc.value === value);
  
  // Debug logging to help diagnose issues
  if (!result) {
    console.log(`Archetype not found: ${code}-${value}`);
  }
  
  return result;
}

/**
 * Получает все описания архетипов для определенных кодов
 */
export function getArchetypeDescriptions(codes: { type: NumerologyCodeType, value: number }[]): ArchetypeDescription[] {
  return codes
    .map(code => getArchetypeDescription(code.type, code.value))
    .filter(desc => desc !== undefined) as ArchetypeDescription[];
}

/**
 * Получает все описания архетипов
 */
export function getAllArchetypeDescriptions(): ArchetypeDescription[] {
  return [...archetypeDescriptionsDB];
}

/**
 * Сохраняет описания архетипов в локальное хранилище
 */
function saveDescriptionsToStorage() {
  localStorage.setItem('numerica_archetype_descriptions', JSON.stringify(archetypeDescriptionsDB));
  console.log(`Saved ${archetypeDescriptionsDB.length} archetypes to storage`);
}

/**
 * Загружает описания архетипов из локального хранилища
 */
export function loadDescriptionsFromStorage() {
  const storedDescriptions = localStorage.getItem('numerica_archetype_descriptions');
  
  if (storedDescriptions) {
    try {
      const descriptions = JSON.parse(storedDescriptions);
      
      // Clear current database and add loaded descriptions
      archetypeDescriptionsDB.length = 0;
      descriptions.forEach((desc: ArchetypeDescription) => archetypeDescriptionsDB.push(desc));
      
      console.log(`Loaded ${archetypeDescriptionsDB.length} archetypes from storage`);
    } catch (error) {
      console.error('Error loading archetype descriptions from storage:', error);
    }
  } else {
    console.log('No stored archetype descriptions found');
  }
}

/**
 * Получает все значения для конкретного типа кода
 */
export function getValuesForCodeType(codeType: NumerologyCodeType): number[] {
  const values = archetypeDescriptionsDB
    .filter(desc => desc.code === codeType)
    .map(desc => desc.value);
  
  // Возвращаем уникальные значения, отсортированные по возрастанию
  return Array.from(new Set(values)).sort((a, b) => a - b);
}

// Initialize by loading saved descriptions
loadDescriptionsFromStorage();
