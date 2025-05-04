
import { useState } from 'react';
import { ArchetypeDescription } from '@/types/numerology';

export const useArchetypeImages = (archetypes: ArchetypeDescription[]) => {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
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

  const closeImageModal = () => {
    setSelectedImage(null);
  };
  
  return {
    selectedGender,
    setSelectedGender,
    selectedImage,
    getImageUrl,
    openImageModal,
    closeImageModal
  };
};
