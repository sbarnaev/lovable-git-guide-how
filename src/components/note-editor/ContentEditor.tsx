
import React, { useEffect, useRef } from 'react';
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
  // Observer reference to watch for DOM changes
  const observerRef = useRef<MutationObserver | null>(null);
  
  // Force all text direction universally with a more aggressive approach
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    
    // Set base direction on root element
    editor.setAttribute('dir', 'ltr');
    editor.style.direction = 'ltr';
    editor.style.textAlign = 'left';
    editor.style.unicodeBidi = 'plaintext';
    
    // Helper to force direction on an element and all its children
    const forceTextDirection = (rootElement: HTMLElement) => {
      // Apply to root first
      rootElement.setAttribute('dir', 'ltr');
      rootElement.style.direction = 'ltr';
      rootElement.style.textAlign = 'left';
      rootElement.style.unicodeBidi = 'plaintext';
      
      // Force all text nodes to use LTR
      const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        const parentElement = node.parentElement;
        if (parentElement && parentElement !== editor) {
          parentElement.setAttribute('dir', 'ltr');
          parentElement.style.direction = 'ltr';
          parentElement.style.textAlign = 'left';
          parentElement.style.unicodeBidi = 'plaintext';
        }
      }
      
      // Apply to all elements recursively
      const elements = rootElement.querySelectorAll('*');
      elements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.setAttribute('dir', 'ltr');
          el.style.direction = 'ltr';
          el.style.textAlign = 'left';
          el.style.unicodeBidi = 'plaintext';
        }
      });
    };

    // Create MutationObserver to watch for DOM changes
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          forceTextDirection(editor);
        }
      });
    });
    
    // Start observing
    observerRef.current.observe(editor, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
    
    // Apply immediately
    forceTextDirection(editor);
    
    // Apply on every input event (real-time)
    const applyOnInput = () => setTimeout(() => forceTextDirection(editor), 0);
    editor.addEventListener('input', applyOnInput);
    
    // Apply on paste with longer delay for processing
    const applyOnPaste = () => setTimeout(() => forceTextDirection(editor), 10);
    editor.addEventListener('paste', applyOnPaste);
    
    // Apply on focus/blur
    editor.addEventListener('focus', () => forceTextDirection(editor));
    editor.addEventListener('blur', () => forceTextDirection(editor));
    
    // Continual enforcement every 300ms
    const interval = setInterval(() => forceTextDirection(editor), 300);
    
    return () => {
      // Clean up all listeners
      editor.removeEventListener('input', applyOnInput);
      editor.removeEventListener('paste', applyOnPaste);
      editor.removeEventListener('focus', () => {});
      editor.removeEventListener('blur', () => {});
      clearInterval(interval);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [editorRef]);

  // Handle content changes after editor has been modified
  const handleUpdate = () => {
    if (editorRef.current) {
      // Force text direction before updating content
      const elements = editorRef.current.querySelectorAll('*');
      elements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.setAttribute('dir', 'ltr');
          el.style.direction = 'ltr';
          el.style.textAlign = 'left';
          el.style.unicodeBidi = 'plaintext';
        }
      });
      updateContentFromEditor();
    }
  };
  
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
      onInput={handleUpdate}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{ __html: content }}
      spellCheck={false}
      dir="ltr"
      style={{
        direction: 'ltr',
        textAlign: 'left',
        unicodeBidi: 'plaintext',
        fontFamily: 'Arial, sans-serif' // Use a standard LTR-friendly font
      }}
      suppressContentEditableWarning={true}
    />
  );
};
