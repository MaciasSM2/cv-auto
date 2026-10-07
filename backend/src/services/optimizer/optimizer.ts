import { ResumeData, WorkExperience } from '../../types/resume';
import { ACTION_VERBS_TAXONOMY, REMOTE_COLLABORATION_SKILLS } from './actionVerbsCatalog';

export interface OptimizationSuggestion {
  originalBullet: string;
  improvedBullet: string;
  impactFormulaApplied: 'Google XYZ' | 'STAR' | 'Action Verb Boost';
  reason: string;
  variantLabel: string;
}

export interface JobMatchResult {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

const PASSIVE_PATTERNS = [
  /^(responsable de\s+|encargado de\s+|mi rol era\s+|me dedicaba a\s+|tareas incluían\s+|se me asignó\s+)/i,
  /^(ayudé a\s+|colaboré en\s+|asistí en\s+|participé en\s+|apoyé en\s+)/i,
  /^(trabajé en\s+|hacía\s+|manejé\s+|atendía\s+|llevaba a cabo\s+)/i,
  /^(responsible for\s+|duties included\s+|was tasked with\s+)/i,
  /^(helped with\s+|assisted in\s+|worked on\s+|participated in\s+)/i
];

function cleanLeadingPassive(text: string): { cleaned: string; isPassive: boolean } {
  let cleaned = text.trim();
  let isPassive = false;

  for (const pattern of PASSIVE_PATTERNS) {
    if (pattern.test(cleaned)) {
      cleaned = cleaned.replace(pattern, '');
      isPassive = true;
      break;
    }
  }

  // Capitalize first letter of cleaned text
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  }

  return { cleaned: cleaned.trim(), isPassive };
}

function detectLanguage(text: string): 'es' | 'en' {
  const enMatches = text.match(/\b(the|and|for|with|developed|managed|designed|led|team|project|system)\b/gi);
  const esMatches = text.match(/\b(el|la|los|las|de|con|para|diseñé|desarrollé|equipo|proyecto|sistema)\b/gi);
  const enCount = enMatches ? enMatches.length : 0;
  const esCount = esMatches ? esMatches.length : 0;
  return enCount > esCount ? 'en' : 'es';
}

function detectBulletDomain(text: string): 'tech' | 'data' | 'remote_ops' | 'sales_growth' | 'general' {
  const lower = text.toLowerCase();
  if (/(react|node|javascript|typescript|python|api|backend|frontend|código|desarrollo|software|servidor|base de datos|cloud|aws|docker|microservicios|git|bugs|arquitectura|deploy)/i.test(lower)) {
    return 'tech';
  }
  if (/(datos|sql|excel|power bi|dashboard|kpi|analítica|analytics|reportes|métricas|etl|bi)/i.test(lower)) {
    return 'data';
  }
  if (/(ventas|clientes|conversión|leads|ingresos|facturación|negociación|marketing|ventas|sales|revenue)/i.test(lower)) {
    return 'sales_growth';
  }
  if (/(equipo|soporte|tickets|operaciones|procesos|calidad|documentación|coordinación|atención|remoto|slack|jira)/i.test(lower)) {
    return 'remote_ops';
  }
  return 'general';
}

/**
 * Sugiere hasta 3 variantes de alto impacto aplicando fórmulas Google XYZ y STAR
 * completamente heurísticas y locales (cero coste de API).
 */
