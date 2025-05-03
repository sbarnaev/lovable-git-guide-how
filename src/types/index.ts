
import { NumerologyResult } from './numerology';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'consultant';
}

export interface Calculation {
  id: string;
  type: 'basic' | 'partnership' | 'target';
  createdAt: string;
  clientName: string;
  birthDate: string;
  partnerName?: string;
  partnerBirthDate?: string;
  targetQuery?: string;
  results: any; // Will be updated with specific calculation results
  numerologyResults?: NumerologyResult;
}
