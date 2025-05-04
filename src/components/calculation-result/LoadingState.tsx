
import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin h-8 w-8 border-4 border-numerica border-t-transparent rounded-full mr-3"></div>
      Загрузка расчета...
    </div>
  );
};
