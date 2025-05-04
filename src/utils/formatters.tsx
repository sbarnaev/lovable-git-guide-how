
import React from 'react';

/**
 * Format a full name to show first name and patronymic with surname below
 */
export const formatName = (fullName: string): React.ReactNode => {
  const nameParts = fullName.trim().split(' ');
  
  if (nameParts.length <= 1) {
    return <p>{fullName}</p>;
  }
  
  // Extract surname (last element) and the rest
  const surname = nameParts.pop() || '';
  const firstName = nameParts.join(' ');
  
  return (
    <div>
      <p>{firstName}</p>
      <p className="text-sm text-muted-foreground">{surname}</p>
    </div>
  );
};

/**
 * Format a date to a Russian locale string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};
