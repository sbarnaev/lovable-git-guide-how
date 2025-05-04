
import React from "react";

interface ArchetypesHeaderProps {
  title: string;
  description: string;
}

export const ArchetypesHeader: React.FC<ArchetypesHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
