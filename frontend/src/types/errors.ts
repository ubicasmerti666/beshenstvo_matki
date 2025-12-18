export interface ApiError {
    detail?: string;
    message?: string;
    errors?: Record<string, string[]>;
    status?: number;
  }
  
  export class AppError extends Error {
    status: number;
    details?: string;
  
    constructor(message: string, status: number = 500, details?: string) {
      super(message);
      this.name = 'AppError';
      this.status = status;
      this.details = details;
    }
  }