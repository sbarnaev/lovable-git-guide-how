
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCalculations } from '@/contexts/CalculationsContext';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TextBlock } from './types';
import { QuickNavigation } from './QuickNavigation';
import { FormatToolbar } from './FormatToolbar';

interface NoteEditorProps {
  calculationId: string;
}

export const NoteEditor = ({ calculationId }: NoteEditorProps) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const { saveNote, getNote, updateNote } = useCalculations();
  const editorRef = useRef<HTMLDivElement>(null);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  
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
          
          // Извлекаем блоки из содержимого, если они есть
          extractBlocksFromContent(note.content);
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

  const extractBlocksFromContent = (htmlContent: string) => {
    // Поиск всех блоков по data-block-id
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const blockElements = tempDiv.querySelectorAll('[data-block-id]');
    const extractedBlocks: TextBlock[] = [];
    
    blockElements.forEach((element) => {
      const id = element.getAttribute('data-block-id') || '';
      const title = element.getAttribute('data-block-title') || 'Без названия';
      const content = element.innerHTML;
      
      extractedBlocks.push({ id, title, content });
    });
    
    if (extractedBlocks.length > 0) {
      setTextBlocks(extractedBlocks);
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    
    let htmlContent = editorRef.current.innerHTML;
    
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
  
  const updateContentFromEditor = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      extractBlocksFromContent(editorRef.current.innerHTML);
    }
  };

  const addTextBlock = () => {
    const blockTitle = prompt('Введите название блока:');
    if (!blockTitle) return;
    
    const blockId = `block-${Date.now()}`;
    const newBlock: TextBlock = {
      id: blockId,
      title: blockTitle,
      content: '<p>Содержимое блока...</p>'
    };
    
    setTextBlocks([...textBlocks, newBlock]);
    
    // Добавляем блок в редактор
    if (editorRef.current) {
      const blockHtml = `
        <div class="p-3 border rounded-md my-3" data-block-id="${blockId}" data-block-title="${blockTitle}">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium text-primary" id="${blockId}">${blockTitle}</h3>
          </div>
          <div class="block-content">Содержимое блока...</div>
        </div>
      `;
      
      editorRef.current.focus();
      document.execCommand('insertHTML', false, blockHtml);
      updateContentFromEditor();
    }
  };
  
  const scrollToBlock = (blockId: string) => {
    const element = document.getElementById(blockId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Заметки к расчёту</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Блоки быстрой навигации */}
        {textBlocks.length > 0 && (
          <QuickNavigation textBlocks={textBlocks} onBlockClick={scrollToBlock} />
        )}

        {/* Панель форматирования */}
        <FormatToolbar updateContentFromEditor={updateContentFromEditor} addTextBlock={addTextBlock} editorRef={editorRef} />
        
        {/* Редактор заметок */}
        <div 
          id="note-editor"
          ref={editorRef}
          className={cn(
            "min-h-[250px] max-h-[450px] overflow-y-auto p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "bg-white text-left direction-ltr", 
            loading && "opacity-50",
            "[&>blockquote]:border-l-4 [&>blockquote]:border-primary/40 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-3 [&>blockquote]:bg-muted/30 [&>blockquote]:py-2 [&>blockquote]:pr-2 [&>blockquote]:rounded-sm",
            "[&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5",
            "[&>p]:my-1.5 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-4 [&>h1]:mb-2",
            "[&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mt-3 [&>h2]:mb-2",
            "[&>h3]:text-lg [&>h3]:font-medium [&>h3]:mt-2 [&>h3]:mb-1.5",
            "[&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800",
            "[&_[data-block-id]]:border [&_[data-block-id]]:p-3 [&_[data-block-id]]:rounded-md [&_[data-block-id]]:my-3"
          )}
          contentEditable={!loading}
          onInput={updateContentFromEditor}
          dangerouslySetInnerHTML={{ __html: content }}
          spellCheck={true}
          style={{ direction: 'ltr' }} 
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
