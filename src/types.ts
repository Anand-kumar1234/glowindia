export interface UserSession {
  id: string;
  name: string;
  email: string;
  picture?: string;
  age?: number;
  concern?: string;
  paymentVerified: boolean;
  utr?: string;
  scansRemaining?: number;
}

export interface SkincareStep {
  step1: string;
  step2: string;
  step3: string;
}

export interface SkincareRoutine {
  morning: SkincareStep;
  evening: SkincareStep;
}

export interface SkinScores {
  hydration: number;
  clarity: number;
  smoothness: number;
  barrier: number;
}

export interface AnalysisResult {
  skin_type: string;
  primary_concerns: string[];
  skin_health_summary: string;
  routine: SkincareRoutine;
  skin_scores: SkinScores;
  isFallback?: boolean;
}

export interface ServerAnalysisResponse {
  success: boolean;
  analysis: AnalysisResult;
}

export interface ServerSessionResponse {
  authenticated: boolean;
  user: UserSession | null;
}
