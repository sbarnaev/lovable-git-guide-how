
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ArchetypeDescription } from '@/types/numerology';

interface ArchetypeDetailsProps {
  archetype: ArchetypeDescription | undefined;
}

export const ArchetypeDetails: React.FC<ArchetypeDetailsProps> = ({ archetype }) => {
  if (!archetype) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-center py-8">
          Информация по данному коду отсутствует
        </p>
      </div>
    );
  }
  
  // Функция для форматирования текста с учетом списков и заголовков
  const formatText = (text: string | undefined | number) => {
    // If text is undefined or null, return null
    if (text === undefined || text === null) return null;
    
    // Convert to string if it's not already a string (e.g., if it's a number)
    const textStr = typeof text === 'string' ? text : String(text);
    
    return textStr.split('\n').map((line, index) => {
      line = line.trim();
      
      // Пустая строка
      if (!line) return <div key={`empty-${index}`} className="h-2"></div>;
      
      // Заголовок (строка с двоеточием в конце)
      if (/^.{3,50}:$/.test(line)) {
        return (
          <h3 key={index} className="font-semibold text-lg mt-6 mb-2 text-indigo-700">
            {line}
          </h3>
        );
      }
      
      // Маркированные списки
      if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
        return (
          <li key={index} className="ml-5 mb-3 list-disc">
            {line.substring(1).trim()}
          </li>
        );
      }
      
      // Нумерованные списки
      const numberedMatch = line.match(/^(\d+)[\.)\]]\s+(.+)$/);
      if (numberedMatch) {
        return (
          <div key={index} className="flex mb-3 pl-5 gap-2">
            <span className="font-medium text-indigo-600">{numberedMatch[1]}.</span>
            <span>{numberedMatch[2]}</span>
          </div>
        );
      }
      
      // Обычный параграф
      return (
        <p key={index} className="mb-3 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Header with code and title */}
      <div className="flex flex-col mb-6">
        <h2 className="text-xl font-bold text-indigo-600">
          {archetype.code && archetype.code.toString().replace(/Code$/, '')} {archetype.value}
        </h2>
        {archetype.title && (
          <p className="text-lg font-medium mt-1">{archetype.title}</p>
        )}
      </div>
      
      {/* Main content with formatting */}
      <div className="prose prose-indigo max-w-none">
        {formatText(archetype.description)}
      </div>
      
      {/* Additional sections */}
      {Object.entries(archetype).map(([key, value]) => {
        // Пропускаем уже отображенные или служебные поля
        if (['code', 'value', 'title', 'description', 'id'].includes(key) || !value) {
          return null;
        }
        
        return (
          <div key={key} className="mt-8">
            <h3 className="text-lg font-semibold mb-3 text-indigo-600 border-b pb-2">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </h3>
            <div className="prose prose-indigo max-w-none">
              {formatText(value as string)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
