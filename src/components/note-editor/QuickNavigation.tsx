
import React from 'react';
import { Button } from '@/components/ui/button';
import { TextBlock } from './types';

interface QuickNavigationProps {
  textBlocks: TextBlock[];
  onBlockClick: (blockId: string) => void;
}

export const QuickNavigation = ({ textBlocks, onBlockClick }: QuickNavigationProps) => {
  if (textBlocks.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {textBlocks.map(block => (
        <Button
          key={block.id}
          variant="outline"
          size="sm"
          onClick={() => onBlockClick(block.id)}
          className="text-xs"
        >
          {block.title}
        </Button>
      ))}
    </div>
  );
};
