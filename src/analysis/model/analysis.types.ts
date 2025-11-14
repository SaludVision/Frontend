// Analysis Types
export type AnalysisType = 
  | 'radiografia' 
  | 'tomografia' 
  | 'resonancia' 
  | 'ecografia' 
  | 'mamografia';

export type AnalysisStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed';

export interface UploadAnalysisRequest {
  image: File;
  analysisType: AnalysisType;
  patientId?: string;
  notes?: string;
}

export interface Analysis {
  id: string;
  patientId: string;
  analysisType: AnalysisType;
  status: AnalysisStatus;
  imageUrl: string;
  result?: AnalysisResult;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisResult {
  diagnosis: string;
  confidence: number;
  findings: string[];
  recommendations: string[];
}

export interface AnalysisListResponse {
  analyses: Analysis[];
  total: number;
  page: number;
  pageSize: number;
}

// Report Types
export interface Report {
  id: string;
  analysisId: string;
  patientId: string;
  analysisType: string;
  result: string;
  status: 'success' | 'warning' | 'error';
  generatedAt: string;
  downloadUrl?: string;
}

export interface ReportListResponse {
  reports: Report[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}
