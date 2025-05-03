
import { ArchetypeDescription } from "./numerology";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin' | 'consultant';
  avatarUrl?: string;
  createdAt: string;
}

export type CalculationType = 'basic' | 'partnership' | 'target';

export interface BasicCalculationResults {
  numerology: {
    lifePath: number;
    destiny: number;
    personality: number;
  };
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  fullCodes?: {
    personalityCode: number;
    connectorCode: number;
    realizationCode: number;
    generatorCode: number;
    missionCode: number;
  };
  archetypeDescriptions?: ArchetypeDescription[];
}

export interface PartnershipCalculationResults {
  compatibility: {
    overall: number;
    emotional: number;
    intellectual: number;
    physical: number;
  };
  strengths: string[];
  challenges: string[];
  recommendations: string[];
}

export interface TargetCalculationResults {
  analysis: {
    mainFactors: string[];
    currentPhase: string;
    potentialOutcomes: string[];
  };
  recommendations: string[];
  timeframe: string;
}

export type CalculationResults = 
  | BasicCalculationResults
  | PartnershipCalculationResults
  | TargetCalculationResults;

export interface BasicCalculation {
  type: 'basic';
  clientName: string;
  birthDate: string;
  results: BasicCalculationResults;
}

export interface PartnershipCalculation {
  type: 'partnership';
  clientName: string;
  birthDate: string;
  partnerName: string;
  partnerBirthDate: string;
  results: PartnershipCalculationResults;
}

export interface TargetCalculation {
  type: 'target';
  clientName: string;
  birthDate: string;
  targetQuery: string;
  results: TargetCalculationResults;
}

export type CalculationData = 
  | BasicCalculation
  | PartnershipCalculation
  | TargetCalculation;

// Исправлено: тип Calculation теперь корректное объединение типов
export type Calculation = 
  | (BasicCalculation & { id: string; createdAt: string })
  | (PartnershipCalculation & { id: string; createdAt: string })
  | (TargetCalculation & { id: string; createdAt: string });
