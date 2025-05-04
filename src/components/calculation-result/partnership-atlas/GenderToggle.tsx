
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRound, Users } from 'lucide-react';

interface GenderToggleProps {
  selectedGender: 'male' | 'female';
  onGenderChange: (gender: 'male' | 'female') => void;
}

export const GenderToggle: React.FC<GenderToggleProps> = ({ selectedGender, onGenderChange }) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant={selectedGender === 'male' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onGenderChange('male')}
        className="flex items-center gap-2"
      >
        <UserRound className="h-4 w-4" />
        Муж
      </Button>
      <Button 
        variant={selectedGender === 'female' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onGenderChange('female')}
        className="flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        Жен
      </Button>
    </div>
  );
};
