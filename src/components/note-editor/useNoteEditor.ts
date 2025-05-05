
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
  const { saveNote, getNote, updateNote } = useCalculations();

  // Загрузка заметки при монтировании компонента
  useEffect(() => {
    let isMounted = true;
    
    const fetchNote = async () => {
      if (!calculationId || !isMounted) return;
      
      setLoading(true);
      try {
        const note = await getNote(calculationId);
        if (note && isMounted) {
          setContent(note.content);
          setNoteId(note.id);
          
          if (editorRef.current) {
            editorRef.current.innerHTML = note.content;
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
  }, [calculationId, getNote]);
  
  // Устанавливаем правильное направление текста
  const ensureProperTextDirection = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.dir = 'ltr';
    editorRef.current.style.direction = 'ltr';
    editorRef.current.style.textAlign = 'left';
  }, []);
  
  // Более легкая версия обработчика мутаций, активирующаяся только при необходимости
  useEffect(() => {
    if (!editorRef.current) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Создаем упрощенный MutationObserver
    observerRef.current = new MutationObserver(() => {
      ensureProperTextDirection();
    });
    
    // Наблюдаем только за необходимыми атрибутами
    observerRef.current.observe(editorRef.current, { 
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

  // Извлекаем блоки из содержимого в оптимизированной форме
  const extractBlocksFromContent = useCallback((htmlContent: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const blockElements = tempDiv.querySelectorAll('[data-block-id]');
    if (blockElements.length === 0) {
      setTextBlocks([]);
      return;
    }
    
    const extractedBlocks: TextBlock[] = [];
    
    blockElements.forEach((element) => {
      const id = element.getAttribute('data-block-id') || '';
      const title = element.getAttribute('data-block-title') || 'Без названия';
      
      extractedBlocks.push({ id, title, content: '' });
    });
    
    setTextBlocks(extractedBlocks);
  }, []);

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

  // Обработчик ввода с задержкой детектирования изменений
  const updateContentFromEditor = useCallback(() => {
    if (!editorRef.current) return;
    
    setContentChanged(true);
    const newContent = editorRef.current.innerHTML;
    setContent(newContent);
    
    // Отложенное извлечение блоков для снижения нагрузки
    setTimeout(() => {
      extractBlocksFromContent(newContent);
    }, 800);
    
    ensureProperTextDirection();
  }, [extractBlocksFromContent, ensureProperTextDirection]);

  // Обработка нажатий клавиш
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Ctrl+S или Cmd+S для сохранения
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveContent();
      return;
    }
  }, [saveContent]);

  // Добавление текстового блока
  const addTextBlock = useCallback(() => {
    const blockTitle = prompt('Введите название блока:');
    if (!blockTitle || !editorRef.current) return;
    
    const blockId = `block-${Date.now()}`;
    const newBlock: TextBlock = {
      id: blockId,
      title: blockTitle,
      content: ''
    };
    
    setTextBlocks(prevBlocks => [...prevBlocks, newBlock]);
    setContentChanged(true);
    
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
  }, [updateContentFromEditor]);
  
  // Прокрутка к блоку
  const scrollToBlock = useCallback((blockId: string) => {
    const element = document.getElementById(blockId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
