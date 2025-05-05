
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
          formattedContent.push(<ul key={`list-${i}`} className="list-disc pl-6 space-y-2 my-3">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        formattedContent.push(<div key={`empty-${i}`} className="h-4"></div>);
        continue;
      }
      
      // Section header (line ending with colon)
      if (/^.{3,50}:$/.test(line)) {
        if (inList) {
          // End the current list if we were in one
          formattedContent.push(<ul key={`list-${i}`} className="list-disc pl-6 space-y-2 my-3">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        formattedContent.push(
          <h3 key={`header-${i}`} className="font-semibold text-lg mt-6 mb-3 text-indigo-700 border-b pb-1">
            {line}
          </h3>
        );
        continue;
      }
      
      // Bullet point lists (starting with -, •, or *)
      if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
        const content = line.substring(1).trim();
        currentList.push(<li key={`bullet-${i}`} className="mb-2">{content}</li>);
        inList = true;
        continue;
      }
      
      // Numbered lists (1., 2., etc.)
      const numberedMatch = line.match(/^(\d+)[\.)\]]\s+(.+)$/);
      if (numberedMatch) {
        if (inList && currentList.length > 0) {
          // If previous items were bullet points, end that list
          formattedContent.push(<ul key={`list-${i}`} className="list-disc pl-6 space-y-2 my-3">{currentList}</ul>);
          currentList = [];
        }
        
        formattedContent.push(
          <div key={`numbered-${i}`} className="flex mb-3 pl-2 gap-2">
            <span className="font-medium text-indigo-600 min-w-[1.5rem]">{numberedMatch[1]}.</span>
            <span>{numberedMatch[2]}</span>
          </div>
        );
        continue;
      }
      
      // Regular paragraph
      if (inList) {
        // End the current list if we were in one
        formattedContent.push(<ul key={`list-${i}`} className="list-disc pl-6 space-y-2 my-3">{currentList}</ul>);
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
      formattedContent.push(<ul key="final-list" className="list-disc pl-6 space-y-2 my-3">{currentList}</ul>);
    }
    
    return formattedContent;
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
        
        return (
          <div key={key} className="mt-8">
            <h3 className="text-lg font-semibold mb-3 text-indigo-600 border-b pb-2">
              {displayKey}
            </h3>
            <div className="prose prose-indigo max-w-none bg-indigo-50/50 p-4 rounded-md border border-indigo-100">
              {formatText(value as string)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
