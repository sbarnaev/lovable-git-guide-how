
import React from 'react';
import { NoteEditor } from '@/components/note-editor';

const NotesPage = () => {
  // Use a test ID for now, we'll later integrate it properly with calculations
  const testCalculationId = "test-calculation-id";
  
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Заметки</h1>
      <p className="text-muted-foreground">
        Тестовая страница для редактора заметок. В дальнейшем функционал будет встроен в расчеты.
      </p>
      
      <NoteEditor calculationId={testCalculationId} />
    </div>
  );
};

export default NotesPage;
