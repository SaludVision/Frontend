
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  dni: string;
  specialty: string;
  professionalId: string;
  hospital: string;
  phone: string;
}

export interface RegisterResponse {
  user: UserProfile;
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyEmailResponse {
  exists: boolean;
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dni: string;
  specialty: string;
  professionalId: string;
  hospital: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  dni?: string;
  specialty?: string;
  hospital?: string;
  phone?: string;
}


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

export type NotificationType = 'success' | 'warning' | 'info' | 'error';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
