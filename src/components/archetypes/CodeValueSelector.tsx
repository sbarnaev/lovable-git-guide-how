
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumerologyCodeType } from '@/types/numerology';

interface CodeValueSelectorProps {
  selectedCode: NumerologyCodeType;
  setSelectedCode: (code: NumerologyCodeType) => void;
  selectedValue: number;
  setSelectedValue: (value: number) => void;
  loading?: boolean;
}

export const CodeValueSelector = ({
  selectedCode,
  setSelectedCode,
  selectedValue,
  setSelectedValue,
  loading = false
}: CodeValueSelectorProps) => {
  const normalizeCode = (code: NumerologyCodeType): NumerologyCodeType => {
    const codeMap: Record<string, NumerologyCodeType> = {
      'personalityCode': 'personality',
      'connectorCode': 'connector', 
      'realizationCode': 'realization',
      'generatorCode': 'generator',
      'missionCode': 'mission'
    };
    
    return (codeMap[code] as NumerologyCodeType) || code;
  };

  // Доступные коды
  const codeOptions = [
    { value: 'personality', label: 'Код Личности' },
    { value: 'connector', label: 'Код Коннектора' },
    { value: 'realization', label: 'Код Реализации' },
    { value: 'generator', label: 'Код Генератора' },
    { value: 'mission', label: 'Код Миссии' }
  ];

  // Генерируем доступные значения в зависимости от кода
  const normalizedCode = normalizeCode(selectedCode);
  
  // Добавляем мастер-число 11 для кода миссии
  const valueOptions = normalizedCode === 'mission' 
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 11] 
    : [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="text-sm font-medium mb-2">Код</div>
        <Select 
          value={normalizedCode} 
          onValueChange={(value) => setSelectedCode(value as NumerologyCodeType)}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите код" />
          </SelectTrigger>
          <SelectContent>
            {codeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <div className="text-sm font-medium mb-2">Значение</div>
        <Select 
          value={String(selectedValue)} 
          onValueChange={(value) => setSelectedValue(Number(value))}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите значение" />
          </SelectTrigger>
          <SelectContent>
            {valueOptions.map(value => (
              <SelectItem key={value} value={String(value)}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
