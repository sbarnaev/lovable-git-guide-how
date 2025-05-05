
import { Dispatch, SetStateAction } from "react";
import { Textarea } from "@/components/ui/textarea";

interface MissionTabContentProps {
  missionEssence: string;
  setMissionEssence: Dispatch<SetStateAction<string>>;
  missionRealizationFactors: string;
  setMissionRealizationFactors: Dispatch<SetStateAction<string>>;
  missionChallenges: string;
  setMissionChallenges: Dispatch<SetStateAction<string>>;
  missionObstacles: string;
  setMissionObstacles: Dispatch<SetStateAction<string>>;
  mainTransformation: string;
  setMainTransformation: Dispatch<SetStateAction<string>>;
}

export const MissionTabContent = ({
  missionEssence,
  setMissionEssence,
  missionRealizationFactors,
  setMissionRealizationFactors,
  missionChallenges,
  setMissionChallenges,
  missionObstacles,
  setMissionObstacles,
  mainTransformation,
  setMainTransformation
}: MissionTabContentProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Код миссии</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Суть миссии</label>
        <Textarea 
          value={missionEssence} 
          onChange={(e) => setMissionEssence(e.target.value)}
          placeholder="Введите суть миссии"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Что реализует миссию (каждый пункт с новой строки)</label>
        <Textarea 
          value={missionRealizationFactors} 
          onChange={(e) => setMissionRealizationFactors(e.target.value)}
          placeholder="Введите пункты, каждый с новой строки"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Испытания миссии</label>
        <Textarea 
          value={missionChallenges} 
          onChange={(e) => setMissionChallenges(e.target.value)}
          placeholder="Введите испытания миссии"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Что мешает релизовываться (каждый пункт с новой строки)</label>
        <Textarea 
          value={missionObstacles} 
          onChange={(e) => setMissionObstacles(e.target.value)}
          placeholder="Введите пункты, каждый с новой строки"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Главная трансформация</label>
        <Textarea 
          value={mainTransformation} 
          onChange={(e) => setMainTransformation(e.target.value)}
          placeholder="Введите главную трансформацию"
          rows={4}
        />
      </div>
    </div>
  );
};
