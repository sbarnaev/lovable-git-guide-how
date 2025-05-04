
import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, Upload, Trash2, UserRound, Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { ArchetypeDescription } from "@/types/numerology";
import { addArchetypeDescription } from "@/utils/archetypeDescriptions";

interface ArchetypeImagesUploaderProps {
  archetypes: ArchetypeDescription[];
  onUpload: () => void;
}

export const ArchetypeImagesUploader = ({ archetypes, onUpload }: ArchetypeImagesUploaderProps) => {
  const [selectedValue, setSelectedValue] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  
  const maleImageInputRef = useRef<HTMLInputElement>(null);
  const femaleImageInputRef = useRef<HTMLInputElement>(null);
  
  // Get all archetypes with the selected value
  const selectedArchetypes = archetypes.filter(a => a.value === selectedValue);
  
  // For display, we'll use the personality archetype if available
  const displayArchetype = selectedArchetypes.find(a => a.code === "personality") || selectedArchetypes[0];
  
  // Get the image URLs from any archetype with this value
  const getMaleImageUrl = () => {
    const archWithImage = selectedArchetypes.find(a => a.maleImageUrl);
    return archWithImage?.maleImageUrl || "";
  };
  
  const getFemaleImageUrl = () => {
    const archWithImage = selectedArchetypes.find(a => a.femaleImageUrl);
    return archWithImage?.femaleImageUrl || "";
  };
  
  const handleValueChange = (value: number) => {
    setSelectedValue(value);
  };
  
  const valueOptions = Array.from({ length: 9 }, (_, i) => i + 1);
  
  const handleImageUpload = (gender: 'male' | 'female') => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files[0]) return;
    
    setLoading(true);
    
    try {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      
      // Update image URL for all archetypes with this value
      const updatePromises = selectedArchetypes.map(archetype => {
        const updatedArchetype = { 
          ...archetype,
          ...(gender === 'male' ? { maleImageUrl: imageUrl } : { femaleImageUrl: imageUrl })
        };
        
        return addArchetypeDescription(updatedArchetype);
      });
      
      const results = await Promise.all(updatePromises);
      
      if (results.every(Boolean)) {
        toast.success(`Фотография ${gender === 'male' ? 'мужского' : 'женского'} архетипа ${selectedValue} обновлена`);
        onUpload(); // Refresh the parent component
      } else {
        toast.error("Ошибка при сохранении некоторых архетипов");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Ошибка при загрузке изображения");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteImage = async (gender: 'male' | 'female') => {
    if (selectedArchetypes.length === 0) return;
    
    setLoading(true);
    
    try {
      // Remove image URL from all archetypes with this value
      const updatePromises = selectedArchetypes.map(archetype => {
        const updatedArchetype = { 
          ...archetype,
          ...(gender === 'male' ? { maleImageUrl: undefined } : { femaleImageUrl: undefined })
        };
        
        return addArchetypeDescription(updatedArchetype);
      });
      
      const results = await Promise.all(updatePromises);
      
      if (results.every(Boolean)) {
        toast.success(`Фотография ${gender === 'male' ? 'мужского' : 'женского'} архетипа ${selectedValue} удалена`);
        onUpload(); // Refresh the parent component
      } else {
        toast.error("Ошибка при удалении фотографий некоторых архетипов");
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
          <div>
            <Label>Выберите архетип (1-9)</Label>
            <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mt-2">
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
          
          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium">
                  {displayArchetype ? `Архетип ${selectedValue}` : `Архетип ${selectedValue}`}
                </h3>
                {displayArchetype?.description && (
                  <p className="text-sm text-muted-foreground mt-1">{displayArchetype.description}</p>
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
                  <div className="relative h-64 w-48 rounded-lg overflow-hidden border">
                    {getMaleImageUrl() ? (
                      <img 
                        src={getMaleImageUrl()} 
                        alt={`Мужской архетип ${selectedValue}`} 
                        className="h-full w-full object-contain"
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
                    
                    {getMaleImageUrl() && (
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
                  <div className="relative h-64 w-48 rounded-lg overflow-hidden border">
                    {getFemaleImageUrl() ? (
                      <img 
                        src={getFemaleImageUrl()} 
                        alt={`Женский архетип ${selectedValue}`} 
                        className="h-full w-full object-contain"
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
                    
                    {getFemaleImageUrl() && (
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
