/**
 * Domain Types - Modelos de dominio según DDD
 */

// ============================================
// AUTH DOMAIN
// ============================================

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
  fullName: string;
  email: string;
  password: string;
  specialty: string;
  medicalLicense: string;
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

// ============================================
// USER DOMAIN
// ============================================

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  specialty: string;
  medicalLicense: string;
  hospital: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  specialty?: string;
  hospital?: string;
  phone?: string;
}

// ============================================
// ANALYSIS DOMAIN
// ============================================

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

// ============================================
// REPORT DOMAIN
// ============================================

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

// ============================================
// NOTIFICATION DOMAIN
// ============================================

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

// ============================================
// COMMON
// ============================================

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
