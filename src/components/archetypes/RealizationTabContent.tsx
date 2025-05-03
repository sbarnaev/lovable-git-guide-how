
import { Dispatch, SetStateAction } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface RealizationTabContentProps {
  formula: string;
  setFormula: Dispatch<SetStateAction<string>>;
  potentialRealizationWays: string;
  setPotentialRealizationWays: Dispatch<SetStateAction<string>>;
  successSources: string;
  setSuccessSources: Dispatch<SetStateAction<string>>;
  realizationType: string;
  setRealizationType: Dispatch<SetStateAction<string>>;
  realizationObstacles: string;
  setRealizationObstacles: Dispatch<SetStateAction<string>>;
  recommendations: string;
  setRecommendations: Dispatch<SetStateAction<string>>;
}

export const RealizationTabContent = ({
  formula,
  setFormula,
  potentialRealizationWays,
  setPotentialRealizationWays,
  successSources,
  setSuccessSources,
  realizationType,
  setRealizationType,
  realizationObstacles,
  setRealizationObstacles,
  recommendations,
  setRecommendations
}: RealizationTabContentProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Формула</label>
        <Textarea 
          value={formula} 
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Введите формулу"
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Как реализуется потенциал (каждый пункт с новой строки)</label>
        <Textarea 
          value={potentialRealizationWays} 
          onChange={(e) => setPotentialRealizationWays(e.target.value)}
          placeholder="Введите пункты, каждый с новой строки"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Где находится источник дохода и успеха (каждый пункт с новой строки)</label>
        <Textarea 
          value={successSources} 
          onChange={(e) => setSuccessSources(e.target.value)}
          placeholder="Введите пункты, каждый с новой строки"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Тип реализации</label>
        <Input 
          value={realizationType} 
          onChange={(e) => setRealizationType(e.target.value)}
          placeholder="Введите тип реализации"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Искажения (что мешает реализовываться) (каждый пункт с новой строки)</label>
        <Textarea 
          value={realizationObstacles} 
          onChange={(e) => setRealizationObstacles(e.target.value)}
          placeholder="Введите пункты, каждый с новой строки"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Рекомендации (каждая с новой строки)</label>
        <Textarea 
          value={recommendations} 
          onChange={(e) => setRecommendations(e.target.value)}
          placeholder="Введите рекомендации, каждую с новой строки"
          rows={4}
        />
      </div>
    </div>
  );
};
