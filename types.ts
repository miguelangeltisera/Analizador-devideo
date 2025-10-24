
export interface CriterionEvaluation {
  category: string;
  criterion: string;
  score: number;
  maxScore: number;
  feedback: string;
  level: 'Excelente' | 'Bueno' | 'Satisfactorio' | 'Mejorable' | 'Insuficiente';
}

export interface AnalysisResult {
  evaluations: CriterionEvaluation[];
  finalScore: number;
  finalGrade: 'Excelente (Sobresaliente)' | 'Bueno (Notable)' | 'Satisfactorio (Aprobado)' | 'Mejorable (Recuperación parcial)' | 'Insuficiente (Reprobado)';
  overallFeedback: string;
  recommendations: string;
}
