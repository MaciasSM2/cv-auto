/**
 * Canonical Contract for embedding CV-AUTO into any parent platform (ATS, Job Board, HR Tech).
 */
import { ResumeData, AuditResult } from '../types/resume';

export interface CvModuleInput {
  candidateId?: string;
  initialFullName?: string;
  initialEmail?: string;
  initialPhone?: string;
  targetRole?: string;
  theme?: 'dark' | 'light';
  readOnly?: boolean;
}

export interface CandidateDatabasePayload {
  candidateId?: string;
  exportedAt: string;
  candidate: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string | null;
    github: string | null;
    professionalTitle: string;
    hasPhoto: boolean;
  };
  profileSummary: string;
  atsEvaluation: {
    overallScore: number;
    rating: string;
    passedAtsChecks: number;
    criticalFixesRemaining: number;
    metricsRatio: number;
    hasBreakingElements: boolean;
  };
  workHistory: Array<{
    company: string;
    role: string;
    duration: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    graduationYear: string;
  }>;
  skills: {
    flatList: string[];
    categories: any[];
  };
}

export interface CvModuleOutput {
  status: 'completed' | 'in_progress';
  resume: ResumeData;
  audit: AuditResult;
  candidatePayload: CandidateDatabasePayload;
}

export const CV_MODULE_EVENT_TYPE = 'CV_AUTO_MODULE_COMPLETE';

/**
 * Utility for parent application to listen to messages if embedded via iframe.
 */
export function subscribeToCvModuleEvents(
  callback: (output: CvModuleOutput) => void,
  targetOrigin: string = '*'
): () => void {
  const handler = (event: MessageEvent) => {
    if (targetOrigin !== '*' && event.origin !== targetOrigin) return;
    if (event.data && event.data.type === CV_MODULE_EVENT_TYPE) {
      callback(event.data.payload);
    }
  };

  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}

/**
 * Dispatches completion event to the parent window if inside an iframe.
 */
export function notifyParentApp(output: CvModuleOutput, targetOrigin: string = '*'): void {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(
      {
        type: CV_MODULE_EVENT_TYPE,
        payload: output
      },
      targetOrigin
    );
  }
}
