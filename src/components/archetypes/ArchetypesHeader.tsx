
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Image, FileText } from "lucide-react";

interface ArchetypesHeaderProps {
  title: string;
  description: string;
}

export const ArchetypesHeader = ({ title, description }: ArchetypesHeaderProps) => {
  // Определяем текущий путь
  const path = window.location.pathname;
  
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="flex gap-2 self-start">
        {path === "/archetypes" && (
          <Button variant="outline" asChild>
            <Link to="/archetype-images">
              <Image className="mr-2 h-4 w-4" />
              Фотографии архетипов
            </Link>
          </Button>
        )}
        
        {path === "/archetype-images" && (
          <Button variant="outline" asChild>
            <Link to="/archetypes">
              <FileText className="mr-2 h-4 w-4" />
              Описания архетипов
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
