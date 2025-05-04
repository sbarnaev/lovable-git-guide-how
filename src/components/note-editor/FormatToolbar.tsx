
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Underline, List, Heading1, Heading2, Heading3,
  Quote, LucideIcon, ListOrdered, PlusCircle
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
    document.execCommand(command, false, value);
    
    if (editorRef.current) {
      // Ensure proper text direction after formatting
      const allElements = editorRef.current.querySelectorAll('*');
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.setAttribute('dir', 'ltr');
          el.style.direction = 'ltr';
          el.style.textAlign = 'left';
          el.style.unicodeBidi = 'normal';
        }
      });
    }
    
    updateContentFromEditor();
  };

  const createFormatAction = (
    icon: LucideIcon, 
    tooltip: string, 
    command: string, 
    value: string = ''
  ): FormatAction => {
    const Icon = icon;
    return {
      icon: <Icon className="h-4 w-4" />,
      tooltip,
      action: () => formatDoc(command, value)
    };
  };

  // Format actions
  const textFormatActions: FormatAction[] = [
    createFormatAction(Bold, 'Полужирный', 'bold'),
    createFormatAction(Italic, 'Курсив', 'italic'),
    createFormatAction(Underline, 'Подчеркнутый', 'underline')
  ];

  const headingFormatActions: FormatAction[] = [
    createFormatAction(Heading1, 'Заголовок 1', 'formatBlock', 'h1'),
    createFormatAction(Heading2, 'Заголовок 2', 'formatBlock', 'h2'),
    createFormatAction(Heading3, 'Заголовок 3', 'formatBlock', 'h3')
  ];

  const listFormatActions: FormatAction[] = [
    createFormatAction(List, 'Маркированный список', 'insertUnorderedList'),
    createFormatAction(ListOrdered, 'Нумерованный список', 'insertOrderedList')
  ];

  const quoteFormatAction: FormatAction = createFormatAction(
    Quote, 
    'Цитата', 
    'formatBlock', 
    'blockquote'
  );

  const renderFormatButton = (action: FormatAction, index: number) => (
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

  // Handle paragraph conversion
  const convertToParagraph = () => {
    formatDoc('formatBlock', 'p');
  };

  return (
    <div className="flex flex-wrap gap-2 p-1 border rounded-md bg-muted/30">
      <FormattingGroup>
        {textFormatActions.map(renderFormatButton)}
      </FormattingGroup>

      <FormattingGroup>
        {headingFormatActions.map(renderFormatButton)}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={convertToParagraph}
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
        {listFormatActions.map(renderFormatButton)}
        {renderFormatButton(quoteFormatAction, 0)}
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
