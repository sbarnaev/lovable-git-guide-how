
import React, { useState } from 'react';
import { ArchetypeDescription } from '@/types/numerology';
import { BasicCalculationResults } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { UserRound, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface PartnershipAtlasProps {
  name: string;
  archetypes: ArchetypeDescription[];
  profile: BasicCalculationResults;
}

export const PartnershipAtlas: React.FC<PartnershipAtlasProps> = ({ 
  name, 
  archetypes, 
  profile 
}) => {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  if (!profile || !profile.fullCodes || archetypes.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Атлас профиля: {name.split(' ')[0] || 'Клиент'}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-4 text-muted-foreground">
            Данные для атласа отсутствуют
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { fullCodes } = profile;
  
  // Get short name for display
  const shortName = name.split(' ')[0] || 'Клиент';
  
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
  
  const openImageModal = (imageUrl: string) => {
    if (imageUrl !== '/placeholder.svg') {
      setSelectedImage(imageUrl);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Атлас профиля: {shortName}</CardTitle>
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
        <div className="flex flex-col items-center mb-4">
          <div 
            className="w-32 h-48 relative mb-2 cursor-pointer"
            onClick={() => openImageModal(getImageUrl(fullCodes.personalityCode))}
          >
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
        <div className="grid grid-cols-4 gap-2">
          {/* Connector */}
          <div className="flex flex-col items-center">
            <div 
              className="w-16 h-24 relative mb-1 cursor-pointer"
              onClick={() => openImageModal(getImageUrl(fullCodes.connectorCode))}
            >
              <img 
                src={getImageUrl(fullCodes.connectorCode)} 
                alt={`Архетип коннектора ${fullCodes.connectorCode}`}
                className="w-full h-full object-contain rounded-md border-2 border-numerica"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">{fullCodes.connectorCode}</p>
              <p className="text-xs text-muted-foreground">Коннектор</p>
            </div>
          </div>
          
          {/* Realization */}
          <div className="flex flex-col items-center">
            <div 
              className="w-16 h-24 relative mb-1 cursor-pointer"
              onClick={() => openImageModal(getImageUrl(fullCodes.realizationCode))}
            >
              <img 
                src={getImageUrl(fullCodes.realizationCode)} 
                alt={`Архетип реализации ${fullCodes.realizationCode}`}
                className="w-full h-full object-contain rounded-md border-2 border-numerica"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">{fullCodes.realizationCode}</p>
              <p className="text-xs text-muted-foreground">Реализация</p>
            </div>
          </div>
          
          {/* Generator */}
          <div className="flex flex-col items-center">
            <div 
              className="w-16 h-24 relative mb-1 cursor-pointer"
              onClick={() => openImageModal(getImageUrl(fullCodes.generatorCode))}
            >
              <img 
                src={getImageUrl(fullCodes.generatorCode)} 
                alt={`Архетип генератора ${fullCodes.generatorCode}`}
                className="w-full h-full object-contain rounded-md border-2 border-numerica"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">{fullCodes.generatorCode}</p>
              <p className="text-xs text-muted-foreground">Генератор</p>
            </div>
          </div>
          
          {/* Mission (with opacity) */}
          <div className="flex flex-col items-center">
            <div 
              className="w-16 h-24 relative mb-1 cursor-pointer"
              onClick={() => openImageModal(getImageUrl(fullCodes.missionCode))}
            >
              <img 
                src={getImageUrl(fullCodes.missionCode)} 
                alt={`Архетип миссии ${fullCodes.missionCode}`}
                className="w-full h-full object-contain rounded-md border-2 border-numerica opacity-70"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">{fullCodes.missionCode}</p>
              <p className="text-xs text-muted-foreground">Миссия</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-2xl h-[80vh] flex items-center justify-center p-1">
          <DialogClose className="absolute right-2 top-2 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
            <X className="h-6 w-6" />
            <span className="sr-only">Закрыть</span>
          </DialogClose>
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img 
              src={selectedImage || ''} 
              alt="Увеличенное изображение архетипа" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
