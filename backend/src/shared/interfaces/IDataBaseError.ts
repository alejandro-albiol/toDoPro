export interface IDatabaseError {
    code: string;
    message?: string;
    detail?: string;
    table?: string;
    column?: string;
    constraint?: string;
    metadata?: Record<string, unknown>;
  }