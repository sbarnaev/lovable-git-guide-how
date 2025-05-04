
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ArchetypesHeader } from "@/components/archetypes/ArchetypesHeader";
import { ArchetypeImagesUploader } from "@/components/archetypes/ArchetypeImagesUploader";
import { loadArchetypesFromDb, getAllArchetypeDescriptions } from "@/utils/archetypeDescriptions";
import { ArchetypeDescription } from "@/types/numerology";

const ArchetypeImagesPage = () => {
  const [archetypes, setArchetypes] = useState<ArchetypeDescription[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadArchetypes();
  }, []);
  
  const loadArchetypes = async () => {
    setLoading(true);
    try {
      // Загрузка архетипов из базы данных
      await loadArchetypesFromDb(true);
      
      // Получение всех архетипов
      const allArchetypes = getAllArchetypeDescriptions();
      setArchetypes(allArchetypes);
    } catch (error) {
      console.error("Error loading archetypes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Группируем архетипы по code и value для предпросмотра
  const groupedArchetypes = archetypes.reduce((acc, archetype) => {
    if (!acc[archetype.code]) {
      acc[archetype.code] = {};
    }
    
    acc[archetype.code][archetype.value] = archetype;
    return acc;
  }, {} as Record<string, Record<number, ArchetypeDescription>>);
  
  // Преобразуем в массив для отображения
  const archetypesList = Object.entries(groupedArchetypes).map(([code, values]) => ({
    code,
    values: Object.values(values)
  }));
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <ArchetypesHeader
        title="Загрузка фотографий архетипов"
        description="Загрузите фотографии для каждого архетипа (мужские и женские)"
      />
      
      <div className="grid grid-cols-1 gap-6">
        <ArchetypeImagesUploader 
          archetypes={archetypes}
          onUpload={loadArchetypes}
        />
        
        {archetypesList.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Предпросмотр архетипов</h2>
            
            {archetypesList.map(({ code, values }) => (
              <div key={code} className="space-y-4">
                <h3 className="text-lg font-medium capitalize">{code}</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Мужские архетипы</h4>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {values.map((archetype) => (
                          <CarouselItem key={`male-${archetype.code}-${archetype.value}`} className="md:basis-1/4 lg:basis-1/5">
                            <div className="p-1">
                              <div className="rounded-md overflow-hidden aspect-square bg-muted">
                                {archetype.maleImageUrl ? (
                                  <img 
                                    src={archetype.maleImageUrl} 
                                    alt={`${archetype.code}-${archetype.value}`}
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-muted-foreground">Нет фото</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-center mt-2 text-sm">
                                {archetype.code}-{archetype.value}
                              </p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Женские архетипы</h4>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {values.map((archetype) => (
                          <CarouselItem key={`female-${archetype.code}-${archetype.value}`} className="md:basis-1/4 lg:basis-1/5">
                            <div className="p-1">
                              <div className="rounded-md overflow-hidden aspect-square bg-muted">
                                {archetype.femaleImageUrl ? (
                                  <img 
                                    src={archetype.femaleImageUrl} 
                                    alt={`${archetype.code}-${archetype.value}`}
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-muted-foreground">Нет фото</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-center mt-2 text-sm">
                                {archetype.code}-{archetype.value}
                              </p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchetypeImagesPage;
