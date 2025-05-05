
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCalculations } from '@/contexts/calculations';
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
  const observerRef = useRef<MutationObserver | null>(null);
  const contentChangeTimer = useRef<NodeJS.Timeout | null>(null);
  const [contentChanged, setContentChanged] = useState(false);
  
  // Оптимизированная функция для установки правильного направления текста
  const ensureProperTextDirection = useCallback(() => {
    if (!editorRef.current) return;
    
    // Применяем только к родительскому элементу, а не ко всем потомкам
    editorRef.current.setAttribute('dir', 'ltr');
    editorRef.current.style.direction = 'ltr';
    editorRef.current.style.textAlign = 'left';
    editorRef.current.style.unicodeBidi = 'normal';
  }, []);
  
  // Извлекаем блоки из содержимого более эффективно
  const extractBlocksFromContent = useCallback((htmlContent: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const blockElements = tempDiv.querySelectorAll('[data-block-id]');
    if (blockElements.length === 0) return;
    
    const extractedBlocks: TextBlock[] = [];
    
    blockElements.forEach((element) => {
      const id = element.getAttribute('data-block-id') || '';
      const title = element.getAttribute('data-block-title') || 'Без названия';
      const content = element.innerHTML;
      
      extractedBlocks.push({ id, title, content });
    });
    
    setTextBlocks(extractedBlocks);
  }, []);

  // Загрузка заметки с дебаунсом и мемоизацией
  useEffect(() => {
    let isMounted = true;
    
    const fetchNote = async () => {
      if (!isMounted) return;
      setLoading(true);
      
      try {
        const note = await getNote(calculationId);
        if (note && isMounted) {
          setContent(note.content);
          setNoteId(note.id);
          
          // Обновляем содержимое редактора и извлекаем блоки
          if (editorRef.current) {
            editorRef.current.innerHTML = note.content;
            ensureProperTextDirection();
            extractBlocksFromContent(note.content);
          }
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        if (isMounted) {
          toast.error('Не удалось загрузить заметку');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (calculationId) {
      fetchNote();
    }
    
    return () => {
      isMounted = false;
    };
  }, [calculationId, getNote, ensureProperTextDirection, extractBlocksFromContent]);
  
  // Упрощенный MutationObserver только на корневом элементе
  useEffect(() => {
    if (!editorRef.current) return;
    
    // Удаляем предыдущий observer, если он существует
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Создаем новый observer с минимальной конфигурацией
    observerRef.current = new MutationObserver((mutations) => {
      // Проверяем, только если есть изменения в атрибутах или дочерних элементах
      if (mutations.some(m => m.type === 'attributes' || m.type === 'childList')) {
        ensureProperTextDirection();
      }
    });
    
    // Наблюдаем только за необходимыми изменениями
    observerRef.current.observe(editorRef.current, { 
      childList: true,
      subtree: false,
      attributes: true,
      attributeFilter: ['dir', 'style']
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [ensureProperTextDirection]);

  // Оптимизированное сохранение без автосохранения
  const saveContent = useCallback(async () => {
    if (!editorRef.current || loading) return;
    
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
        setContentChanged(false);
        toast.success('Заметка сохранена', { 
          position: 'bottom-right',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Не удалось сохранить заметку');
    } finally {
      setLoading(false);
    }
  }, [calculationId, noteId, saveNote, updateNote, loading]);

  // Обработчик ввода без автосохранения
  const updateContentFromEditor = useCallback(() => {
    if (!editorRef.current) return;
    
    const newContent = editorRef.current.innerHTML;
    setContent(newContent);
    setContentChanged(true);
    extractBlocksFromContent(newContent);
    
    // Отложенное обновление блоков без сохранения
    if (contentChangeTimer.current) {
      clearTimeout(contentChangeTimer.current);
    }
    
    contentChangeTimer.current = setTimeout(() => {
      extractBlocksFromContent(newContent);
    }, 500);
    
    ensureProperTextDirection();
  }, [extractBlocksFromContent, ensureProperTextDirection]);

  // Оптимизированная обработка нажатий клавиш
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Ctrl+S для сохранения
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveContent();
      return;
    }
    
    // Обработка Enter только если нужно
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br><br>');
      updateContentFromEditor();
      return;
    }
  }, [updateContentFromEditor, saveContent]);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (contentChangeTimer.current) {
        clearTimeout(contentChangeTimer.current);
        contentChangeTimer.current = null;
      }
    };
  }, []);

  // Добавление текстового блока
  const addTextBlock = useCallback(() => {
    const blockTitle = prompt('Введите название блока:');
    if (!blockTitle) return;
    
    const blockId = `block-${Date.now()}`;
    const newBlock: TextBlock = {
      id: blockId,
      title: blockTitle,
      content: '<p>Содержимое блока...</p>'
    };
    
    setTextBlocks(prevBlocks => [...prevBlocks, newBlock]);
    setContentChanged(true);
    
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
  }, [updateContentFromEditor]);
  
  // Прокрутка к блоку
  const scrollToBlock = useCallback((blockId: string) => {
    const element = document.getElementById(blockId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Оптимизированный рендеринг
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
        <FormatToolbar 
          updateContentFromEditor={updateContentFromEditor} 
          addTextBlock={addTextBlock} 
          editorRef={editorRef} 
        />
        
        {/* Редактор заметок */}
        <div 
          id="note-editor"
          ref={editorRef}
          className={cn(
            "min-h-[250px] max-h-[450px] overflow-y-auto p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "bg-white text-left", 
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
          onKeyDown={handleKeyDown}
          dangerouslySetInnerHTML={{ __html: content }}
          spellCheck={true}
          dir="ltr"
          style={{
            direction: 'ltr',
            textAlign: 'left',
            unicodeBidi: 'normal',
          }}
          suppressContentEditableWarning={true}
        />
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {contentChanged ? 'Есть несохраненные изменения' : 'Все изменения сохранены'}
          </div>
          <Button 
            onClick={saveContent} 
            disabled={loading || !contentChanged}
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
