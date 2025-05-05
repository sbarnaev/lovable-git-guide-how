
import React from 'react';
import { BasicCalculation } from '@/types';
import { ArchetypeDescription } from '@/types/numerology';
import { AIContentSection } from '@/components/AIContentSection';
import { NoteEditor } from '@/components/note-editor';
import { ClientInfo } from '@/components/calculation-result/ClientInfo';
import { ProfileCodes } from '@/components/calculation-result/ProfileCodes';
import { ProfileAtlas } from '@/components/calculation-result/ProfileAtlas';
import { ConsultationSection } from '@/components/calculation-result/ConsultationSection';
import { TextbookSection } from '@/components/calculation-result/TextbookSection';

// Note: We're enabling notes by setting this to false
const NOTES_DISABLED = false;

interface BasicViewProps {
  calculation: (BasicCalculation & { id: string; createdAt: string });
  archetypes: ArchetypeDescription[];
}

export const BasicView: React.FC<BasicViewProps> = ({ calculation, archetypes }) => {
  return (
    <div className="space-y-6">
      {/* Client Information */}
      <ClientInfo calculation={calculation} />
      
      {/* Profile Codes */}
      <ProfileCodes calculation={calculation} />
      
      {/* Profile Atlas */}
      {archetypes.length > 0 && (
        <ProfileAtlas 
          calculation={calculation}
          archetypes={archetypes}
        />
      )}
      
      {/* Summary */}
      {archetypes.length > 0 && calculation.id && (
        <AIContentSection 
          title="Саммари" 
          type="summary"
          archetypes={archetypes}
          calculationId={calculation.id}
        />
      )}
      
      {/* Consultation Section */}
      {archetypes.length > 0 && calculation.id && (
        <ConsultationSection 
          archetypes={archetypes} 
          calculationId={calculation.id} 
        />
      )}
      
      {/* Notes Section - now enabled and placed above the Textbook section */}
      {!NOTES_DISABLED && calculation.id && (
        <div className="space-y-4">
          <NoteEditor calculationId={calculation.id} />
        </div>
      )}
      
      {/* Textbook Section */}
      <TextbookSection calculation={calculation} archetypes={archetypes} />
    </div>
  );
};
