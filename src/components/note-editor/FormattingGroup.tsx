
import React from 'react';
import { cn } from '@/lib/utils';

interface FormattingGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FormattingGroup = ({ children, className }: FormattingGroupProps) => {
  return (
    <div className={cn("flex items-center border-r pr-2 mr-2 last:border-r-0 last:pr-0 last:mr-0", className)}>
      {children}
    </div>
  );
};
