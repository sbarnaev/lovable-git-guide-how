
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCalculations } from '@/contexts/CalculationsContext';
import { toast } from 'sonner';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Save, 
  Quote,
  Link,
  Underline
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NoteEditorProps {
  calculationId: string;
}

export const NoteEditor = ({ calculationId }: NoteEditorProps) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const { saveNote, getNote, updateNote } = useCalculations();
  const editorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const note = await getNote(calculationId);
        if (note) {
          setContent(note.content);
          setNoteId(note.id);
          
          // Безопасно обновляем содержимое редактора
          if (editorRef.current) {
            editorRef.current.innerHTML = note.content;
          }
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        toast.error('Не удалось загрузить заметку');
      } finally {
        setLoading(false);
      }
    };

    if (calculationId) {
      fetchNote();
    }
  }, [calculationId, getNote]);

  const handleSave = async () => {
    if (!editorRef.current) return;
    
    const htmlContent = editorRef.current.innerHTML;
    
    setLoading(true);
    try {
      let result;
      if (noteId) {
        result = await updateNote(noteId, htmlContent);
      } else {
        result = await saveNote(calculationId, htmlContent);
      }
      
      if (result) {
        setNoteId(result.id);
        toast.success('Заметка сохранена');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Не удалось сохранить заметку');
    } finally {
      setLoading(false);
    }
  };
  
  const formatText = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    
    // Фокус на редактор после форматирования
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // Обновляем состояние контента из редактора
    updateContentFromEditor();
  };
  
  const updateContentFromEditor = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };
  
  const createLink = () => {
    const url = prompt('Введите URL ссылки:', 'https://');
    if (url) {
      formatText('createLink', url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Заметки к расчёту</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button"
                  onClick={() => formatText('bold')} 
                  variant="outline" 
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  <Bold size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Жирный</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button"
                  onClick={() => formatText('italic')} 
                  variant="outline" 
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  <Italic size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Курсив</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button"
                  onClick={() => formatText('underline')} 
                  variant="outline" 
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  <Underline size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Подчеркнутый</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button"
                  onClick={() => formatText('insertUnorderedList')} 
                  variant="outline" 
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  <List size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Маркированный список</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button"
                  onClick={() => formatText('insertOrderedList')} 
                  variant="outline" 
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  <ListOrdered size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Нумерованный список</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button"
                  onClick={() => formatText('formatBlock', '<blockquote>')} 
                  variant="outline" 
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  <Quote size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Цитата</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button"
                  onClick={createLink} 
                  variant="outline" 
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  <Link size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Вставить ссылку</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div 
          id="note-editor"
          ref={editorRef}
          className={cn(
            "min-h-[200px] max-h-[400px] overflow-y-auto p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            loading && "opacity-50",
            "[&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-2",
            "[&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5",
            "[&>p]:my-1.5 [&>h1]:text-2xl [&>h2]:text-xl [&>h3]:text-lg",
            "[&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800"
          )}
          contentEditable={!loading}
          onInput={updateContentFromEditor}
          dangerouslySetInnerHTML={{ __html: content }}
          spellCheck={true}
          dir="ltr"
        />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            Сохранить заметку
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

