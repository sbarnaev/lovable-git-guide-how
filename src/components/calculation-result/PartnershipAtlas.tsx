
import React from 'react';
import { ArchetypeDescription } from '@/types/numerology';
import { BasicCalculationResults } from '@/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useArchetypeImages } from './partnership-atlas/useArchetypeImages';
import { GenderToggle } from './partnership-atlas/GenderToggle';
import { ArchetypeDisplay } from './partnership-atlas/ArchetypeDisplay';
import { SecondaryArchetypes } from './partnership-atlas/SecondaryArchetypes';
import { ImageModal } from './partnership-atlas/ImageModal';

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
  // Use the custom hook for image handling logic
  const {
    selectedGender,
    setSelectedGender,
    selectedImage,
    getImageUrl,
    openImageModal,
    closeImageModal
  } = useArchetypeImages(archetypes);
  
  // Check that profile exists first
  if (!profile || !profile.fullCodes) {
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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Атлас профиля: {shortName}</CardTitle>
        <GenderToggle 
          selectedGender={selectedGender} 
          onGenderChange={setSelectedGender} 
        />
      </CardHeader>
      <CardContent className="p-6">
        {/* Main personality archetype */}
        <ArchetypeDisplay
          code={fullCodes.personalityCode}
          label="Архетип личности"
          imageUrl={getImageUrl(fullCodes.personalityCode)}
          size="large"
          onImageClick={openImageModal}
        />
        
        {/* Secondary archetypes */}
        <SecondaryArchetypes
          codes={fullCodes}
          getImageUrl={getImageUrl}
          onImageClick={openImageModal}
        />
      </CardContent>
      
      {/* Image Preview Dialog */}
      <ImageModal 
        isOpen={!!selectedImage}
        imageUrl={selectedImage}
        onClose={closeImageModal}
      />
    </Card>
  );
};
