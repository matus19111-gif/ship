export type ValidationStatus = "valid" | "invalid" | "risky" | "unknown";

export interface EmailValidationResult {
  email: string;
  status: ValidationStatus;
  score: number; // 0–100, higher = more trustworthy
  checks: {
    format: boolean;
    mxRecord: boolean;
    disposable: boolean;
    roleBased: boolean;
    freeProvider: boolean;
  };
  suggestion?: string; // e.g. typo correction "did you mean gmail.com?"
  error?: string;
}

export interface ValidationRecord {
  id: string;
  email: string;
  status: ValidationStatus;
  score: number;
  checks: EmailValidationResult["checks"];
  suggestion: string | null;
  created_at: string;
  user_id: string | null;
}

export interface ValidateEmailRequest {
  email: string;
  userId?: string;
}

export interface BulkValidateEmailRequest {
  emails: string[];
  userId?: string;
}

