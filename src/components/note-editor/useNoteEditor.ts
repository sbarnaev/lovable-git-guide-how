
import { useState, useEffect, useRef, useCallback } from 'react';
import { useCalculations } from '@/contexts/calculations';
import { toast } from 'sonner';
import { TextBlock } from './types';

export const useNoteEditor = (calculationId: string) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [contentChanged, setContentChanged] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const contentChangeTimer = useRef<NodeJS.Timeout | null>(null);
  const { saveNote, getNote, updateNote } = useCalculations();
  
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
      
      extractedBlocks.push({ id, title, content: element.innerHTML });
    });
    
    setTextBlocks(extractedBlocks);
  }, []);

  // Загрузка заметки
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
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new MutationObserver((mutations) => {
      if (mutations.some(m => m.type === 'attributes' || m.type === 'childList')) {
        ensureProperTextDirection();
      }
    });
    
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

  // Сохранение контента
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

  // Обработчик ввода
  const updateContentFromEditor = useCallback(() => {
    if (!editorRef.current) return;
    
    const newContent = editorRef.current.innerHTML;
    setContent(newContent);
    setContentChanged(true);
    
    if (contentChangeTimer.current) {
      clearTimeout(contentChangeTimer.current);
    }
    
    contentChangeTimer.current = setTimeout(() => {
      extractBlocksFromContent(newContent);
    }, 500);
    
    ensureProperTextDirection();
  }, [extractBlocksFromContent, ensureProperTextDirection]);

  // Обработка нажатий клавиш
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

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (contentChangeTimer.current) {
        clearTimeout(contentChangeTimer.current);
        contentChangeTimer.current = null;
      }
    };
  }, []);

  return {
    content,
    loading,
    contentChanged,
    textBlocks,
    editorRef,
    updateContentFromEditor,
    handleKeyDown,
    saveContent,
    addTextBlock,
    scrollToBlock
  };
};
