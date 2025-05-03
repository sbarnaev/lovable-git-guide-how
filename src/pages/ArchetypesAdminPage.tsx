
import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArchetypeDescription, NumerologyCodeType } from "@/types/numerology";
import { addArchetypeDescription, getAllArchetypeDescriptions, getArchetypeDescription } from "@/utils/archetypeDescriptions";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Image, ImagePlus, Upload, Edit, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ArchetypesAdminPage = () => {
  const [descriptions, setDescriptions] = useState<ArchetypeDescription[]>([]);
  const [selectedCode, setSelectedCode] = useState<NumerologyCodeType>('personality');
  const [selectedValue, setSelectedValue] = useState<number>(1);
  const [activeTab, setActiveTab] = useState("general");
  
  const maleImageInputRef = useRef<HTMLInputElement>(null);
  const femaleImageInputRef = useRef<HTMLInputElement>(null);
  
  // General fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maleImageUrl, setMaleImageUrl] = useState<string>("");
  const [femaleImageUrl, setFemaleImageUrl] = useState<string>("");
  
  // Personality Code fields
  const [resourceManifestation, setResourceManifestation] = useState("");
  const [distortedManifestation, setDistortedManifestation] = useState("");
  const [developmentTask, setDevelopmentTask] = useState("");
  const [resourceQualities, setResourceQualities] = useState("");
  const [keyDistortions, setKeyDistortions] = useState("");
  
  // Connector Code fields
  const [keyTask, setKeyTask] = useState("");
  const [workingAspects, setWorkingAspects] = useState("");
  const [nonWorkingAspects, setNonWorkingAspects] = useState("");
  const [worldContactBasis, setWorldContactBasis] = useState("");
  
  // Realization Code fields
  const [formula, setFormula] = useState("");
  const [potentialRealizationWays, setPotentialRealizationWays] = useState("");
  const [successSources, setSuccessSources] = useState("");
  const [realizationType, setRealizationType] = useState("");
  const [realizationObstacles, setRealizationObstacles] = useState("");
  const [recommendations, setRecommendations] = useState("");
  
  // Generator Code fields
  const [generatorFormula, setGeneratorFormula] = useState("");
  const [energySources, setEnergySources] = useState("");
  const [energyDrains, setEnergyDrains] = useState("");
  const [flowSigns, setFlowSigns] = useState("");
  const [burnoutSigns, setBurnoutSigns] = useState("");
  const [generatorRecommendation, setGeneratorRecommendation] = useState("");
  
  // Mission Code fields
  const [missionEssence, setMissionEssence] = useState("");
  const [missionRealizationFactors, setMissionRealizationFactors] = useState("");
  const [missionChallenges, setMissionChallenges] = useState("");
  const [missionObstacles, setMissionObstacles] = useState("");
  const [mainTransformation, setMainTransformation] = useState("");

  // Load all descriptions
  useEffect(() => {
    const allDescriptions = getAllArchetypeDescriptions();
    setDescriptions(allDescriptions);
  }, []);

  // Load specific description when code or value changes
  useEffect(() => {
    const desc = getArchetypeDescription(selectedCode, selectedValue);
    
    if (desc) {
      // General
      setTitle(desc.title || "");
      setDescription(desc.description || "");
      setMaleImageUrl(desc.maleImageUrl || "");
      setFemaleImageUrl(desc.femaleImageUrl || "");
      
      // Personality Code
      setResourceManifestation(desc.resourceManifestation || "");
      setDistortedManifestation(desc.distortedManifestation || "");
      setDevelopmentTask(desc.developmentTask || "");
      setResourceQualities(desc.resourceQualities?.join('\n') || "");
      setKeyDistortions(desc.keyDistortions?.join('\n') || "");
      
      // Connector Code
      setKeyTask(desc.keyTask || "");
      setWorkingAspects(desc.workingAspects?.join('\n') || "");
      setNonWorkingAspects(desc.nonWorkingAspects?.join('\n') || "");
      setWorldContactBasis(desc.worldContactBasis || "");
      
      // Realization Code
      setFormula(desc.formula || "");
      setPotentialRealizationWays(desc.potentialRealizationWays?.join('\n') || "");
      setSuccessSources(desc.successSources?.join('\n') || "");
      setRealizationType(desc.realizationType || "");
      setRealizationObstacles(desc.realizationObstacles?.join('\n') || "");
      setRecommendations(desc.recommendations?.join('\n') || "");
      
      // Generator Code
      setGeneratorFormula(desc.generatorFormula || "");
      setEnergySources(desc.energySources?.join('\n') || "");
      setEnergyDrains(desc.energyDrains?.join('\n') || "");
      setFlowSigns(desc.flowSigns?.join('\n') || "");
      setBurnoutSigns(desc.burnoutSigns?.join('\n') || "");
      setGeneratorRecommendation(desc.generatorRecommendation || "");
      
      // Mission Code
      setMissionEssence(desc.missionEssence || "");
      setMissionRealizationFactors(desc.missionRealizationFactors?.join('\n') || "");
      setMissionChallenges(desc.missionChallenges || "");
      setMissionObstacles(desc.missionObstacles?.join('\n') || "");
      setMainTransformation(desc.mainTransformation || "");
    } else {
      // Clear all fields if no description is found
      clearAllFields();
    }
  }, [selectedCode, selectedValue]);
  
  const clearAllFields = () => {
    // General
    setTitle("");
    setDescription("");
    setMaleImageUrl("");
    setFemaleImageUrl("");
    
    // Personality Code
    setResourceManifestation("");
    setDistortedManifestation("");
    setDevelopmentTask("");
    setResourceQualities("");
    setKeyDistortions("");
    
    // Connector Code
    setKeyTask("");
    setWorkingAspects("");
    setNonWorkingAspects("");
    setWorldContactBasis("");
    
    // Realization Code
    setFormula("");
    setPotentialRealizationWays("");
    setSuccessSources("");
    setRealizationType("");
    setRealizationObstacles("");
    setRecommendations("");
    
    // Generator Code
    setGeneratorFormula("");
    setEnergySources("");
    setEnergyDrains("");
    setFlowSigns("");
    setBurnoutSigns("");
    setGeneratorRecommendation("");
    
    // Mission Code
    setMissionEssence("");
    setMissionRealizationFactors("");
    setMissionChallenges("");
    setMissionObstacles("");
    setMainTransformation("");
  };

  const handleSave = () => {
    const parseTextToArray = (text: string) => {
      return text
        .split('\n')
        .map(str => str.trim())
        .filter(str => str !== "");
    };

    const archetypeDescription: ArchetypeDescription = {
      code: selectedCode,
      value: selectedValue,
      title,
      description,
      maleImageUrl,
      femaleImageUrl,
      
      // Personality Code
      resourceManifestation,
      distortedManifestation,
      developmentTask,
      resourceQualities: parseTextToArray(resourceQualities),
      keyDistortions: parseTextToArray(keyDistortions),
      
      // Connector Code
      keyTask,
      workingAspects: parseTextToArray(workingAspects),
      nonWorkingAspects: parseTextToArray(nonWorkingAspects),
      worldContactBasis,
      
      // Realization Code
      formula,
      potentialRealizationWays: parseTextToArray(potentialRealizationWays),
      successSources: parseTextToArray(successSources),
      realizationType,
      realizationObstacles: parseTextToArray(realizationObstacles),
      recommendations: parseTextToArray(recommendations),
      
      // Generator Code
      generatorFormula,
      energySources: parseTextToArray(energySources),
      energyDrains: parseTextToArray(energyDrains),
      flowSigns: parseTextToArray(flowSigns),
      burnoutSigns: parseTextToArray(burnoutSigns),
      generatorRecommendation,
      
      // Mission Code
      missionEssence,
      missionRealizationFactors: parseTextToArray(missionRealizationFactors),
      missionChallenges,
      missionObstacles: parseTextToArray(missionObstacles),
      mainTransformation,
      
      // Backward compatibility
      strengths: parseTextToArray(resourceQualities),
      challenges: parseTextToArray(keyDistortions),
    };

    addArchetypeDescription(archetypeDescription);
    
    toast.success("Описание архетипа сохранено");
    
    // Update the descriptions list
    setDescriptions(getAllArchetypeDescriptions());
  };

  const handleImageChange = (type: 'male' | 'female') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      
      if (type === 'male') {
        setMaleImageUrl(imageUrl);
      } else {
        setFemaleImageUrl(imageUrl);
      }
      
      toast.success(`Фотография ${type === 'male' ? 'мужского' : 'женского'} архетипа добавлена`);
    }
  };

  const handleImageDelete = (type: 'male' | 'female') => () => {
    if (type === 'male') {
      setMaleImageUrl("");
    } else {
      setFemaleImageUrl("");
    }
    
    toast.success(`Фотография ${type === 'male' ? 'мужского' : 'женского'} архетипа удалена`);
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
    
  const renderImageUpload = (type: 'male' | 'female') => {
    const imageUrl = type === 'male' ? maleImageUrl : femaleImageUrl;
    const inputRef = type === 'male' ? maleImageInputRef : femaleImageInputRef;
    
    return (
      <div className="space-y-2">
        <Label>{type === 'male' ? 'Фото мужского архетипа' : 'Фото женского архетипа'}</Label>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={`${type} archetype`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="space-x-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              {imageUrl ? <Edit /> : <Upload />}
              {imageUrl ? 'Изменить' : 'Загрузить'}
            </Button>
            
            {imageUrl && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm"
                onClick={handleImageDelete(type)}
              >
                <Trash2 />
                Удалить
              </Button>
            )}
            
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange(type)}
            />
          </div>
        </div>
      </div>
    );
  };

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
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                <TabsTrigger value="general">Общее</TabsTrigger>
                <TabsTrigger value="personality">Личность</TabsTrigger>
                <TabsTrigger value="connector">Коннектор</TabsTrigger>
                <TabsTrigger value="realization">Реализация</TabsTrigger>
                <TabsTrigger value="generator">Генератор</TabsTrigger>
                <TabsTrigger value="mission">Миссия</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
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
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {renderImageUpload('male')}
                  {renderImageUpload('female')}
                </div>
              </TabsContent>
              
              <TabsContent value="personality" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="connector" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="realization" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="generator" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="mission" className="space-y-4">
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
              </TabsContent>
            </Tabs>
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
                      setActiveTab('general');
                    }}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArchetypesAdminPage;
