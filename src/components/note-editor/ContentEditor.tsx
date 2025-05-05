
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ContentEditorProps {
  editorRef: React.RefObject<HTMLDivElement>;
  content: string;
  loading: boolean;
  updateContentFromEditor: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const ContentEditor = ({
  editorRef,
  content,
  loading,
  updateContentFromEditor,
  handleKeyDown
}: ContentEditorProps) => {
  // Полное исправление направления текста
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    
    // Установка HTML атрибутов и стилей на корневой элемент
    editor.setAttribute('dir', 'ltr');
    editor.style.direction = 'ltr';
    editor.style.textAlign = 'left';
    editor.style.unicodeBidi = 'plaintext';
    
    // Функция для принудительного форматирования всего текста
    const forceTextDirection = () => {
      // Применение стилей ко всем элементам в редакторе
      const applyToElement = (element: HTMLElement) => {
        element.setAttribute('dir', 'ltr');
        element.style.direction = 'ltr';
        element.style.textAlign = 'left';
        element.style.unicodeBidi = 'plaintext';
        
        // Рекурсивно применяем стили ко всем дочерним элементам
        Array.from(element.children).forEach(child => {
          applyToElement(child as HTMLElement);
        });
      };
      
      applyToElement(editor);
      
      // Дополнительно обрабатываем текстовый узел под курсором
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range.startContainer) {
          let currentNode = range.startContainer;
          // Поднимаемся по дереву DOM и применяем стиль к каждому элементу
          while (currentNode && currentNode !== editor) {
            if (currentNode.nodeType === Node.ELEMENT_NODE) {
              const element = currentNode as HTMLElement;
              element.setAttribute('dir', 'ltr');
              element.style.direction = 'ltr';
              element.style.textAlign = 'left';
              element.style.unicodeBidi = 'plaintext';
            }
            currentNode = currentNode.parentNode;
          }
        }
      }
    };
    
    // Применяем форматирование сразу при рендеринге
    setTimeout(forceTextDirection, 0);
    
    // Обработчик ввода для поддержания направления текста
    const handleInput = () => {
      // Отложенный вызов для предотвращения возможных конфликтов с другими обработчиками
      setTimeout(forceTextDirection, 0);
    };
    
    // Обработчик события вставки текста
    const handlePaste = () => {
      setTimeout(forceTextDirection, 10);
    };
    
    // Добавляем обработчики для всех событий, которые могут изменить текст
    editor.addEventListener('input', handleInput);
    editor.addEventListener('paste', handlePaste);
    editor.addEventListener('keydown', () => setTimeout(forceTextDirection, 0));
    editor.addEventListener('focus', forceTextDirection);
    editor.addEventListener('blur', forceTextDirection);
    
    // Регулярно применяем форматирование (каждые 500 мс)
    const interval = setInterval(forceTextDirection, 500);
    
    return () => {
      editor.removeEventListener('input', handleInput);
      editor.removeEventListener('paste', handlePaste);
      editor.removeEventListener('keydown', () => {});
      editor.removeEventListener('focus', forceTextDirection);
      editor.removeEventListener('blur', forceTextDirection);
      clearInterval(interval);
    };
  }, [editorRef]);
  
  return (
    <div 
      id="note-editor"
      ref={editorRef}
      className={cn(
        "min-h-[250px] max-h-[450px] overflow-y-auto p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "bg-white text-left", 
        loading && "opacity-50 cursor-not-allowed",
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
      spellCheck={false}
      dir="ltr"
      style={{
        direction: 'ltr',
        textAlign: 'left',
        unicodeBidi: 'plaintext'
      }}
      suppressContentEditableWarning={true}
    />
  );
};
