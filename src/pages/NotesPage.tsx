
import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Info, Save } from 'lucide-react';
import { useCalculations } from '@/contexts/calculations';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const NotesPage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [contentChanged, setContentChanged] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const editorRef = useRef<any>(null);
  const { saveNote, getNote, updateNote } = useCalculations();
  
  // We use a test calculation ID for demo purposes
  const testCalculationId = "test-calculation-id";
  
  // Load existing note content
  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const note = await getNote(testCalculationId);
        if (note) {
          setContent(note.content || '');
          setNoteId(note.id);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        toast.error('Не удалось загрузить заметку');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNote();
  }, [getNote]);
  
  // Save note content
  const handleSave = async () => {
    if (loading) return;
    
    const editorContent = editorRef.current?.getContent();
    if (!editorContent) return;
    
    setLoading(true);
    try {
      let result;
      if (noteId) {
        result = await updateNote(noteId, editorContent);
      } else {
        result = await saveNote(testCalculationId, editorContent);
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
  };
  
  // Handle content change
  const handleEditorChange = () => {
    setContentChanged(true);
  };
  
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Заметки</h1>
      
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6 flex items-start gap-2">
          <AlertCircle className="text-amber-600 h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-amber-800">
              Для сохранения заметок нажмите кнопку "Сохранить заметку" или используйте встроенные
              инструменты редактора. Редактор оптимизирован для работы с русским и английским языками.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-50 border-blue-200 mb-4">
        <CardContent className="pt-6 flex items-start gap-2">
          <Info className="text-blue-600 h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-800">
              Редактор поддерживает полное форматирование текста, списки, таблицы и другие элементы.
              Используйте панель инструментов для форматирования и добавления различных элементов.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Заметки к расчёту</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && !content ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Editor
              apiKey="no-api-key"
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={content}
              init={{
                height: 400,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                language: 'ru',
                directionality: 'ltr',
                browser_spellcheck: true,
                language_url: 'https://cdn.jsdelivr.net/npm/tinymce-lang/langs/ru.js'
              }}
              onEditorChange={handleEditorChange}
            />
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {contentChanged ? 'Есть несохраненные изменения' : 'Все изменения сохранены'}
            </div>
            <Button 
              onClick={handleSave} 
              disabled={loading || !contentChanged}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Сохранить заметку
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesPage;
