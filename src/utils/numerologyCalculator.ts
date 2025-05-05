
/**
 * Сводит число к однозначному числу (1-9)
 */
export function reduceToSingleDigit(num: number): number {
  // Special handling for master numbers 11 and 22
  if (num === 11 || num === 22) {
    return num;
  }

  if (num <= 9) return num;
  
  let sum = 0;
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  
  // Check again for master numbers after reduction
  if (sum === 11 || sum === 22) {
    return sum;
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
  
  // Format with padding to ensure proper parsing
  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  
  const dateString = `${formattedDay}${formattedMonth}${year}`;
  console.log(`Connector calculation: dateString = ${dateString}`);
  
  let sum = 0;
  for (let i = 0; i < dateString.length; i++) {
    sum += parseInt(dateString[i]);
  }
  
  console.log(`Connector calculation: sum before reduction = ${sum}`);
  const result = reduceToSingleDigit(sum);
  console.log(`Connector calculation: final result = ${result}`);
  
  return result;
}

/**
 * Рассчитывает Код Реализации (последние 2 цифры года рождения)
 */
export function calculateRealizationCode(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const lastTwoDigits = year % 100;
  console.log(`Realization calculation: year = ${year}, lastTwoDigits = ${lastTwoDigits}`);
  
  const result = reduceToSingleDigit(lastTwoDigits);
  console.log(`Realization calculation: final result = ${result}`);
  
  return result;
}

/**
 * Рассчитывает Код Генератора (день × месяц)
 */
export function calculateGeneratorCode(birthDate: Date): number {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  
  console.log(`Generator calculation: day = ${day}, month = ${month}, product = ${day * month}`);
  
  const result = reduceToSingleDigit(day * month);
  console.log(`Generator calculation: final result = ${result}`);
  
  return result;
}

/**
 * Рассчитывает Код Миссии (Личность + Коннектор)
 * Если получается 11, то оставляем 11 (мастер-число)
 */
export function calculateMissionCode(personalityCode: number, connectorCode: number): number {
  const sum = personalityCode + connectorCode;
  console.log(`Mission calculation: personalityCode = ${personalityCode}, connectorCode = ${connectorCode}, sum = ${sum}`);
  
  // Preserve master numbers
  if (sum === 11 || sum === 22) {
    console.log(`Mission calculation: Keeping master number ${sum}`);
    return sum;
  }
  
  const result = reduceToSingleDigit(sum);
  console.log(`Mission calculation: final result = ${result}`);
  
  return result;
}

/**
 * Рассчитывает все коды для заданной даты рождения
 */
export function calculateAllCodes(birthDateString: string) {
  console.log(`Calculating codes for birthDate: ${birthDateString}`);
  
  // Ensure proper date parsing regardless of format
  let birthDate: Date;
  
  if (birthDateString.includes('T')) {
    // ISO format with time
    birthDate = new Date(birthDateString);
  } else if (birthDateString.includes('-')) {
    // YYYY-MM-DD format
    const [year, month, day] = birthDateString.split('-').map(Number);
    birthDate = new Date(year, month - 1, day);
  } else if (birthDateString.includes('.')) {
    // DD.MM.YYYY format
    const [day, month, year] = birthDateString.split('.').map(Number);
    birthDate = new Date(year, month - 1, day);
  } else {
    // Fallback
    birthDate = new Date(birthDateString);
  }
  
  console.log(`Parsed date: ${birthDate.toISOString()}`);
  
  const personalityCode = calculatePersonalityCode(birthDate);
  const connectorCode = calculateConnectorCode(birthDate);
  const realizationCode = calculateRealizationCode(birthDate);
  const generatorCode = calculateGeneratorCode(birthDate);
  const missionCode = calculateMissionCode(personalityCode, connectorCode);
  
  const result = {
    personalityCode,
    connectorCode,
    realizationCode,
    generatorCode,
    missionCode
  };
  
  console.log("Final calculated codes:", result);
  
  return result;
}
