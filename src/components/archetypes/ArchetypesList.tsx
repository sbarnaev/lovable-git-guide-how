
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ArchetypesListProps {
  descriptions: ArchetypeDescription[];
  onSelect: (code: NumerologyCodeType, value: number) => void;
}

export const ArchetypesList = ({ descriptions, onSelect }: ArchetypesListProps) => {
  const getCodeLabel = (code: NumerologyCodeType): string => {
    switch (code) {
      case 'personality': return 'Код Личности';
      case 'connector': return 'Код Коннектора';
      case 'realization': return 'Код Реализации';
      case 'generator': return 'Код Генератора';
      case 'mission': return 'Код Миссии';
    }
  };
  
  return (
    <div className="space-y-4">
      {descriptions.length === 0 ? (
        <p className="text-muted-foreground">Нет добавленных описаний</p>
      ) : (
        descriptions.map((desc, index) => (
          <div 
            key={index} 
            className="p-3 border rounded-md cursor-pointer hover:bg-secondary/50"
            onClick={() => onSelect(desc.code, desc.value)}
          >
            <div className="font-medium">{desc.title}</div>
            <div className="text-sm text-muted-foreground">
              {getCodeLabel(desc.code)} {desc.value}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {desc.maleImageUrl && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={desc.maleImageUrl} alt="Мужской архетип" />
                        <AvatarFallback>М</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Мужской архетип</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {desc.femaleImageUrl && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={desc.femaleImageUrl} alt="Женский архетип" />
                        <AvatarFallback>Ж</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Женский архетип</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
