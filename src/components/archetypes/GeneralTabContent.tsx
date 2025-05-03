
import { useState, useRef, Dispatch, SetStateAction } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image, Edit, Upload, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface GeneralTabContentProps {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  maleImageUrl: string;
  setMaleImageUrl: Dispatch<SetStateAction<string>>;
  femaleImageUrl: string;
  setFemaleImageUrl: Dispatch<SetStateAction<string>>;
}

export const GeneralTabContent = ({
  title,
  setTitle,
  description,
  setDescription,
  maleImageUrl,
  setMaleImageUrl,
  femaleImageUrl,
  setFemaleImageUrl
}: GeneralTabContentProps) => {
  const maleImageInputRef = useRef<HTMLInputElement>(null);
  const femaleImageInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageChange = (type: 'male' | 'female') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      
      if (type === 'male') {
        setMaleImageUrl(imageUrl);
      } else {
        setFemaleImageUrl(imageUrl);
      }
      
      toast.success(`Фотография ${type === 'male' ? 'мужского' : 'женского'} архетипа добавлена`);
    }
  };

  const handleImageDelete = (type: 'male' | 'female') => () => {
    if (type === 'male') {
      setMaleImageUrl("");
    } else {
      setFemaleImageUrl("");
    }
    
    toast.success(`Фотография ${type === 'male' ? 'мужского' : 'женского'} архетипа удалена`);
  };
  
  const renderImageUpload = (type: 'male' | 'female') => {
    const imageUrl = type === 'male' ? maleImageUrl : femaleImageUrl;
    const inputRef = type === 'male' ? maleImageInputRef : femaleImageInputRef;
    
    return (
      <div className="space-y-2">
        <Label>{type === 'male' ? 'Фото мужского архетипа' : 'Фото женского архетипа'}</Label>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={`${type} archetype`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="space-x-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              {imageUrl ? <Edit /> : <Upload />}
              {imageUrl ? 'Изменить' : 'Загрузить'}
            </Button>
            
            {imageUrl && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm"
                onClick={handleImageDelete(type)}
              >
                <Trash2 />
                Удалить
              </Button>
            )}
            
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange(type)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Название архетипа</label>
        <Input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название архетипа"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Описание</label>
        <Textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Введите описание архетипа"
          rows={4}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {renderImageUpload('male')}
        {renderImageUpload('female')}
      </div>
    </div>
  );
};
