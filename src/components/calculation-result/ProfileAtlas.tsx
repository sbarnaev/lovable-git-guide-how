import { useState } from 'react';
import { ArchetypeDescription } from '@/types/numerology';
import { BasicCalculation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { MaleSign, FemaleSign } from 'lucide-react';

interface ProfileAtlasProps {
  calculation: (BasicCalculation & { id: string; createdAt: string }) | undefined;
  archetypes: ArchetypeDescription[];
}

export const ProfileAtlas: React.FC<ProfileAtlasProps> = ({ calculation, archetypes }) => {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  
  if (!calculation || calculation.type !== 'basic' || !calculation.results.fullCodes || archetypes.length === 0) {
    return null;
  }
  
  const { fullCodes } = calculation.results;
  
  // Find archetypes by code and value
  const personalityArchetype = archetypes.find(a => a.code === 'personality' && a.value === fullCodes.personalityCode);
  const connectorArchetype = archetypes.find(a => a.code === 'connector' && a.value === fullCodes.connectorCode);
  const realizationArchetype = archetypes.find(a => a.code === 'realization' && a.value === fullCodes.realizationCode);
  const generatorArchetype = archetypes.find(a => a.code === 'generator' && a.value === fullCodes.generatorCode);
  const missionArchetype = archetypes.find(a => a.code === 'mission' && a.value === fullCodes.missionCode);

  // Get the appropriate image URLs based on gender selection
  const getImageUrl = (archetype: ArchetypeDescription | undefined) => {
    if (!archetype) return '/placeholder.svg';
    
    return selectedGender === 'male' 
      ? (archetype.maleImageUrl || '/placeholder.svg')
      : (archetype.femaleImageUrl || '/placeholder.svg');
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Атлас профиля</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={selectedGender === 'male' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedGender('male')}
            className="flex items-center gap-2"
          >
            <MaleSign className="h-4 w-4" />
            Муж
          </Button>
          <Button 
            variant={selectedGender === 'female' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedGender('female')}
            className="flex items-center gap-2"
          >
            <FemaleSign className="h-4 w-4" />
            Жен
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Main personality archetype */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-40 h-40 relative mb-2">
            <img 
              src={getImageUrl(personalityArchetype)} 
              alt={personalityArchetype?.title || "Архетип личности"} 
              className="w-full h-full object-cover rounded-full border-4 border-numerica"
            />
          </div>
          <div className="text-center">
            <p className="font-semibold">{fullCodes.personalityCode}</p>
            <p className="text-sm text-muted-foreground">Архетип личности</p>
          </div>
        </div>
        
        {/* Other archetypes in a row */}
        <div className="grid grid-cols-4 gap-4">
          {/* Connector */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 relative mb-2">
              <img 
                src={getImageUrl(connectorArchetype)} 
                alt={connectorArchetype?.title || "Архетип коннектора"} 
                className="w-full h-full object-cover rounded-full border-2 border-numerica"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">{fullCodes.connectorCode}</p>
              <p className="text-xs text-muted-foreground">Архетип коннектора</p>
            </div>
          </div>
          
          {/* Realization */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 relative mb-2">
              <img 
                src={getImageUrl(realizationArchetype)} 
                alt={realizationArchetype?.title || "Архетип реализации"} 
                className="w-full h-full object-cover rounded-full border-2 border-numerica"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">{fullCodes.realizationCode}</p>
              <p className="text-xs text-muted-foreground">Архетип реализации</p>
            </div>
          </div>
          
          {/* Generator */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 relative mb-2">
              <img 
                src={getImageUrl(generatorArchetype)} 
                alt={generatorArchetype?.title || "Архетип генератора"} 
                className="w-full h-full object-cover rounded-full border-2 border-numerica"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">{fullCodes.generatorCode}</p>
              <p className="text-xs text-muted-foreground">Архетип генератора</p>
            </div>
          </div>
          
          {/* Mission (with opacity) */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 relative mb-2">
              <img 
                src={getImageUrl(missionArchetype)} 
                alt={missionArchetype?.title || "Архетип миссии"} 
                className="w-full h-full object-cover rounded-full border-2 border-numerica opacity-70"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">{fullCodes.missionCode}</p>
              <p className="text-xs text-muted-foreground">Архетип миссии</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
