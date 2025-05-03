
import { Dispatch, SetStateAction } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConnectorTabContentProps {
  keyTask: string;
  setKeyTask: Dispatch<SetStateAction<string>>;
  workingAspects: string;
  setWorkingAspects: Dispatch<SetStateAction<string>>;
  nonWorkingAspects: string;
  setNonWorkingAspects: Dispatch<SetStateAction<string>>;
  worldContactBasis: string;
  setWorldContactBasis: Dispatch<SetStateAction<string>>;
}

export const ConnectorTabContent = ({
  keyTask,
  setKeyTask,
  workingAspects,
  setWorkingAspects,
  nonWorkingAspects,
  setNonWorkingAspects,
  worldContactBasis,
  setWorldContactBasis
}: ConnectorTabContentProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Код коннектора</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ключевая задача</label>
            <Textarea 
              value={keyTask} 
              onChange={(e) => setKeyTask(e.target.value)}
              placeholder="Введите ключевую задачу"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Что работает (в ресурсе) (каждый пункт с новой строки)</label>
            <Textarea 
              value={workingAspects} 
              onChange={(e) => setWorkingAspects(e.target.value)}
              placeholder="Введите пункты, каждый с новой строки"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Что не работает (искажения) (каждый пункт с новой строки)</label>
            <Textarea 
              value={nonWorkingAspects} 
              onChange={(e) => setNonWorkingAspects(e.target.value)}
              placeholder="Введите пункты, каждый с новой строки"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Контакт с миром должен строиться на</label>
            <Textarea 
              value={worldContactBasis} 
              onChange={(e) => setWorldContactBasis(e.target.value)}
              placeholder="Введите основу для контакта с миром"
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
