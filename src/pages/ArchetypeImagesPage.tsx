
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

  // Группируем архетипы по значению (1-9)
  const groupedByValue = archetypes.reduce((acc, archetype) => {
    if (!acc[archetype.value]) {
      acc[archetype.value] = [];
    }
    
    acc[archetype.value].push(archetype);
    return acc;
  }, {} as Record<number, ArchetypeDescription[]>);
  
  // Преобразуем в массив для отображения
  const archetypesByValue = Object.entries(groupedByValue).map(([value, archs]) => ({
    value: parseInt(value),
    archetypes: archs
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
        
        {archetypesByValue.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Предпросмотр архетипов</h2>
            
            {archetypesByValue.sort((a, b) => a.value - b.value).map(({ value, archetypes }) => (
              <div key={value} className="space-y-4">
                <h3 className="text-lg font-medium">Архетип {value}</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Мужской архетип</h4>
                    <div className="rounded-md overflow-hidden aspect-[3/4] w-48 bg-muted">
                      {archetypes.some(a => a.maleImageUrl) ? (
                        <img 
                          src={archetypes.find(a => a.maleImageUrl)?.maleImageUrl} 
                          alt={`Мужской архетип ${value}`}
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground">Нет фото</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Женский архетип</h4>
                    <div className="rounded-md overflow-hidden aspect-[3/4] w-48 bg-muted">
                      {archetypes.some(a => a.femaleImageUrl) ? (
                        <img 
                          src={archetypes.find(a => a.femaleImageUrl)?.femaleImageUrl} 
                          alt={`Женский архетип ${value}`}
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground">Нет фото</span>
                        </div>
                      )}
                    </div>
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
