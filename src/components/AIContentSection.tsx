
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  generateDeepSeekContent, 
  DeepSeekContentType, 
  saveGeneratedContent, 
  getGeneratedContent 
} from '@/services/deepseekService';
import { ArchetypeDescription } from '@/types/numerology';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIContentSectionProps {
  title: string;
  type: DeepSeekContentType;
  archetypes: ArchetypeDescription[];
  calculationId: string;
}

export const AIContentSection = ({ title, type, archetypes, calculationId }: AIContentSectionProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Memoize the fetchContent function to prevent unnecessary re-renders
  const fetchContent = useCallback(async () => {
    if (!calculationId || archetypes.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First try to get saved content
      const savedContent = await getGeneratedContent(calculationId, type);
      
      if (savedContent) {
        setContent(savedContent.content);
        setLoading(false);
        return;
      }
      
      // If no saved content, generate new content
      setIsGenerating(true);
      const response = await generateDeepSeekContent(type, archetypes);
      
      if (!response || !response.content) {
        throw new Error('Failed to generate content');
      }
      
      // Save the generated content
      await saveGeneratedContent(calculationId, type, response.content);
      
      setContent(response.content);
    } catch (err: any) {
      console.error(`Error fetching ${type} content:`, err);
      setError('Не удалось загрузить контент. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
      setIsGenerating(false);
      setInitialized(true);
    }
  }, [calculationId, archetypes, type]);

  // Use effect with proper dependencies to prevent infinite loops
  useEffect(() => {
    if (calculationId && archetypes.length > 0 && !initialized) {
      fetchContent();
    }
  }, [fetchContent, initialized, calculationId, archetypes.length]);

  // Pre-process content once instead of on every render
  const formattedContent = (() => {
    if (!content) return [];
    
    try {
      // Remove markdown markers like ** and ## that we don't want
      let processedText = content.replace(/\*\*/g, '');
      
      // Handle headings more effectively
      processedText = processedText.replace(/^#{1,6}\s+(.+)$/gm, '<h3>$1</h3>');
      
      // Split the text by line breaks and map each line
      return processedText.split('\n').map((line, index) => {
        line = line.trim();
        
        // Skip empty lines
        if (!line) return <br key={index} />;
        
        // Process HTML heading tags that we converted earlier
        if (line.match(/<h[1-6]>(.+)<\/h[1-6]>/)) {
          return (
            <h3 key={index} className="font-semibold text-lg mt-6 mb-3 text-numerica">
              {line.replace(/<h[1-6]>(.+)<\/h[1-6]>/, '$1')}
            </h3>
          );
        }
        
        // Check for section headers (lines that end with a colon)
        if (line.match(/^.{3,40}:$/)) {
          return (
            <h3 key={index} className="font-semibold text-lg mt-6 mb-3 text-numerica">
              {line}
            </h3>
          );
        }
        
        // Check for bullet points
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          return (
            <li key={index} className="ml-5 mb-3 pl-1">
              {line.substring(1).trim()}
            </li>
          );
        }
        
        // Check for numbered points
        const numberedMatch = line.match(/^(\d+)[\.\)]\s+(.+)$/);
        if (numberedMatch) {
          return (
            <div key={index} className="flex mb-3 pl-5 gap-2">
              <span className="font-medium">{numberedMatch[1]}.</span>
              <span>{numberedMatch[2]}</span>
            </div>
          );
        }
        
        // Regular paragraph with better spacing and styling
        return (
          <p key={index} className={cn(
            "mb-3 leading-relaxed",
            line.length < 100 && line.match(/^[А-Я0-9]/) ? "font-medium" : ""
          )}>
            {line}
          </p>
        );
      });
    } catch (err) {
      console.error("Error formatting content:", err);
      return [<p key="error" className="text-destructive">Ошибка форматирования контента.</p>];
    }
  })();

  const handleRefresh = () => {
    setContent('');
    setInitialized(false);
    fetchContent();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-card border-b">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={loading || isGenerating}
          className="h-8 w-8 p-0"
          title="Обновить контент"
        >
          <RefreshCw className={cn("h-4 w-4", (loading || isGenerating) ? "animate-spin" : "")} />
          <span className="sr-only">Обновить</span>
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[70%]" />
          </div>
        ) : isGenerating ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
            <span>Идет генерация контента...</span>
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : (
          <div className="text-sm prose prose-slate max-w-none">
            {formattedContent}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