export function suggestBulletImprovements(bullet: string, roleCategory?: string): OptimizationSuggestion[] {
  const raw = bullet.trim();
  if (!raw || raw.length < 5) return [];

  const { cleaned, isPassive } = cleanLeadingPassive(raw);
  const lang = detectLanguage(raw);
  const domain = (roleCategory as any) || detectBulletDomain(raw);
  const hasNumbers = /\d+/.test(raw);

  const suggestions: OptimizationSuggestion[] = [];

  if (lang === 'es') {
    if (domain === 'tech') {
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Automaticé y optimicé ${cleaned}, logrando una reducción del 35% en tiempos de respuesta y mejorando la estabilidad del sistema.`,
        impactFormulaApplied: 'Google XYZ',
        variantLabel: 'Eficiencia y Rendimiento (Google XYZ)',
        reason: 'Introduce un verbo de acción técnico, métrica de impacto (+35%) y resultado concreto de estabilidad.'
      });
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Diseñé e implementé la arquitectura de ${cleaned}, disminuyendo incidencias en producción en un 40% para el equipo.`,
        impactFormulaApplied: 'STAR',
        variantLabel: 'Arquitectura y Calidad (STAR)',
        reason: 'Sustituye tareas rutinarias por diseño activo y métrica de reducción de fallos (-40%).'
      });
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Lideré el desarrollo y despliegue continuo de ${cleaned}, acelerando el ciclo de entrega de features en 2 semanas.`,
        impactFormulaApplied: 'Google XYZ',
        variantLabel: 'Velocidad de Entrega y Liderazgo',
        reason: 'Enfoca la viñeta en cadencia de entrega de software y liderazgo colaborativo.'
      });
    } else if (domain === 'data') {
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Estructuré modelos analíticos y dashboards interactivos para ${cleaned}, optimizando la toma de decisiones y reduciendo costos operativos en un 20%.`,
        impactFormulaApplied: 'Google XYZ',
        variantLabel: 'Impacto Analítico y Reducción de Costos',
        reason: 'Añade valor de negocio cuantificable y visibilidad de datos para la dirección.'
      });
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Depuré y automaticé los flujos de datos en torno a ${cleaned}, reduciendo el tiempo de procesamiento y reporte de 8 horas a 30 minutos.`,
        impactFormulaApplied: 'STAR',
        variantLabel: 'Automatización y Ahorro de Tiempo',
        reason: 'Contrasta la situación previa con el resultado directo medido en horas ahorradas.'
      });
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Implementé métricas y KPIs clave para auditar ${cleaned}, alcanzando un 98% de precisión en la información analítica generada.`,
        impactFormulaApplied: 'Action Verb Boost',
        variantLabel: 'Calidad y Precisión de Información',
        reason: 'Demuestra rigor y confiabilidad con métrica porcentual de exactitud.'
      });
    } else if (domain === 'sales_growth') {
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Lideré la estrategia comercial enfocada en ${cleaned}, superando el objetivo trimestral en un 25% y generando nuevos ingresos recurrentes.`,
        impactFormulaApplied: 'Google XYZ',
        variantLabel: 'Superación de Metas (+25%)',
        reason: 'Resalta capacidad de generación de ingresos y cumplimiento sobresaliente de cuota.'
      });
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Optimizé el embudo de conversión para ${cleaned}, logrando un incremento del 30% en prospectos calificados y reduciendo el costo por adquisición.`,
        impactFormulaApplied: 'STAR',
        variantLabel: 'Optimización de Conversión',
        reason: 'Demuestra dominio de métricas comerciales clave (CAC, conversión).'
      });
    } else if (domain === 'remote_ops') {
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Estandaricé los flujos de trabajo colaborativos y documentación para ${cleaned}, aumentando la satisfacción del cliente (CSAT) en un 22%.`,
        impactFormulaApplied: 'Google XYZ',
        variantLabel: 'Estandarización y Satisfacción (CSAT)',
        reason: 'Evidencia metodologías claras de trabajo remoto y métrica estandarizada.'
      });
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Gestioné y resolví incidencias complejas vinculadas a ${cleaned}, manteniendo un índice de resolución al primer contacto superior al 95%.`,
        impactFormulaApplied: 'STAR',
        variantLabel: 'Resolución Ágil de Incidencias',
        reason: 'Muestra efectividad en resolución de problemas bajo estándares internacionales.'
      });
    } else {
      // General / Multidisciplinario
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Coordiné y optimicé ${cleaned}, logrando un incremento del 25% en la eficiencia operativa mediante la estandarización de procesos.`,
        impactFormulaApplied: 'Google XYZ',
        variantLabel: 'Eficiencia Operativa (+25%)',
        reason: 'Transforma una tarea genérica en un logro cuantificable según la regla Google XYZ.'
      });
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Diseñé e implementé mejoras continuas en ${cleaned}, reduciendo los tiempos de entrega en un 30% para la organización.`,
        impactFormulaApplied: 'STAR',
        variantLabel: 'Reducción de Tiempos (-30%)',
        reason: 'Presenta el resultado como un ahorro directo de recursos y tiempo.'
      });
      suggestions.push({
        originalBullet: raw,
        improvedBullet: `Lideré la ejecución integral de ${cleaned}, garantizando el cumplimiento del 100% de los estándares de calidad y plazos establecidos.`,
        impactFormulaApplied: 'Action Verb Boost',
        variantLabel: 'Cumplimiento y Calidad (100%)',
        reason: 'Enfatiza compromiso, confiabilidad y liderazgo en la gestión.'
      });
    }
  } else {
    // English suggestions
    suggestions.push({
      originalBullet: raw,
      improvedBullet: `Spearheaded and optimized ${cleaned}, achieving a 25% increase in operational efficiency through process standardization.`,
      impactFormulaApplied: 'Google XYZ',
      variantLabel: 'Operational Efficiency (+25%)',
      reason: 'Replaces passive wording with high-impact action verb and quantifiable output.'
    });
    suggestions.push({
      originalBullet: raw,
      improvedBullet: `Engineered and streamlined workflows for ${cleaned}, reducing delivery cycle times by 30% across the team.`,
      impactFormulaApplied: 'STAR',
      variantLabel: 'Cycle Time Reduction (-30%)',
      reason: 'Highlights engineering mindset and measurable team delivery impact.'
    });
    suggestions.push({
      originalBullet: raw,
      improvedBullet: `Architected and successfully executed ${cleaned}, maintaining a 99% SLA reliability score.`,
      impactFormulaApplied: 'Google XYZ',
      variantLabel: 'SLA Reliability & Quality (99%)',
      reason: 'Focuses on dependable performance and industry-standard metrics.'
    });
  }

  return suggestions;
}

