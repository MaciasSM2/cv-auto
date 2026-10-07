import { ResumeData, WorkExperience } from '../../types/resume';

export interface OptimizationSuggestion {
  originalBullet: string;
  improvedBullet: string;
  impactFormulaApplied: 'Google XYZ' | 'STAR' | 'Action Verb Boost';
  reason: string;
}

export interface JobMatchResult {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export function rewriteBulletXYZ(bullet: string): OptimizationSuggestion {
  const clean = bullet.trim();
  
  // Transform common weak patterns
  if (/responsable de|encargado de|responsible for/i.test(clean)) {
    const stripped = clean.replace(/^(responsable de|encargado de|responsible for)\s+/i, '');
    return {
      originalBullet: clean,
      improvedBullet: `Lideré y optimicé ${stripped}, logrando un incremento del 25% en la eficiencia operativa mediante la estandarización de procesos.`,
      impactFormulaApplied: 'Google XYZ',
      reason: 'Se eliminó la frase pasiva de tarea y se añadió un verbo de acción con métrica de resultado (+25%).'
    };
  }

  if (/trabajé en|ayudé a|assisted in|worked on/i.test(clean)) {
    const stripped = clean.replace(/^(trabajé en|ayudé a|assisted in|worked on)\s+/i, '');
    return {
      originalBullet: clean,
      improvedBullet: `Diseñé y colaboré en el desarrollo de ${stripped}, reduciendo los tiempos de entrega en un 30% para el equipo.`,
      impactFormulaApplied: 'STAR',
      reason: 'Sustitución de rol secundario por diseño activo y métrica de reducción de tiempos.'
    };
  }

  // If bullet lacks numbers
  if (!/\d+/.test(clean)) {
    return {
      originalBullet: clean,
      improvedBullet: `${clean.replace(/\.$/, '')}, impactando positivamente en un 20% los indicadores clave de rendimiento (KPIs).`,
      impactFormulaApplied: 'Google XYZ',
      reason: 'Se anexó el componente de medición [Y] para cumplir con la fórmula de impacto de Google.'
    };
  }

  return {
    originalBullet: clean,
    improvedBullet: clean,
    impactFormulaApplied: 'Action Verb Boost',
    reason: 'La viñeta ya cuenta con estructura cuantitativa sólida.'
  };
}

export function analyzeJobMatch(resume: ResumeData, jobDescription: string): JobMatchResult {
  if (!jobDescription || jobDescription.trim().length < 20) {
    return {
      matchPercentage: 0,
      matchedKeywords: [],
      missingKeywords: [],
      recommendations: ['Pega una descripción de puesto completa para calcular la compatibilidad ATS.']
    };
  }

  const jdWords = jobDescription.toLowerCase()
    .replace(/[^\w\sáéíóúüñ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3);

  // Common technical and functional keywords list
  const COMMON_KEYWORDS = [
    'react', 'node', 'javascript', 'typescript', 'python', 'java', 'sql', 'nosql', 'mongodb',
    'postgresql', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'git', 'agile', 'scrum',
    'liderazgo', 'analytics', 'kpi', 'rest', 'graphql', 'next.js', 'vue', 'angular', 'machine learning',
    'microservicios', 'seguridad', 'testing', 'jest', 'cypress', 'optimización', 'arquitectura'
  ];

  const jdKeywords = Array.from(new Set(
    COMMON_KEYWORDS.filter(k => jdWords.includes(k) || jobDescription.toLowerCase().includes(k))
  ));

  const resumeText = JSON.stringify(resume).toLowerCase();
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jdKeywords.forEach(kw => {
    if (resumeText.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const totalEvaluated = jdKeywords.length || 1;
  const matchPercentage = Math.round((matchedKeywords.length / totalEvaluated) * 100);

  const recommendations: string[] = [];
  if (missingKeywords.length > 0) {
    recommendations.push(
      `Incluye las siguientes palabras clave prioritarias de la vacante: ${missingKeywords.slice(0, 5).join(', ')}.`
    );
  }
  if (matchPercentage < 60) {
    recommendations.push(
      'La coincidencia semántica es baja (<60%). Adapta tu Perfil Profesional y Experiencia con la terminología exacta de la vacante.'
    );
  } else {
    recommendations.push(
      'Excelente correspondencia de palabras clave. Tu perfil tiene alta probabilidad de pasar el filtro inicial ATS.'
    );
  }

  return {
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    recommendations
  };
}
