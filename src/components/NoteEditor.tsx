
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCalculations } from '@/contexts/CalculationsContext';
import { toast } from 'sonner';
import { Bold, Italic, List, ListOrdered, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  calculationId: string;
}

export const NoteEditor = ({ calculationId }: NoteEditorProps) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const { saveNote, getNote, updateNote } = useCalculations();
  const editorRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const note = await getNote(calculationId);
        if (note) {
          setContent(note.content);
          setNoteId(note.id);
          
          if (editorRef.current) {
            editorRef.current.innerHTML = note.content;
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [calculationId, getNote]);

  const handleSave = async () => {
    if (!editorRef.current) return;
    
    const htmlContent = editorRef.current.innerHTML;
    setLoading(true);
    try {
      let result;
      if (noteId) {
        result = await updateNote(noteId, htmlContent);
      } else {
        result = await saveNote(calculationId, htmlContent);
      }
      
      if (result) {
        setNoteId(result.id);
        toast.success('Заметка сохранена');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const formatText = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Заметки к расчёту</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <Button 
            type="button"
            onClick={() => formatText('bold')} 
            variant="outline" 
            size="sm"
            className="w-8 h-8 p-0"
          >
            <Bold size={16} />
          </Button>
          <Button 
            type="button"
            onClick={() => formatText('italic')} 
            variant="outline" 
            size="sm"
            className="w-8 h-8 p-0"
          >
            <Italic size={16} />
          </Button>
          <Button 
            type="button"
            onClick={() => formatText('insertUnorderedList')} 
            variant="outline" 
            size="sm"
            className="w-8 h-8 p-0"
          >
            <List size={16} />
          </Button>
          <Button 
            type="button"
            onClick={() => formatText('insertOrderedList')} 
            variant="outline" 
            size="sm"
            className="w-8 h-8 p-0"
          >
            <ListOrdered size={16} />
          </Button>
        </div>
        
        <div 
          ref={editorRef}
          className={cn(
            "min-h-[200px] max-h-[400px] overflow-y-auto p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            loading && "opacity-50"
          )}
          contentEditable={!loading}
          onInput={() => setContent(editorRef.current?.innerHTML || '')}
          dangerouslySetInnerHTML={{ __html: content }}
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
