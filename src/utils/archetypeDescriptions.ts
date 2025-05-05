
// Этот файл служит точкой входа для API архетипов
// Он реэкспортирует все необходимые функции из подмодулей

import { archetypeDescriptionsCache, codeTypeToDisplay, codeTypeTranslations } from './archetypes/types';
import { normalizeCodeType, parseTextToArray, getValuesForCodeType } from './archetypes/helpers';
import { loadDescriptionsFromStorage, saveDescriptionsToStorage, getAllArchetypeDescriptions } from './archetypes/storage';
import { 
  loadArchetypesFromDb, 
  addArchetypeDescription, 
  addMultipleArchetypeDescriptions,
  getArchetypeDescription,
  getArchetypeDescriptions
} from './archetypes/database';

// Экспортируем все необходимые функции и типы
export {
  // Типы
  archetypeDescriptionsCache,
  codeTypeToDisplay,
  codeTypeTranslations,
  
  // Утилиты
  normalizeCodeType,
  parseTextToArray,
  getValuesForCodeType,
  
  // Хранение
  loadDescriptionsFromStorage,
  saveDescriptionsToStorage,
  getAllArchetypeDescriptions,
  
  // База данных
  loadArchetypesFromDb,
  addArchetypeDescription,
  addMultipleArchetypeDescriptions,
  getArchetypeDescription,
  getArchetypeDescriptions
};
