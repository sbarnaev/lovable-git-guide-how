
import React from 'react';

interface ArchetypeImageProps {
  imageUrl: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export const ArchetypeImage: React.FC<ArchetypeImageProps> = ({ 
  imageUrl, 
  alt, 
  className = "", 
  onClick 
}) => {
  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onClick={onClick}
    >
      <img 
        src={imageUrl} 
        alt={alt}
        className="w-full h-full object-contain rounded-md"
      />
    </div>
  );
};
