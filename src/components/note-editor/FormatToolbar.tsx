
import React, { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FormattingGroup } from './FormattingGroup';

interface FormatToolbarProps {
  updateContentFromEditor: () => void;
  addTextBlock: () => void;
  editorRef: RefObject<HTMLDivElement>;
}

export const FormatToolbar = ({ updateContentFromEditor, addTextBlock, editorRef }: FormatToolbarProps) => {
  const formatText = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    
    // Фокус на редактор после форматирования
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // Обновляем состояние контента из редактора
    updateContentFromEditor();
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

  return (
    <div className="flex flex-wrap gap-2 mb-2 p-2 border rounded-md bg-secondary/30">
      {/* Стандартное форматирование */}
      <FormattingGroup>
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
      </FormattingGroup>
      
      <Separator orientation="vertical" className="h-8" />
      
      {/* Заголовки */}
      <FormattingGroup>
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
      </FormattingGroup>
      
      <Separator orientation="vertical" className="h-8" />
      
      {/* Списки и цитаты */}
      <FormattingGroup>
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
      </FormattingGroup>
      
      <Separator orientation="vertical" className="h-8" />
      
      {/* Выравнивание */}
      <FormattingGroup>
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
      </FormattingGroup>
      
      <Separator orientation="vertical" className="h-8" />
      
      {/* Цвета */}
      <FormattingGroup>
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
      </FormattingGroup>
      
      <Separator orientation="vertical" className="h-8" />
      
      {/* Дополнительное */}
      <FormattingGroup>
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
      </FormattingGroup>
    </div>
  );
};
