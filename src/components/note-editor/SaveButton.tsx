
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onSave: () => void;
  disabled: boolean;
  loading: boolean;
}

export const SaveButton = ({ onSave, disabled, loading }: SaveButtonProps) => {
  return (
    <Button 
      onClick={onSave} 
      disabled={loading || disabled}
      className="flex items-center gap-2"
    >
      <Save size={16} />
      Сохранить заметку
    </Button>
  );
};
