
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDeepSeekContent, DeepSeekContentType } from '@/services/deepseekService';
import { ArchetypeDescription } from '@/types/numerology';
import { Skeleton } from '@/components/ui/skeleton';

interface AIContentSectionProps {
  title: string;
  type: DeepSeekContentType;
  archetypes: ArchetypeDescription[];
}

export const AIContentSection = ({ title, type, archetypes }: AIContentSectionProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await generateDeepSeekContent(type, archetypes);
        setContent(response.content);
      } catch (err) {
        console.error(`Error fetching ${type} content:`, err);
        setError('Не удалось загрузить контент. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    if (archetypes.length > 0) {
      fetchContent();
    }
  }, [archetypes, type]);

  const formatContent = (text: string) => {
    // Split the text by line breaks and map each line
    return text.split('\n').map((line, index) => (
      line.trim() ? (
        <p key={index} className={`mb-2 ${line.match(/^[А-Я0-9]/) ? 'font-medium' : ''}`}>
          {line}
        </p>
      ) : <br key={index} />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[70%]" />
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : (
          <div className="text-sm">{formatContent(content)}</div>
        )}
      </CardContent>
    </Card>
  );
};
