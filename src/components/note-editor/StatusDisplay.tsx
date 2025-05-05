
import React from 'react';

interface StatusDisplayProps {
  contentChanged: boolean;
}

export const StatusDisplay = ({ contentChanged }: StatusDisplayProps) => {
  return (
    <div className="text-xs text-muted-foreground">
      {contentChanged ? 'Есть несохраненные изменения' : 'Все изменения сохранены'}
    </div>
  );
};
