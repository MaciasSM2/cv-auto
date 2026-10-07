import { ResumeData, AuditResult, DimensionScore } from '../../types/resume';

const STRONG_ACTION_VERBS = [
  // Spanish strong verbs
  'lideré', 'diseñé', 'implementé', 'optimicé', 'reduje', 'incrementé', 'desarrollé',
  'automaticé', 'dirigí', 'construí', 'gestioné', 'transformé', 'alcancé', 'coordiné',
  'ejecuté', 'resolví', 'negocié', 'escalé', 'supervisé', 'consolidé', 'modernicé',
  'estructuré', 'generé', 'desplegué', 'integré', 'establecí', 'reorganicé',
  // English strong verbs
  'spearheaded', 'engineered', 'architected', 'accelerated', 'optimized', 'reduced',
  'increased', 'scaled', 'automated', 'delivered', 'orchestrated', 'pioneered',
  'transformed', 'championed', 'deployed', 'revamped', 'devised', 'boosted',
  'implemented', 'streamlined', 'generated', 'formulated', 'executed', 'built'
];

const WEAK_PASSIVE_PHRASES = [
  'responsable de', 'encargado de', 'ayudé a', 'trabajé en', 'asistí en',
  'tareas incluían', 'participé en', 'se me asignó',
  'responsible for', 'helped with', 'assisted in', 'duties included', 'worked on'
];

const METRIC_REGEX = /(\b\d+([.,]\d+)?\s*(%|k|m|b|usd|eur|\$|€|millones|horas|hrs|días|semanas|x|veces|usuarios|users|clientes|clients|ventas|sales)\b|\b\d{2,}\b|\$\s*\d+)/i;

