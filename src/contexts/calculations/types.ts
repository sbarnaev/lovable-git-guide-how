
import { Calculation, BasicCalculation, PartnershipCalculation, TargetCalculation } from '@/types';

export interface CalculationContextProps {
  calculations: Calculation[];
  loading: boolean;
  addCalculation: (calculation: BasicCalculation | PartnershipCalculation | TargetCalculation) => Promise<Calculation>;
  getCalculation: (id: string) => Calculation | undefined;
  saveCalculations: (calculationsToSave: Calculation[]) => Promise<void>;
  deleteCalculation: (id: string) => Promise<void>;
  saveNote: (calculationId: string, content: string) => Promise<{ id: string } | undefined>;
  getNote: (calculationId: string) => Promise<{ id: string; content: string } | undefined>;
  updateNote: (noteId: string, content: string) => Promise<{ id: string } | undefined>;
}

export interface NoteData {
  id: string;
  content: string;
  calculation_id?: string;
}
