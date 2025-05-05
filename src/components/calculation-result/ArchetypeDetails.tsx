
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
    
    // Split by newline and process each line
    const lines = textStr.split('\n');
    const formattedContent = [];
    let currentList: JSX.Element[] = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Empty line - add spacing
      if (!line) {
        if (inList) {
          // End the current list if we were in one
          formattedContent.push(<ul key={`list-${i}`} className="list-disc pl-6 space-y-1 my-3">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        formattedContent.push(<div key={`empty-${i}`} className="h-2"></div>);
        continue;
      }
      
      // Section header (line ending with colon)
      if (/^.{3,50}:$/.test(line)) {
        if (inList) {
          // End the current list if we were in one
          formattedContent.push(<ul key={`list-${i}`} className="list-disc pl-6 space-y-1 my-3">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        formattedContent.push(
          <h3 key={`header-${i}`} className="font-medium text-lg mt-5 mb-3">
            {line}
          </h3>
        );
        continue;
      }
      
      // Bullet point lists (starting with -, •, or *)
      if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
        const content = line.substring(1).trim();
        const isNegative = /^Что (не работает|мешает|забирает|искажения)/i.test(formattedContent[formattedContent.length - 1]?.props?.children || '');
        
        currentList.push(
          <li key={`bullet-${i}`} className="flex items-start mb-1">
            <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${isNegative ? 'bg-red-500' : 'bg-green-500'}`}></span>
            <span className="ml-2">{content}</span>
          </li>
        );
        inList = true;
        continue;
      }
      
      // Numbered lists (1., 2., etc.)
      const numberedMatch = line.match(/^(\d+)[\.)\]]\s+(.+)$/);
      if (numberedMatch) {
        if (inList && currentList.length > 0) {
          // If previous items were bullet points, end that list
          formattedContent.push(<ul key={`list-${i}`} className="list-disc pl-6 space-y-1 my-3">{currentList}</ul>);
          currentList = [];
        }
        
        formattedContent.push(
          <div key={`numbered-${i}`} className="flex mb-2 pl-2 gap-2">
            <span className="font-medium text-indigo-600 min-w-[1.5rem]">{numberedMatch[1]}.</span>
            <span>{numberedMatch[2]}</span>
          </div>
        );
        continue;
      }
      
      // Regular paragraph
      if (inList) {
        // End the current list if we were in one
        formattedContent.push(<ul key={`list-${i}`} className="list-disc pl-6 space-y-1 my-3">{currentList}</ul>);
        currentList = [];
        inList = false;
      }
      
      formattedContent.push(
        <p key={`para-${i}`} className="mb-3 leading-relaxed">
          {line}
        </p>
      );
    }
    
    // Don't forget to add the last list if we were still in one
    if (inList && currentList.length > 0) {
      formattedContent.push(<ul key="final-list" className="list-disc pl-6 space-y-1 my-3">{currentList}</ul>);
    }
    
    return formattedContent;
  };

  // Generate key-background color pairs based on common section names
  const getSectionBackground = (key: string): string => {
    const keyLower = key.toLowerCase();
    
    if (keyLower.includes('суть') || keyLower.includes('формула') || keyLower.includes('ресурс') || 
        keyLower.includes('миссия') || keyLower.includes('key') || keyLower.includes('основа')) {
      return 'bg-purple-50';
    }
    
    if (keyLower.includes('трансформац') || keyLower.includes('задача') || keyLower.includes('контакт') || 
        keyLower.includes('проявлен') || keyLower.includes('тип')) {
      return 'bg-blue-50';
    }
    
    if (keyLower.includes('реализ') || keyLower.includes('потенциал') || keyLower.includes('работ')) {
      return 'bg-green-50/60';  
    }
    
    if (keyLower.includes('испытан') || keyLower.includes('искажен') || keyLower.includes('сложн')) {
      return 'bg-yellow-50';
    }
    
    if (keyLower.includes('рекоменд') || keyLower.includes('совет')) {
      return 'bg-blue-50/70';
    }
    
    return '';
  };

  return (
    <div className="space-y-4">
      {/* Title display with code value */}
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold">
          {archetype.title || `${archetype.code?.toString().replace(/Code$/, '')} ${archetype.value}`}
        </h2>
      </div>
      
      {/* Main content with formatting */}
      {archetype.description && (
        <div className="prose max-w-none">
          {formatText(archetype.description)}
        </div>
      )}
      
      {/* Additional sections with appropriate styling */}
      {Object.entries(archetype).map(([key, value]) => {
        // Skip already displayed or service fields
        if (['code', 'value', 'title', 'description', 'id'].includes(key) || !value) {
          return null;
        }
        
        // Translate common English keys to Russian
        const keyTranslations: Record<string, string> = {
          'meaning': 'Значение',
          'strengths': 'Сильные стороны',
          'weaknesses': 'Слабые стороны',
          'recommendations': 'Рекомендации',
          'characteristics': 'Характеристики',
          'challenges': 'Вызовы',
          'potentialIssues': 'Потенциальные проблемы',
          'insights': 'Инсайты',
          'keyFeatures': 'Ключевые особенности',
          'summary': 'Краткое описание'
        };
        
        // Format the key for display
        const displayKey = keyTranslations[key] || 
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        
        // Determine background color
        const bgColor = getSectionBackground(key);
        
        return (
          <div key={key} className="mt-5">
            <h3 className="text-lg font-medium mb-3">
              {displayKey}
            </h3>
            <div className={`prose max-w-none p-4 rounded-md border ${bgColor}`}>
              {formatText(value as string)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
