
import React from "react";
import { Button } from "@/components/ui/button";

interface SaveArchetypeButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export const SaveArchetypeButton = ({ onClick, loading = false }: SaveArchetypeButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={loading}
      className="w-full"
    >
      {loading ? "Сохранение..." : "Сохранить архетип"}
    </Button>
  );
};
