
/**
 * Сводит число к однозначному числу (1-9)
 */
export function reduceToSingleDigit(num: number): number {
  if (num <= 9) return num;
  
  let sum = 0;
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  
  return sum <= 9 ? sum : reduceToSingleDigit(sum);
}

/**
 * Рассчитывает Код Личности (число дня рождения)
 */
export function calculatePersonalityCode(birthDate: Date): number {
  const day = birthDate.getDate();
  return reduceToSingleDigit(day);
}

/**
 * Рассчитывает Код Коннектора (сумма всех цифр даты рождения)
 */
export function calculateConnectorCode(birthDate: Date): number {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  
  const dateString = `${day}${month}${year}`;
  let sum = 0;
  
  for (let i = 0; i < dateString.length; i++) {
    sum += parseInt(dateString[i]);
  }
  
  return reduceToSingleDigit(sum);
}

/**
 * Рассчитывает Код Реализации (последние 2 цифры года рождения)
 */
export function calculateRealizationCode(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const lastTwoDigits = year % 100;
  
  return reduceToSingleDigit(lastTwoDigits);
}

/**
 * Рассчитывает Код Генератора (день × месяц)
 */
export function calculateGeneratorCode(birthDate: Date): number {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  
  const daySum = reduceToSingleDigit(day);
  const monthSum = reduceToSingleDigit(month);
  
  return reduceToSingleDigit(daySum * monthSum);
}

/**
 * Рассчитывает Код Миссии (Личность + Коннектор)
 * Если получается 11, то оставляем 11
 */
export function calculateMissionCode(personalityCode: number, connectorCode: number): number {
  const sum = personalityCode + connectorCode;
  return sum === 11 ? 11 : reduceToSingleDigit(sum);
}

/**
 * Рассчитывает все коды для заданной даты рождения
 */
export function calculateAllCodes(birthDateString: string) {
  const birthDate = new Date(birthDateString);
  
  const personalityCode = calculatePersonalityCode(birthDate);
  const connectorCode = calculateConnectorCode(birthDate);
  const realizationCode = calculateRealizationCode(birthDate);
  const generatorCode = calculateGeneratorCode(birthDate);
  const missionCode = calculateMissionCode(personalityCode, connectorCode);
  
  return {
    personalityCode,
    connectorCode,
    realizationCode,
    generatorCode,
    missionCode
  };
}
