
import React from 'react';
import { ArchetypeImage } from './ArchetypeImage';

interface ArchetypeDisplayProps {
  code: number;
  label: string;
  imageUrl: string;
  size?: 'small' | 'large';
  opacity?: number;
  onImageClick: (imageUrl: string) => void;
}

export const ArchetypeDisplay: React.FC<ArchetypeDisplayProps> = ({ 
  code, 
  label, 
  imageUrl, 
  size = 'small',
  opacity = 1,
  onImageClick 
}) => {
  const isLarge = size === 'large';
  const containerClasses = isLarge ? 'flex flex-col items-center mb-4' : 'flex flex-col items-center';
  const imageClasses = isLarge 
    ? `w-32 h-48 mb-2 border-4 border-numerica`
    : `w-16 h-24 mb-1 border-2 border-numerica ${opacity < 1 ? 'opacity-70' : ''}`;
  
  return (
    <div className={containerClasses}>
      <ArchetypeImage 
        imageUrl={imageUrl} 
        alt={`Архетип ${label} ${code}`}
        className={imageClasses}
        onClick={() => imageUrl !== '/placeholder.svg' && onImageClick(imageUrl)}
      />
      <div className="text-center">
        <p className="font-semibold">{code}</p>
        <p className={`${isLarge ? 'text-sm' : 'text-xs'} text-muted-foreground`}>{label}</p>
      </div>
    </div>
  );
};
