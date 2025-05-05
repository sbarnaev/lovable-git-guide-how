
import React from 'react';
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
  return (
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
  );
};
