
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";
import { addArchetypeDescription, getAllArchetypeDescriptions, getArchetypeDescription } from "@/utils/archetypeDescriptions";
import { toast } from "@/components/ui/sonner";

const ArchetypesAdminPage = () => {
  const [descriptions, setDescriptions] = useState<ArchetypeDescription[]>([]);
  const [selectedCode, setSelectedCode] = useState<NumerologyCodeType>('personality');
  const [selectedValue, setSelectedValue] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [strengths, setStrengths] = useState("");
  const [challenges, setChallenges] = useState("");
  const [recommendations, setRecommendations] = useState("");

  // Load all descriptions
  useEffect(() => {
    const allDescriptions = getAllArchetypeDescriptions();
    setDescriptions(allDescriptions);
  }, []);

  // Load specific description when code or value changes
  useEffect(() => {
    const desc = getArchetypeDescription(selectedCode, selectedValue);
    
    if (desc) {
      setTitle(desc.title);
      setDescription(desc.description);
      setStrengths(desc.strengths.join('\n'));
      setChallenges(desc.challenges.join('\n'));
      setRecommendations(desc.recommendations.join('\n'));
    } else {
      setTitle("");
      setDescription("");
      setStrengths("");
      setChallenges("");
      setRecommendations("");
    }
  }, [selectedCode, selectedValue]);

  const handleSave = () => {
    const strengthsArray = strengths
      .split('\n')
      .map(str => str.trim())
      .filter(str => str !== "");
      
    const challengesArray = challenges
      .split('\n')
      .map(str => str.trim())
      .filter(str => str !== "");
      
    const recommendationsArray = recommendations
      .split('\n')
      .map(str => str.trim())
      .filter(str => str !== "");

    const archetypeDescription: ArchetypeDescription = {
      code: selectedCode,
      value: selectedValue,
      title,
      description,
      strengths: strengthsArray,
      challenges: challengesArray,
      recommendations: recommendationsArray
    };

    addArchetypeDescription(archetypeDescription);
    
    toast.success("Описание архетипа сохранено");
    
    // Update the descriptions list
    setDescriptions(getAllArchetypeDescriptions());
  };

  const getCodeLabel = (code: NumerologyCodeType): string => {
    switch (code) {
      case 'personality': return 'Код Личности';
      case 'connector': return 'Код Коннектора';
      case 'realization': return 'Код Реализации';
      case 'generator': return 'Код Генератора';
      case 'mission': return 'Код Миссии';
    }
  };

  const allowedValues = selectedCode === 'mission' 
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 11] 
    : [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Управление архетипами</h1>
        <p className="text-muted-foreground">
          Добавление и редактирование описаний архетипов для каждого кода
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Редактор архетипов</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Код</label>
                <Select 
                  value={selectedCode} 
                  onValueChange={(value) => setSelectedCode(value as NumerologyCodeType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите код" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personality">Код Личности</SelectItem>
                    <SelectItem value="connector">Код Коннектора</SelectItem>
                    <SelectItem value="realization">Код Реализации</SelectItem>
                    <SelectItem value="generator">Код Генератора</SelectItem>
                    <SelectItem value="mission">Код Миссии</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Значение</label>
                <Select 
                  value={selectedValue.toString()} 
                  onValueChange={(value) => setSelectedValue(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите значение" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedValues.map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Название архетипа</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название архетипа"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Описание</label>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введите описание архетипа"
                rows={6}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Сильные стороны (каждая с новой строки)</label>
              <Textarea 
                value={strengths} 
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="Введите сильные стороны, каждую с новой строки"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Потенциальные вызовы (каждый с новой строки)</label>
              <Textarea 
                value={challenges} 
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="Введите вызовы, каждый с новой строки"
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
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>Сохранить</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Существующие архетипы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {descriptions.length === 0 ? (
                <p className="text-muted-foreground">Нет добавленных описаний</p>
              ) : (
                descriptions.map((desc, index) => (
                  <div 
                    key={index} 
                    className="p-3 border rounded-md cursor-pointer hover:bg-secondary/50"
                    onClick={() => {
                      setSelectedCode(desc.code);
                      setSelectedValue(desc.value);
                    }}
                  >
                    <div className="font-medium">{desc.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {getCodeLabel(desc.code)} {desc.value}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArchetypesAdminPage;
