
import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, Upload, Trash2, UserRound, Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { NumerologyCodeType, ArchetypeDescription } from "@/types/numerology";
import { addArchetypeDescription, getAllArchetypeDescriptions } from "@/utils/archetypeDescriptions";

interface ArchetypeImagesUploaderProps {
  archetypes: ArchetypeDescription[];
  onUpload: () => void;
}

export const ArchetypeImagesUploader = ({ archetypes, onUpload }: ArchetypeImagesUploaderProps) => {
  const [selectedCode, setSelectedCode] = useState<NumerologyCodeType>("personality");
  const [selectedValue, setSelectedValue] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  
  const maleImageInputRef = useRef<HTMLInputElement>(null);
  const femaleImageInputRef = useRef<HTMLInputElement>(null);
  
  // Find the selected archetype
  const selectedArchetype = archetypes.find(
    a => a.code === selectedCode && a.value === selectedValue
  );

  const handleCodeChange = (code: NumerologyCodeType) => {
    setSelectedCode(code);
    // Reset value to 1 when changing code
    setSelectedValue(1);
  };
  
  const handleValueChange = (value: number) => {
    setSelectedValue(value);
  };
  
  const codeOptions: { value: NumerologyCodeType; label: string }[] = [
    { value: "personality", label: "Код личности" },
    { value: "connector", label: "Код коннектора" },
    { value: "realization", label: "Код реализации" },
    { value: "generator", label: "Код генератора" },
    { value: "mission", label: "Код миссии" }
  ];
  
  const valueOptions = Array.from({ length: 9 }, (_, i) => i + 1);
  
  const handleImageUpload = (gender: 'male' | 'female') => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files[0] || !selectedArchetype) return;
    
    setLoading(true);
    
    try {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      
      // Create a copy of the selected archetype with the updated image URL
      const updatedArchetype = { 
        ...selectedArchetype,
        ...(gender === 'male' ? { maleImageUrl: imageUrl } : { femaleImageUrl: imageUrl })
      };
      
      // Save the updated archetype to the database
      const success = await addArchetypeDescription(updatedArchetype);
      
      if (success) {
        toast.success(`Фотография ${gender === 'male' ? 'мужского' : 'женского'} архетипа ${selectedCode}-${selectedValue} обновлена`);
        onUpload(); // Refresh the parent component
      } else {
        toast.error("Ошибка при сохранении архетипа");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Ошибка при загрузке изображения");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteImage = async (gender: 'male' | 'female') => {
    if (!selectedArchetype) return;
    
    setLoading(true);
    
    try {
      // Create a copy of the selected archetype with the image URL set to undefined
      const updatedArchetype = { 
        ...selectedArchetype,
        ...(gender === 'male' ? { maleImageUrl: undefined } : { femaleImageUrl: undefined })
      };
      
      // Save the updated archetype to the database
      const success = await addArchetypeDescription(updatedArchetype);
      
      if (success) {
        toast.success(`Фотография ${gender === 'male' ? 'мужского' : 'женского'} архетипа ${selectedCode}-${selectedValue} удалена`);
        onUpload(); // Refresh the parent component
      } else {
        toast.error("Ошибка при удалении фотографии");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Ошибка при удалении фотографии");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Загрузка фотографий архетипов</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Label>Выберите тип кода</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                {codeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedCode === option.value ? "default" : "outline"}
                    onClick={() => handleCodeChange(option.value)}
                    className="w-full"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <Label>Выберите значение кода</Label>
              <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-2">
                {valueOptions.map((value) => (
                  <Button
                    key={value}
                    variant={selectedValue === value ? "default" : "outline"}
                    onClick={() => handleValueChange(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium">
                  {selectedArchetype ? selectedArchetype.title : `Архетип ${selectedCode}-${selectedValue}`}
                </h3>
                {selectedArchetype?.description && (
                  <p className="text-sm text-muted-foreground mt-1">{selectedArchetype.description}</p>
                )}
              </div>
            </div>
            
            <Tabs defaultValue="male">
              <TabsList className="mb-4">
                <TabsTrigger value="male" className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  Мужской архетип
                </TabsTrigger>
                <TabsTrigger value="female" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Женский архетип
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="male">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative h-48 w-48 rounded-lg overflow-hidden border">
                    {selectedArchetype?.maleImageUrl ? (
                      <img 
                        src={selectedArchetype.maleImageUrl} 
                        alt={`Мужской архетип ${selectedCode}-${selectedValue}`} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted">
                        <Image className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Button 
                        onClick={() => maleImageInputRef.current?.click()} 
                        variant="outline"
                        className="w-full md:w-auto"
                        disabled={loading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Загрузить фото
                      </Button>
                      <Input 
                        ref={maleImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload('male')}
                      />
                    </div>
                    
                    {selectedArchetype?.maleImageUrl && (
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeleteImage('male')}
                        className="w-full md:w-auto"
                        disabled={loading}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Удалить фото
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="female">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative h-48 w-48 rounded-lg overflow-hidden border">
                    {selectedArchetype?.femaleImageUrl ? (
                      <img 
                        src={selectedArchetype.femaleImageUrl} 
                        alt={`Женский архетип ${selectedCode}-${selectedValue}`} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted">
                        <Image className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Button 
                        onClick={() => femaleImageInputRef.current?.click()} 
                        variant="outline"
                        className="w-full md:w-auto"
                        disabled={loading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Загрузить фото
                      </Button>
                      <Input 
                        ref={femaleImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload('female')}
                      />
                    </div>
                    
                    {selectedArchetype?.femaleImageUrl && (
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeleteImage('female')}
                        className="w-full md:w-auto"
                        disabled={loading}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Удалить фото
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
