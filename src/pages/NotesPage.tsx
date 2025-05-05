
import React from 'react';
import { NoteEditor } from '@/components/note-editor';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Info } from 'lucide-react';

const NotesPage = () => {
  // Используем тестовый ID для демонстрации
  const testCalculationId = "test-calculation-id";
  
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Заметки</h1>
      
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6 flex items-start gap-2">
          <AlertCircle className="text-amber-600 h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-amber-800">
              Для сохранения заметок нажмите кнопку "Сохранить заметку" или комбинацию клавиш Ctrl+S (Cmd+S на Mac).
              Редактор оптимизирован для русского и английского языков. Если текст отображается некорректно, 
              попробуйте нажать кнопку обновления страницы.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-50 border-blue-200 mb-4">
        <CardContent className="pt-6 flex items-start gap-2">
          <Info className="text-blue-600 h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-800">
              Все заметки сохраняются автоматически при нажатии кнопки "Сохранить заметку". 
              Форматирование сохраняется между сессиями. Вы можете использовать панель инструментов 
              для форматирования текста и создания текстовых блоков.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <NoteEditor calculationId={testCalculationId} />
    </div>
  );
};

export default NotesPage;