export function auditResume(resume: ResumeData): AuditResult {
  const criticalFixes: string[] = [];
  const recommendedImprovements: string[] = [];
  const strengths: string[] = [];
  const weakVerbsFound: string[] = [];
  const missingStandardSections: string[] = [];

  // 1. DIMENSIÓN: Parseabilidad y Cumplimiento ATS (Peso 25%)
  let atsScore = 100;
  const atsPassed: string[] = [];
  const atsWarnings: string[] = [];

  if (!resume.contact.fullName || resume.contact.fullName.trim().length < 3) {
    atsScore -= 20;
    criticalFixes.push('Falta el nombre completo en el encabezado principal.');
  } else {
    atsPassed.push('Nombre profesional claramente identificado.');
  }

  if (!resume.contact.email || !resume.contact.email.includes('@')) {
    atsScore -= 20;
    criticalFixes.push('Correo electrónico no detectado o formato inválido.');
  } else {
    atsPassed.push('Correo electrónico accesible y detectable.');
  }

  if (!resume.contact.phone || resume.contact.phone.trim().length < 7) {
    atsScore -= 10;
    atsWarnings.push('Teléfono de contacto ausente o muy corto.');
  } else {
    atsPassed.push('Teléfono de contacto identificado.');
  }

  if (!resume.contact.location) {
    atsScore -= 10;
    atsWarnings.push('Ubicación geográfica (Ciudad, País) ausente. Importante para filtros de proximidad ATS.');
  } else {
    atsPassed.push('Ubicación general indicada.');
  }

  if (!resume.experience || resume.experience.length === 0) {
    atsScore -= 25;
    missingStandardSections.push('Experiencia Laboral');
    criticalFixes.push('No se encontró sección de Experiencia Laboral estándar.');
  } else {
    atsPassed.push(`Sección de Experiencia estructurada (${resume.experience.length} roles).`);
  }

  if (!resume.education || resume.education.length === 0) {
    atsScore -= 15;
    missingStandardSections.push('Educación');
    criticalFixes.push('No se detectó sección de Educación estándar.');
  } else {
    atsPassed.push('Sección de Educación estándar presente.');
  }

  const atsDimension: DimensionScore = {
    score: Math.max(0, atsScore),
    weight: 0.25,
    status: atsScore >= 85 ? 'excellent' : atsScore >= 70 ? 'good' : atsScore >= 50 ? 'needs_improvement' : 'critical',
    feedback: atsWarnings.concat(atsPassed),
    passedChecks: atsPassed,
    warnings: atsWarnings
  };

  // 2. DIMENSIÓN: Métricas e Impacto Cuantificable (Google XYZ / STAR) (Peso 25%)
  let totalBullets = 0;
  let bulletsWithMetrics = 0;
  const impactPassed: string[] = [];
  const impactWarnings: string[] = [];

  resume.experience.forEach(exp => {
    (exp.bulletPoints || []).forEach(bullet => {
      totalBullets++;
      if (METRIC_REGEX.test(bullet)) {
        bulletsWithMetrics++;
      }
    });
  });

  const metricRatio = totalBullets > 0 ? bulletsWithMetrics / totalBullets : 0;
  let impactScore = Math.round(metricRatio * 100);

  if (totalBullets === 0) {
    impactScore = 20;
    criticalFixes.push('No se detectaron viñetas de logros en la experiencia laboral.');
  } else if (metricRatio >= 0.5) {
    strengths.push(`Excelente enfoque de impacto: ${Math.round(metricRatio * 100)}% de viñetas con resultados cuantificables.`);
    impactPassed.push(`${bulletsWithMetrics} de ${totalBullets} viñetas contienen métricas de impacto (%, $, números).`);
  } else if (metricRatio >= 0.3) {
    recommendedImprovements.push(`Aumenta las métricas cuantificables (actualmente ${Math.round(metricRatio * 100)}%). Meta ideal: >50% según la regla Google XYZ.`);
    impactWarnings.push(`Solo ${bulletsWithMetrics} de ${totalBullets} viñetas tienen datos cuantificables.`);
  } else {
    criticalFixes.push('Tu CV describe tareas pasivas en lugar de resultados. Añade números, porcentajes o ahorros de tiempo.');
    impactWarnings.push(`Baja tasa de métricas (${Math.round(metricRatio * 100)}%). El estándar 2026 exige métricas tangibles.`);
  }

  const impactDimension: DimensionScore = {
    score: Math.min(100, Math.max(0, impactScore)),
    weight: 0.25,
    status: impactScore >= 75 ? 'excellent' : impactScore >= 50 ? 'good' : 'needs_improvement',
    feedback: impactWarnings.concat(impactPassed),
    passedChecks: impactPassed,
    warnings: impactWarnings
  };

  // 3. DIMENSIÓN: Palabras Clave y Habilidades (Peso 20%)
  const totalSkills = (resume.skillsList || []).length;
  let keywordScore = 50;
  const kwPassed: string[] = [];
  const kwWarnings: string[] = [];

  if (totalSkills >= 8) {
    keywordScore = Math.min(100, 70 + (totalSkills - 8) * 3);
    kwPassed.push(`Buen volumen de palabras clave detectadas (${totalSkills} habilidades indexadas).`);
    strengths.push(`Perfil rico en términos técnicos y habilidades (${totalSkills} detectadas).`);
  } else if (totalSkills > 0) {
    keywordScore = 55;
    kwWarnings.push(`Habilidades limitadas (${totalSkills}). Agrega más herramientas específicas, lenguajes o metodologías.`);
    recommendedImprovements.push('Expande la sección de Habilidades para enriquecer la indexación semántica ATS.');
  } else {
    keywordScore = 20;
    criticalFixes.push('Falta una sección explícita de habilidades técnicas/profesionales.');
    kwWarnings.push('Cero palabras clave clasificadas explícitamente.');
  }

  const keywordDimension: DimensionScore = {
    score: Math.min(100, Math.max(0, keywordScore)),
    weight: 0.20,
    status: keywordScore >= 80 ? 'excellent' : keywordScore >= 60 ? 'good' : 'needs_improvement',
    feedback: kwWarnings.concat(kwPassed),
    passedChecks: kwPassed,
    warnings: kwWarnings
  };

  // 4. DIMENSIÓN: Verbos de Acción y Tono Profesional (Peso 15%)
  let strongVerbsCount = 0;
  const verbPassed: string[] = [];
  const verbWarnings: string[] = [];

  resume.experience.forEach(exp => {
    (exp.bulletPoints || []).forEach(b => {
      const lower = b.toLowerCase().trim();
      
      WEAK_PASSIVE_PHRASES.forEach(weak => {
        if (lower.includes(weak) && !weakVerbsFound.includes(weak)) {
          weakVerbsFound.push(weak);
        }
      });

      const firstWord = lower.split(/\s+/)[0];
      if (STRONG_ACTION_VERBS.some(sv => firstWord.includes(sv) || lower.startsWith(sv))) {
        strongVerbsCount++;
      }
    });
  });

  let verbScore = totalBullets > 0 ? Math.round((strongVerbsCount / totalBullets) * 100) : 40;
  if (weakVerbsFound.length > 0) {
    verbScore = Math.max(10, verbScore - (weakVerbsFound.length * 15));
    verbWarnings.push(`Se detectaron frases pasivas débiles: "${weakVerbsFound.join('", "')}". Sustitúyelas por verbos de acción.`);
    recommendedImprovements.push(`Evita frases como "${weakVerbsFound[0]}"; usa verbos de impacto en primera persona (Lideré, Desarrollé, Automaticé).`);
  } else {
    verbPassed.push('No se detectaron frases pasivas genéricas recurrentes.');
  }

  if (strongVerbsCount > 0) {
    verbPassed.push(`${strongVerbsCount} viñetas inician con verbos de acción enérgicos.`);
  }

  const verbDimension: DimensionScore = {
    score: Math.min(100, Math.max(0, verbScore)),
    weight: 0.15,
    status: verbScore >= 75 ? 'excellent' : verbScore >= 50 ? 'good' : 'needs_improvement',
    feedback: verbWarnings.concat(verbPassed),
    passedChecks: verbPassed,
    warnings: verbWarnings
  };

  // 5. DIMENSIÓN: Sintaxis, Resumen y Estructura (Peso 15%)
  let structScore = 80;
  const structPassed: string[] = [];
  const structWarnings: string[] = [];

  if (!resume.summary || resume.summary.trim().length < 50) {
    structScore -= 25;
    structWarnings.push('El Perfil Profesional / Resumen es inexistente o muy breve (<50 caracteres).');
    recommendedImprovements.push('Redacta un Perfil Profesional de 3 a 4 líneas que resuma tu propuesta de valor y años de experiencia.');
  } else if (resume.summary.trim().length > 500) {
    structScore -= 15;
    structWarnings.push('El Perfil Profesional es excesivamente largo. Los reclutadores prefieren 3-4 líneas concisas.');
  } else {
    structScore += 15;
    structPassed.push('Perfil Profesional con longitud ideal (conciso y enfocado).');
  }

  if (resume.contact.linkedin && resume.contact.linkedin.includes('linkedin.com')) {
    structScore += 10;
    structPassed.push('Enlace de LinkedIn incluido para verificación inmediata.');
  } else {
    structWarnings.push('Se recomienda incluir URL directa de LinkedIn para el escaneo de reclutadores.');
  }

  const structDimension: DimensionScore = {
    score: Math.min(100, Math.max(0, structScore)),
    weight: 0.15,
    status: structScore >= 80 ? 'excellent' : structScore >= 60 ? 'good' : 'needs_improvement',
    feedback: structWarnings.concat(structPassed),
    passedChecks: structPassed,
    warnings: structWarnings
  };

  // CÁLCULO DE SCORE GLOBAL PONDERADO (0 - 100)
  const overallScore = Math.round(
    atsDimension.score * atsDimension.weight +
    impactDimension.score * impactDimension.weight +
    keywordDimension.score * keywordDimension.weight +
    verbDimension.score * verbDimension.weight +
    structDimension.score * structDimension.weight
  );

  let rating: AuditResult['rating'] = 'At Risk of Rejection';
  if (overallScore >= 85) rating = 'ATS Ready';
  else if (overallScore >= 70) rating = 'Competitive';
  else if (overallScore >= 50) rating = 'Needs Optimization';

  return {
    overallScore,
    rating,
    dimensions: {
      atsParseability: atsDimension,
      measurableImpact: impactDimension,
      keywordRelevance: keywordDimension,
      actionVerbsAndTone: verbDimension,
      completenessAndStructure: structDimension
    },
    keyFindings: {
      criticalFixes,
      recommendedImprovements,
      strengths
    },
    metricsCount: bulletsWithMetrics,
    weakVerbsFound,
    missingStandardSections,
    hasAtsBreakingElements: criticalFixes.length > 0
  };
}
