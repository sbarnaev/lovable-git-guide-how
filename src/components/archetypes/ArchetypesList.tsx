
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface ArchetypesListProps {
  descriptions: ArchetypeDescription[];
  onSelect: (code: NumerologyCodeType, value: number) => void;
  loading?: boolean;
}

export const ArchetypesList = ({ descriptions, onSelect, loading = false }: ArchetypesListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!descriptions || descriptions.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Нет доступных архетипов
      </div>
    );
  }

  // Group descriptions by code
  const groupedDescriptions: Record<string, ArchetypeDescription[]> = {};
  
  descriptions.forEach(desc => {
    if (!groupedDescriptions[desc.code]) {
      groupedDescriptions[desc.code] = [];
    }
    groupedDescriptions[desc.code].push(desc);
  });

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-6">
        {Object.entries(groupedDescriptions).map(([code, codeDescriptions]) => (
          <div key={code} className="space-y-2">
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
              {code === 'personality' ? 'Код Личности' : 
               code === 'connector' ? 'Код Коннектора' : 
               code === 'realization' ? 'Код Реализации' : 
               code === 'generator' ? 'Код Генератора' : 
               code === 'mission' ? 'Код Миссии' : code}
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {codeDescriptions
                .sort((a, b) => a.value - b.value)
                .map(desc => (
                  <Button
                    key={`${desc.code}-${desc.value}`}
                    variant="outline"
                    size="sm"
                    onClick={() => onSelect(desc.code as NumerologyCodeType, desc.value)}
                    className="flex gap-2 items-center"
                  >
                    <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {desc.value}
                    </Badge>
                    {desc.title ? (
                      <span className="text-xs truncate max-w-[120px]">{desc.title}</span>
                    ) : (
                      <span className="text-xs">Архетип {desc.value}</span>
                    )}
                  </Button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
