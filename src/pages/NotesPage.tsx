
import React from 'react';
import { NoteEditor } from '@/components/note-editor';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const NotesPage = () => {
  // Use a test ID for now, we'll later integrate it properly with calculations
  const testCalculationId = "test-calculation-id";
  
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Заметки</h1>
      <p className="text-muted-foreground">
        Тестовая страница для редактора заметок. В дальнейшем функционал будет встроен в расчеты.
      </p>
      
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6 flex items-start gap-2">
          <AlertCircle className="text-yellow-600 h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-800">
              Для сохранения заметок нажмите кнопку "Сохранить заметку" или комбинацию клавиш Ctrl+S (Cmd+S на Mac).
              Автосохранение отключено для обеспечения стабильной работы.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <NoteEditor calculationId={testCalculationId} />
    </div>
  );
};

export default NotesPage;
