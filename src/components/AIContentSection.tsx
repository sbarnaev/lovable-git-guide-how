
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDeepSeekContent, DeepSeekContentType } from '@/services/deepseekService';
import { ArchetypeDescription } from '@/types/numerology';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AIContentSectionProps {
  title: string;
  type: DeepSeekContentType;
  archetypes: ArchetypeDescription[];
}

export const AIContentSection = ({ title, type, archetypes }: AIContentSectionProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateDeepSeekContent(type, archetypes);
      setContent(response.content);
    } catch (err: any) {
      console.error(`Error fetching ${type} content:`, err);
      setError('Не удалось загрузить контент. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        {error && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchContent} 
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Обновить</span>
          </Button>
        )}
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