/**
 * Reescritura compatible anterior (1 sola sugerencia)
 */
export function rewriteBulletXYZ(bullet: string): OptimizationSuggestion {
  const suggestions = suggestBulletImprovements(bullet);
  if (suggestions.length > 0) {
    return suggestions[0];
  }
  return {
    originalBullet: bullet,
    improvedBullet: bullet,
    impactFormulaApplied: 'Action Verb Boost',
    variantLabel: 'Estándar',
    reason: 'La viñeta cuenta con redacción aceptable.'
  };
}

/**
 * Generador Heurístico de Perfil Profesional (Summary Builder)
 * Construye un resumen ejecutivo de 3-4 líneas alineado a las normas ATS 2026
 * sin requerir APIs externas de pago.
 */
export function generateProfessionalSummary(
  resume: ResumeData,
  tone: 'tech' | 'executive' | 'creative' | 'general' = 'tech'
): string {
  const title = resume.contact.professionalTitle ||
    (resume.experience[0]?.position) ||
    'Profesional Especializado';

  // Estimar años de experiencia
  let estimatedYears = 3;
  if (resume.experience && resume.experience.length > 0) {
    estimatedYears = Math.min(15, Math.max(2, resume.experience.length * 2));
  }

  // Top skills
  const skills = (resume.skillsList && resume.skillsList.length > 0)
    ? resume.skillsList.slice(0, 4).join(', ')
    : (resume.skillCategories[0]?.skills.slice(0, 4).join(', ') || 'gestión de proyectos, metodologías ágiles y resolución de problemas');

  // Buscar si hay alguna viñeta con números
  let keyAchievement = '';
  for (const exp of resume.experience || []) {
    for (const b of exp.bulletPoints || []) {
      if (/\d+%\s*|\$\d+|\d+\s*usuarios/i.test(b)) {
        keyAchievement = b.replace(/^[•\-\*]\s*/, '').trim();
        break;
      }
    }
    if (keyAchievement) break;
  }

  if (tone === 'tech') {
    return `${title} con más de ${estimatedYears} años de trayectoria en el diseño, desarrollo y despliegue de soluciones tecnológicas de alto impacto. Especializado en ${skills}, con sólida experiencia en entornos de trabajo ágiles y remotos. Enfocado en la optimización de arquitecturas escalables, buenas prácticas de desarrollo y entrega de valor continuo para el usuario final.`;
  }

  if (tone === 'executive') {
    return `${title} con sólida experiencia de más de ${estimatedYears} años liderando iniciativas estratégicas y optimización de operaciones en entornos multidisciplinarios. Experto en ${skills}, con enfoque demostrado en el cumplimiento de indicadores clave de rendimiento (KPIs), liderazgo colaborativo y transformación digital.`;
  }

  if (tone === 'creative') {
    return `${title} dinámico y orientado a resultados con más de ${estimatedYears} años transformando conceptos en experiencias memorables. Dominio integral de ${skills}, combinando pensamiento analítico, diseño centrado en el usuario y metodologías ágiles en equipos remotos.`;
  }

  // General / Predeterminado
  return `${title} con más de ${estimatedYears} años de experiencia comprobada en la ejecución y optimización de proyectos integrales. Especializado en ${skills}, destacándose por su adaptabilidad, resolución de problemas y orientación a resultados medibles que impulsan el crecimiento organizacional.`;
}

/**
 * Comparador semántico contra descripción de empleo de LinkedIn
 */
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

  const COMMON_KEYWORDS = [
    'react', 'node', 'javascript', 'typescript', 'python', 'java', 'sql', 'nosql', 'mongodb',
    'postgresql', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'git', 'agile', 'scrum',
    'liderazgo', 'analytics', 'kpi', 'rest', 'graphql', 'next.js', 'vue', 'angular', 'machine learning',
    'microservicios', 'seguridad', 'testing', 'jest', 'cypress', 'optimización', 'arquitectura',
    'slack', 'jira', 'remoto', 'comunicación asíncrona', 'kanban'
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
