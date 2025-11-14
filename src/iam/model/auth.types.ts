// IAM Authentication Types
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

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}
