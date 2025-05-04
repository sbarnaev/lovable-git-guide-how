
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArchetypesList } from "@/components/archetypes/ArchetypesList";
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";

interface ArchetypesSidebarProps {
  descriptions: ArchetypeDescription[];
  onSelect: (code: NumerologyCodeType, value: number) => void;
  loading: boolean;
}

export const ArchetypesSidebar: React.FC<ArchetypesSidebarProps> = ({ 
  descriptions,
  onSelect,
  loading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Существующие архетипы</CardTitle>
      </CardHeader>
      <CardContent>
        <ArchetypesList 
          descriptions={descriptions} 
          onSelect={onSelect}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};
