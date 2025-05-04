
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

// Note: This is a temporary flag to disable notes
const NOTES_DISABLED = true;

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
      
      {/* Textbook Section */}
      <TextbookSection calculation={calculation} archetypes={archetypes} />
      
      {/* Notes Section - conditionally disabled */}
      {!NOTES_DISABLED && calculation.id && (
        <div className="space-y-4">
          <NoteEditor calculationId={calculation.id} />
        </div>
      )}
    </div>
  );
};
