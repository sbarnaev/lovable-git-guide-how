
import React from 'react';
import { ArchetypeDisplay } from './ArchetypeDisplay';

interface SecondaryArchetypesProps {
  codes: {
    connectorCode: number;
    realizationCode: number;
    generatorCode: number;
    missionCode: number;
  };
  getImageUrl: (code: number) => string;
  onImageClick: (imageUrl: string) => void;
}

export const SecondaryArchetypes: React.FC<SecondaryArchetypesProps> = ({ 
  codes, 
  getImageUrl, 
  onImageClick 
}) => {
  console.log("Secondary archetypes codes:", codes);
  
  if (!codes) {
    return (
      <div className="text-center text-muted-foreground text-sm py-2">
        Данные кодов отсутствуют
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Connector */}
      <ArchetypeDisplay
        code={codes.connectorCode}
        label="Коннектор"
        imageUrl={getImageUrl(codes.connectorCode)}
        onImageClick={onImageClick}
      />
      
      {/* Realization */}
      <ArchetypeDisplay
        code={codes.realizationCode}
        label="Реализация"
        imageUrl={getImageUrl(codes.realizationCode)}
        onImageClick={onImageClick}
      />
      
      {/* Generator */}
      <ArchetypeDisplay
        code={codes.generatorCode}
        label="Генератор"
        imageUrl={getImageUrl(codes.generatorCode)}
        onImageClick={onImageClick}
      />
      
      {/* Mission (with opacity) */}
      <ArchetypeDisplay
        code={codes.missionCode}
        label="Миссия"
        imageUrl={getImageUrl(codes.missionCode)}
        opacity={0.7}
        onImageClick={onImageClick}
      />
    </div>
  );
};
