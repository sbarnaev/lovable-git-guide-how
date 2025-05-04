
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCalculations } from '@/contexts/CalculationsContext';
import { toast } from 'sonner';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Save, 
  Quote,
  Link,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface NoteEditorProps {
  calculationId: string;
}

interface TextBlock {
  id: string;
  title: string;
  content: string;
}

export const NoteEditor = ({ calculationId }: NoteEditorProps) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const { saveNote, getNote, updateNote } = useCalculations();
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [viewMode, setViewMode] = useState<'editor' | 'blocks'>('editor');
  
  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const note = await getNote(calculationId);
        if (note) {
          setContent(note.content);
          setNoteId(note.id);
          
          // Безопасно обновляем содержимое редактора
          if (editorRef.current) {
            editorRef.current.innerHTML = note.content;
          }
          
          // Пытаемся извлечь блоки из содержимого, если они есть
          extractBlocksFromContent(note.content);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        toast.error('Не удалось загрузить заметку');
      } finally {
        setLoading(false);
      }
    };

    if (calculationId) {
      fetchNote();
    }
  }, [calculationId, getNote]);

  const extractBlocksFromContent = (htmlContent: string) => {
    // Поиск всех блоков по data-block-id
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const blockElements = tempDiv.querySelectorAll('[data-block-id]');
    const extractedBlocks: TextBlock[] = [];
    
    blockElements.forEach((element) => {
      const id = element.getAttribute('data-block-id') || '';
      const title = element.getAttribute('data-block-title') || 'Без названия';
      const content = element.innerHTML;
      
      extractedBlocks.push({ id, title, content });
    });
    
    if (extractedBlocks.length > 0) {
      setTextBlocks(extractedBlocks);
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    
    let htmlContent = editorRef.current.innerHTML;
    
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
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Не удалось сохранить заметку');
    } finally {
      setLoading(false);
    }
  };
  
  const formatText = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    
    // Фокус на редактор после форматирования
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // Обновляем состояние контента из редактора
    updateContentFromEditor();
  };
  
  const updateContentFromEditor = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      extractBlocksFromContent(editorRef.current.innerHTML);
    }
  };
  
  const createLink = () => {
    const url = prompt('Введите URL ссылки:', 'https://');
    if (url) {
      formatText('createLink', url);
    }
  };
  
  const addHeading = (level: string) => {
    formatText('formatBlock', `<h${level}>`);
  };
  
  const changeTextColor = (color: string) => {
    formatText('foreColor', color);
  };

  const addTextBlock = () => {
    const blockTitle = prompt('Введите название блока:');
    if (!blockTitle) return;
    
    const blockId = `block-${Date.now()}`;
    const newBlock: TextBlock = {
      id: blockId,
      title: blockTitle,
      content: '<p>Содержимое блока...</p>'
    };
    
    setTextBlocks([...textBlocks, newBlock]);
    
    // Добавляем блок в редактор
    if (editorRef.current) {
      const blockHtml = `
        <div class="p-3 border rounded-md my-3" data-block-id="${blockId}" data-block-title="${blockTitle}">
          <h3 class="font-medium mb-2 text-primary" id="${blockId}">${blockTitle}</h3>
          <p>Содержимое блока...</p>
        </div>
      `;
      
      editorRef.current.focus();
      document.execCommand('insertHTML', false, blockHtml);
      updateContentFromEditor();
    }
  };
  
  const scrollToBlock = (blockId: string) => {
    const element = document.getElementById(blockId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Заметки к расчёту</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="editor" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="mb-2">
            <TabsTrigger value="editor">Редактор</TabsTrigger>
            <TabsTrigger value="blocks">Блоки и структура</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
            <div className="flex flex-wrap gap-2 mb-2 p-2 border rounded-md bg-secondary/30">
              {/* Стандартное форматирование */}
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => formatText('bold')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <Bold size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Жирный</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => formatText('italic')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <Italic size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Курсив</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => formatText('underline')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <Underline size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Подчеркнутый</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Separator orientation="vertical" className="h-8" />
              
              {/* Заголовки */}
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => addHeading('1')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <Heading1 size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Заголовок 1</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => addHeading('2')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <Heading2 size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Заголовок 2</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => addHeading('3')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <Heading3 size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Заголовок 3</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Separator orientation="vertical" className="h-8" />
              
              {/* Списки и цитаты */}
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => formatText('insertUnorderedList')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <List size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Маркированный список</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => formatText('insertOrderedList')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <ListOrdered size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Нумерованный список</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => formatText('formatBlock', '<blockquote>')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <Quote size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Цитата</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Separator orientation="vertical" className="h-8" />
              
              {/* Выравнивание */}
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => formatText('justifyLeft')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <AlignLeft size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>По левому краю</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => formatText('justifyCenter')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <AlignCenter size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>По центру</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => formatText('justifyRight')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <AlignRight size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>По правому краю</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Separator orientation="vertical" className="h-8" />
              
              {/* Цвета */}
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => changeTextColor('#6941C6')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0 bg-numerica"
                      />
                    </TooltipTrigger>
                    <TooltipContent>Фиолетовый</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => changeTextColor('#1E40AF')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0 bg-blue-700"
                      />
                    </TooltipTrigger>
                    <TooltipContent>Синий</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => changeTextColor('#E11D48')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0 bg-rose-600"
                      />
                    </TooltipTrigger>
                    <TooltipContent>Красный</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => changeTextColor('#047857')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0 bg-emerald-700"
                      />
                    </TooltipTrigger>
                    <TooltipContent>Зеленый</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={() => changeTextColor('#000000')} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0 bg-black"
                      />
                    </TooltipTrigger>
                    <TooltipContent>Черный</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Separator orientation="vertical" className="h-8" />
              
              {/* Дополнительное */}
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={createLink} 
                        variant="outline" 
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <Link size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Вставить ссылку</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button"
                        onClick={addTextBlock} 
                        variant="outline" 
                        size="sm"
                        className="p-2 flex gap-1 items-center"
                      >
                        <BookOpen size={16} />
                        <span>Добавить блок</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Создать новый блок</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div 
              id="note-editor"
              ref={editorRef}
              className={cn(
                "min-h-[250px] max-h-[450px] overflow-y-auto p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "bg-white text-left", // Явно устанавливаем направление текста
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
              dangerouslySetInnerHTML={{ __html: content }}
              spellCheck={true}
              dir="ltr"
            />
          </TabsContent>
          
          <TabsContent value="blocks">
            <div className="space-y-4">
              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Блоки заметок</h3>
                
                {textBlocks.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Добавьте блоки в редакторе для организации структуры заметок
                  </p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto p-2 border rounded-md">
                    {textBlocks.map(block => (
                      <Button 
                        key={block.id} 
                        variant="outline" 
                        onClick={() => scrollToBlock(block.id)}
                        className="justify-start text-left font-normal"
                      >
                        {block.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Действия с блоками</h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={addTextBlock} 
                    size="sm"
                    className="flex gap-1 items-center"
                  >
                    <BookOpen size={16} />
                    <span>Добавить блок</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
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
