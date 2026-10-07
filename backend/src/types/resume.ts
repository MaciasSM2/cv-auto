/**
 * Canonical Schema for CV-AUTO
 * Standard data structure used across Parser, AI Engine, Audit Engine, and PDF Templates.
 */

export interface ContactInfo {
  fullName: string;
  professionalTitle: string; // e.g. "Senior Full-Stack Engineer"
  email: string;
  phone: string;
  location: string; // City, Country (no street address for privacy & ATS)
  linkedin?: string;
  github?: string;
  portfolio?: string;
  photoUrl?: string; // Base64 data URL for photo in Canva template
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string; // Format: "YYYY-MM" or "Month YYYY"
  endDate: string; // "YYYY-MM", "Present", or "Actual"
  isCurrent: boolean;
  bulletPoints: string[]; // Accomplishments using Google XYZ formula
  metricsDetected?: string[]; // Quantified metrics detected (e.g., "$50k", "35%", "10x")
  actionVerbsDetected?: string[]; // Strong action verbs used
}

export interface Education {
  id: string;
  institution: string;
  degree: string; // e.g. "B.S. in Computer Science"
  fieldOfStudy?: string;
  startDate?: string;
  endDate: string; // Graduation year/month
  gpa?: string; // Optional (only if > 3.5 / 4.0 or relevant)
  honors?: string[];
}

export interface SkillCategory {
  category: string; // e.g., "Languages & Frameworks", "DevOps & Cloud", "Tools"
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  technologies: string[];
  link?: string;
  bulletPoints: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface Language {
  language: string;
  proficiency: "Native" | "Bilingual" | "Professional" | "Intermediate" | "Basic";
}

export interface ResumeData {
  id?: string;
  contact: ContactInfo;
  summary: string; // Professional summary / hook (2-4 lines)
  experience: WorkExperience[];
  education: Education[];
  skillCategories: SkillCategory[];
  skillsList: string[]; // Flat list of all keywords for ATS indexing
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  targetJobTitle?: string;
  targetJobDescription?: string;
}

export interface DimensionScore {
  score: number; // 0 - 100
  weight: number; // e.g. 0.25
  status: "excellent" | "good" | "needs_improvement" | "critical";
  feedback: string[];
  passedChecks: string[];
  warnings: string[];
}

export interface AuditResult {
  overallScore: number; // 0 - 100
  rating: "ATS Ready" | "Competitive" | "Needs Optimization" | "At Risk of Rejection";
  dimensions: {
    atsParseability: DimensionScore; // 25%
    measurableImpact: DimensionScore; // 25%
    keywordRelevance: DimensionScore; // 20%
    actionVerbsAndTone: DimensionScore; // 15%
    completenessAndStructure: DimensionScore; // 15%
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

export type TemplateType = "ats-harvard" | "modern-canva" | "tech-minimal";
