
import { Dispatch, SetStateAction } from "react";
import { Textarea } from "@/components/ui/textarea";

interface GeneratorTabContentProps {
  generatorFormula: string;
  setGeneratorFormula: Dispatch<SetStateAction<string>>;
  energySources: string;
  setEnergySources: Dispatch<SetStateAction<string>>;
  energyDrains: string;
  setEnergyDrains: Dispatch<SetStateAction<string>>;
  flowSigns: string;
  setFlowSigns: Dispatch<SetStateAction<string>>;
  burnoutSigns: string;
  setBurnoutSigns: Dispatch<SetStateAction<string>>;
  generatorRecommendation: string;
  setGeneratorRecommendation: Dispatch<SetStateAction<string>>;
}

export const GeneratorTabContent = ({
  generatorFormula,
  setGeneratorFormula,
  energySources,
  setEnergySources,
  energyDrains,
  setEnergyDrains,
  flowSigns,
  setFlowSigns,
  burnoutSigns,
  setBurnoutSigns,
  generatorRecommendation,
  setGeneratorRecommendation
}: GeneratorTabContentProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Формула</label>
        <Textarea 
          value={generatorFormula} 
          onChange={(e) => setGeneratorFormula(e.target.value)}
          placeholder="Введите формулу"
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Что дает энергию (каждый пункт с новой строки)</label>
        <Textarea 
          value={energySources} 
          onChange={(e) => setEnergySources(e.target.value)}
          placeholder="Введите пункты, каждый с новой строки"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Что забирает энергию (каждый пункт с новой строки)</label>
        <Textarea 
          value={energyDrains} 
          onChange={(e) => setEnergyDrains(e.target.value)}
          placeholder="Введите пункты, каждый с новой строки"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Признаки, что человек в потоке (каждый пункт с новой строки)</label>
        <Textarea 
          value={flowSigns} 
          onChange={(e) => setFlowSigns(e.target.value)}
          placeholder="Введите пункты, каждый с новой строки"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Признаки, что человек выгорел (каждый пункт с новой строки)</label>
        <Textarea 
          value={burnoutSigns} 
          onChange={(e) => setBurnoutSigns(e.target.value)}
          placeholder="Введите пункты, каждый с новой строки"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Рекомендация</label>
        <Textarea 
          value={generatorRecommendation} 
          onChange={(e) => setGeneratorRecommendation(e.target.value)}
          placeholder="Введите рекомендацию"
          rows={4}
        />
      </div>
    </div>
  );
};
