
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNoteEditor } from './useNoteEditor';
import { QuickNavigation } from './QuickNavigation';
import { FormatToolbar } from './FormatToolbar';
import { ContentEditor } from './ContentEditor';
import { SaveButton } from './SaveButton';
import { StatusDisplay } from './StatusDisplay';

interface NoteEditorProps {
  calculationId: string;
}

export const NoteEditor = ({ calculationId }: NoteEditorProps) => {
  const {
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
  } = useNoteEditor(calculationId);

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
        <ContentEditor 
          editorRef={editorRef}
          content={content}
          loading={loading}
          updateContentFromEditor={updateContentFromEditor}
          handleKeyDown={handleKeyDown}
        />
        
        <div className="flex items-center justify-between">
          <StatusDisplay contentChanged={contentChanged} />
          <SaveButton 
            onSave={saveContent} 
            disabled={!contentChanged}
            loading={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
};
