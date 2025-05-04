
import { useState } from 'react';
import { ArchetypeDescription } from '@/types/numerology';
import { BasicCalculation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { UserRound, Users } from 'lucide-react';

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
  
  // Find image URL by archetype value and gender
  const getImageUrl = (value: number) => {
    // Find any archetype with this value that has the appropriate image URL
    const archsWithValue = archetypes.filter(a => a.value === value);
    
    if (archsWithValue.length === 0) return '/placeholder.svg';
    
    // Find an archetype with the requested gender image
    const archWithImage = archsWithValue.find(
      a => selectedGender === 'male' ? a.maleImageUrl : a.femaleImageUrl
    );
    
    if (archWithImage) {
      return selectedGender === 'male' 
        ? (archWithImage.maleImageUrl || '/placeholder.svg')
        : (archWithImage.femaleImageUrl || '/placeholder.svg');
    }
    
    return '/placeholder.svg';
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
            <UserRound className="h-4 w-4" />
            Муж
          </Button>
          <Button 
            variant={selectedGender === 'female' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedGender('female')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Жен
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Main personality archetype */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-40 h-60 relative mb-2">
            <img 
              src={getImageUrl(fullCodes.personalityCode)} 
              alt={`Архетип личности ${fullCodes.personalityCode}`} 
              className="w-full h-full object-contain rounded-md border-4 border-numerica"
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
            <div className="w-24 h-36 relative mb-2">
              <img 
                src={getImageUrl(fullCodes.connectorCode)} 
                alt={`Архетип коннектора ${fullCodes.connectorCode}`}
                className="w-full h-full object-contain rounded-md border-2 border-numerica"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">{fullCodes.connectorCode}</p>
              <p className="text-xs text-muted-foreground">Архетип коннектора</p>
            </div>
          </div>
          
          {/* Realization */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-36 relative mb-2">
              <img 
                src={getImageUrl(fullCodes.realizationCode)} 
                alt={`Архетип реализации ${fullCodes.realizationCode}`}
                className="w-full h-full object-contain rounded-md border-2 border-numerica"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">{fullCodes.realizationCode}</p>
              <p className="text-xs text-muted-foreground">Архетип реализации</p>
            </div>
          </div>
          
          {/* Generator */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-36 relative mb-2">
              <img 
                src={getImageUrl(fullCodes.generatorCode)} 
                alt={`Архетип генератора ${fullCodes.generatorCode}`}
                className="w-full h-full object-contain rounded-md border-2 border-numerica"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">{fullCodes.generatorCode}</p>
              <p className="text-xs text-muted-foreground">Архетип генератора</p>
            </div>
          </div>
          
          {/* Mission (with opacity) */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-36 relative mb-2">
              <img 
                src={getImageUrl(fullCodes.missionCode)} 
                alt={`Архетип миссии ${fullCodes.missionCode}`}
                className="w-full h-full object-contain rounded-md border-2 border-numerica opacity-70"
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
