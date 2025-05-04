
import React from 'react';

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center h-full text-destructive">
      Ошибка: {error}
    </div>
  );
};
