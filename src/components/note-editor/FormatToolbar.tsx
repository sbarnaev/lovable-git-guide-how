
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Underline, List, Heading1, Heading2, Heading3,
  Quote, List as ListIcon, ListOrdered, PlusCircle
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FormatAction } from './types';
import { FormattingGroup } from './FormattingGroup';

interface FormatToolbarProps {
  updateContentFromEditor: () => void;
  addTextBlock: () => void;
  editorRef: React.RefObject<HTMLDivElement>;
}

export const FormatToolbar = ({ 
  updateContentFromEditor,
  addTextBlock,
  editorRef
}: FormatToolbarProps) => {
  const formatDoc = (command: string, value: string = '') => {
    // Простой механизм форматирования
    document.execCommand(command, false, value);
    updateContentFromEditor();
  };

  // Основные действия форматирования
  const textActions = [
    { icon: <Bold className="h-4 w-4" />, tooltip: 'Полужирный', action: () => formatDoc('bold') },
    { icon: <Italic className="h-4 w-4" />, tooltip: 'Курсив', action: () => formatDoc('italic') },
    { icon: <Underline className="h-4 w-4" />, tooltip: 'Подчеркнутый', action: () => formatDoc('underline') }
  ];
  
  const headingActions = [
    { icon: <Heading1 className="h-4 w-4" />, tooltip: 'Заголовок 1', action: () => formatDoc('formatBlock', 'h1') },
    { icon: <Heading2 className="h-4 w-4" />, tooltip: 'Заголовок 2', action: () => formatDoc('formatBlock', 'h2') },
    { icon: <Heading3 className="h-4 w-4" />, tooltip: 'Заголовок 3', action: () => formatDoc('formatBlock', 'h3') }
  ];
  
  const listActions = [
    { icon: <ListIcon className="h-4 w-4" />, tooltip: 'Маркированный список', action: () => formatDoc('insertUnorderedList') },
    { icon: <ListOrdered className="h-4 w-4" />, tooltip: 'Нумерованный список', action: () => formatDoc('insertOrderedList') },
    { icon: <Quote className="h-4 w-4" />, tooltip: 'Цитата', action: () => formatDoc('formatBlock', 'blockquote') }
  ];

  // Рендер кнопки форматирования
  const renderButton = (action: any, index: number) => (
    <TooltipProvider key={index}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.preventDefault();
              action.action();
            }}
            className="h-8 w-8 p-0"
          >
            {action.icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{action.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="flex flex-wrap gap-2 p-1 border rounded-md bg-muted/30">
      <FormattingGroup>
        {textActions.map(renderButton)}
      </FormattingGroup>

      <FormattingGroup>
        {headingActions.map(renderButton)}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => formatDoc('formatBlock', 'p')}
                className="h-8 px-2 text-xs"
              >
                Абзац
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Обычный текст</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </FormattingGroup>

      <FormattingGroup>
        {listActions.map(renderButton)}
      </FormattingGroup>

      <FormattingGroup>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={addTextBlock}
                className="h-8 px-2 flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="text-xs">Блок</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Добавить текстовый блок</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </FormattingGroup>
    </div>
  );
};
