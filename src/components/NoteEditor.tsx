
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCalculations } from '@/contexts/CalculationsContext';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface NoteEditorProps {
  calculationId: string;
}

export const NoteEditor = ({ calculationId }: NoteEditorProps) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const { saveNote, getNote, updateNote } = useCalculations();

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const note = await getNote(calculationId);
        if (note) {
          setContent(note.content);
          setNoteId(note.id);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [calculationId, getNote]);

  const handleSave = async () => {
    setLoading(true);
    try {
      let result;
      if (noteId) {
        result = await updateNote(noteId, content);
      } else {
        result = await saveNote(calculationId, content);
      }
      
      if (result) {
        setNoteId(result.id);
        toast.success('Заметка сохранена');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Заметки к расчёту</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Добавьте заметки к расчету..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
          disabled={loading}
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            Сохранить заметку
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
