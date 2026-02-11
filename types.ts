
export enum AlgorithmStatus {
  SUCCESS = 'SUCCESS',
  SYNTAX_ERROR = 'SYNTAX_ERROR',
  SYSTEM_CRASH = 'SYSTEM_CRASH'
}

export interface EvaluationResult {
  codeAnalysis: string;
  disasterSimulation: string;
  status: AlgorithmStatus;
  challenge: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  type?: 'objective' | 'instructions' | 'system';
  evaluation?: EvaluationResult;
}
