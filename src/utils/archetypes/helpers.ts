
import { NumerologyCodeType } from "@/types/numerology";
import { archetypeDescriptionsCache } from "./types";

/**
 * Нормализует тип кода для обеспечения совместимости
 */
export function normalizeCodeType(code: NumerologyCodeType | string): NumerologyCodeType {
  // Map old format to new format
  const codeMap: Record<string, NumerologyCodeType> = {
    'personalityCode': 'personality',
    'connectorCode': 'connector',
    'realizationCode': 'realization',
    'generatorCode': 'generator',
    'missionCode': 'mission'
  };
  
  return (codeMap[code] as NumerologyCodeType) || code as NumerologyCodeType;
}

/**
 * Преобразует текст в массив строк (разделяя по переносу строки)
 */
export function parseTextToArray(text: string): string[] {
  return text
    .split('\n')
    .map(str => str.trim())
    .filter(str => str !== "");
}

/**
 * Получает все значения для конкретного типа кода
 */
export function getValuesForCodeType(codeType: NumerologyCodeType): number[] {
  const normalizedCode = normalizeCodeType(codeType);
  const values = archetypeDescriptionsCache
    .filter(desc => normalizeCodeType(desc.code) === normalizedCode)
    .map(desc => desc.value);
  
  // Возвращаем уникальные значения, отсортированные по возрастанию
  return Array.from(new Set(values)).sort((a, b) => a - b);
}
