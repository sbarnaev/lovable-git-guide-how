
import { Dispatch, SetStateAction } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PersonalityTabContentProps {
  resourceManifestation: string;
  setResourceManifestation: Dispatch<SetStateAction<string>>;
  distortedManifestation: string;
  setDistortedManifestation: Dispatch<SetStateAction<string>>;
  developmentTask: string;
  setDevelopmentTask: Dispatch<SetStateAction<string>>;
  resourceQualities: string;
  setResourceQualities: Dispatch<SetStateAction<string>>;
  keyDistortions: string;
  setKeyDistortions: Dispatch<SetStateAction<string>>;
}

export const PersonalityTabContent = ({
  resourceManifestation,
  setResourceManifestation,
  distortedManifestation,
  setDistortedManifestation,
  developmentTask,
  setDevelopmentTask,
  resourceQualities,
  setResourceQualities,
  keyDistortions,
  setKeyDistortions
}: PersonalityTabContentProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Код личности</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ресурсное проявление</label>
            <Textarea 
              value={resourceManifestation} 
              onChange={(e) => setResourceManifestation(e.target.value)}
              placeholder="Введите ресурсное проявление"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Искаженное проявление</label>
            <Textarea 
              value={distortedManifestation} 
              onChange={(e) => setDistortedManifestation(e.target.value)}
              placeholder="Введите искаженное проявление"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Задача развития</label>
            <Textarea 
              value={developmentTask} 
              onChange={(e) => setDevelopmentTask(e.target.value)}
              placeholder="Введите задачу развития"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Ключевые качества в ресурсе (каждое с новой строки)</label>
            <Textarea 
              value={resourceQualities} 
              onChange={(e) => setResourceQualities(e.target.value)}
              placeholder="Введите ключевые качества в ресурсе, каждое с новой строки"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Ключевые искажения (каждое с новой строки)</label>
            <Textarea 
              value={keyDistortions} 
              onChange={(e) => setKeyDistortions(e.target.value)}
              placeholder="Введите ключевые искажения, каждое с новой строки"
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
