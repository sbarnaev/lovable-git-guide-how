
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
  } else {
    // Add new description
    archetypeDescriptionsDB.push(description);
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
  return archetypeDescriptionsDB.find(desc => desc.code === code && desc.value === value);
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
}

/**
 * Загружает описания архетипов из локального хранилища
 */
export function loadDescriptionsFromStorage() {
  const storedDescriptions = localStorage.getItem('numerica_archetype_descriptions');
  
  if (storedDescriptions) {
    const descriptions = JSON.parse(storedDescriptions);
    
    // Clear current database and add loaded descriptions
    archetypeDescriptionsDB.length = 0;
    descriptions.forEach((desc: ArchetypeDescription) => archetypeDescriptionsDB.push(desc));
  }
}

// Initialize by loading saved descriptions
loadDescriptionsFromStorage();
