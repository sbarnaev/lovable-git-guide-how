
import React from 'react';

interface FormattingGroupProps {
  children: React.ReactNode;
}

export const FormattingGroup = ({ children }: FormattingGroupProps) => {
  return <div className="flex gap-1">{children}</div>;
};
