export interface ContactInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  photoUrl?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bulletPoints: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate: string;
  gpa?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ResumeData {
  id?: string;
  contact: ContactInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skillCategories: SkillCategory[];
  skillsList: string[];
  projects?: any[];
  certifications?: any[];
  languages?: any[];
}

export interface DimensionScore {
  score: number;
  weight: number;
  status: "excellent" | "good" | "needs_improvement" | "critical";
  feedback: string[];
  passedChecks: string[];
  warnings: string[];
}

export interface AuditResult {
  overallScore: number;
  rating: "ATS Ready" | "Competitive" | "Needs Optimization" | "At Risk of Rejection";
  dimensions: {
    atsParseability: DimensionScore;
    measurableImpact: DimensionScore;
    keywordRelevance: DimensionScore;
    actionVerbsAndTone: DimensionScore;
    completenessAndStructure: DimensionScore;
  };
  keyFindings: {
    criticalFixes: string[];
    recommendedImprovements: string[];
    strengths: string[];
  };
  metricsCount: number;
  weakVerbsFound: string[];
  missingStandardSections: string[];
  hasAtsBreakingElements: boolean;
}

export type TemplateType = "ats-harvard" | "modern-canva";

export interface OptimizationSuggestion {
  originalBullet: string;
  improvedBullet: string;
  impactFormulaApplied: 'Google XYZ' | 'STAR' | 'Action Verb Boost';
  reason: string;
  variantLabel: string;
}

