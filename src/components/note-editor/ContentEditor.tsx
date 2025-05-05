
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
  
  // Force text normalization for Cyrillic and Latin text
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    
    // Function to normalize text in content
    const normalizeText = (rootElement: HTMLElement) => {
      // Get all text nodes
      const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT);
      let textNode;
      
      // Process each text node
      while (textNode = walker.nextNode()) {
        const parent = textNode.parentElement;
        if (parent && textNode.nodeValue) {
          // Set explicit styles for text direction
          parent.style.direction = 'ltr';
          parent.style.textAlign = 'left';
          parent.setAttribute('dir', 'ltr');
          
          // Apply specific CSS writing mode for Cyrillic/Latin text
          parent.style.writingMode = 'horizontal-tb';
        }
      }
      
      // Apply to all elements
      const allElements = rootElement.querySelectorAll('*');
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.direction = 'ltr';
          el.style.textAlign = 'left';
          el.setAttribute('dir', 'ltr');
          el.style.writingMode = 'horizontal-tb';
        }
      });
    };
    
    // Apply on initial load
    normalizeText(editor);
    
    // Set up MutationObserver to handle dynamic content
    observerRef.current = new MutationObserver(() => {
      normalizeText(editor);
    });
    
    // Start observing with all possible mutation types
    observerRef.current.observe(editor, {
      childList: true,
      subtree: true, 
      characterData: true,
      attributes: true
    });
    
    // Normalize text on these events
    const handleInput = () => setTimeout(() => normalizeText(editor), 0);
    const handlePaste = () => setTimeout(() => normalizeText(editor), 10);
    const handleFocus = () => normalizeText(editor);
    
    // Add event listeners
    editor.addEventListener('input', handleInput);
    editor.addEventListener('paste', handlePaste);
    editor.addEventListener('focus', handleFocus);
    
    // Periodic normalization as a fallback
    const interval = setInterval(() => normalizeText(editor), 300);
    
    return () => {
      // Clean up
      editor.removeEventListener('input', handleInput);
      editor.removeEventListener('paste', handlePaste);
      editor.removeEventListener('focus', handleFocus);
      clearInterval(interval);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [editorRef]);

  // Handle content updates
  const handleUpdate = () => {
    if (editorRef.current) {
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
        writingMode: 'horizontal-tb',
        fontFamily: "'Arial', 'Helvetica', sans-serif" // Standard font with good Cyrillic support
      }}
      suppressContentEditableWarning={true}
    />
  );
};
