import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserProfile,
} from '../model/auth.types';

export interface IamLoginRequest {
  username: string;
  password: string;
}

export interface IamRegisterRequest {
  usernameDto: string;
  passwordDto: string;
  nameDto: string;
  emailDto: string;
  phoneDto: string;
  roleDto: string;
}

export interface IamUserResponse {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface IamApiResponse<T = any> {
  success: boolean;
  message: string;
  user?: T;
  error?: string;
}

export function adaptLoginRequest(request: LoginRequest): IamLoginRequest {
  return {
    username: request.email, 
    password: request.password,
  };
}

export function adaptRegisterRequest(request: RegisterRequest): IamRegisterRequest {
  return {
    usernameDto: request.email, 
    passwordDto: request.password,
    nameDto: request.name,
    emailDto: request.email,
    phoneDto: request.phone,
    roleDto: 'DOCTOR', 
  };
}

export function adaptUserProfile(
  iamUser: IamUserResponse,
  professionalData?: Partial<UserProfile>
): UserProfile {
  const savedProfile = localStorage.getItem('professionalData');
  const savedData = savedProfile ? JSON.parse(savedProfile) : {};

  return {
    id: iamUser.id.toString(), // Convertir long → string
    name: iamUser.name,
    email: iamUser.email,
    phone: iamUser.phone,
    dni: professionalData?.dni || savedData.dni || '',
    specialty: professionalData?.specialty || savedData.specialty || '',
    professionalId: professionalData?.professionalId || savedData.professionalId || '',
    hospital: professionalData?.hospital || savedData.hospital || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function adaptLoginResponse(
  iamResponse: IamApiResponse<IamUserResponse>
): LoginResponse {
  if (!iamResponse.success || !iamResponse.user) {
    throw new Error(iamResponse.message || 'Error en login');
  }

  const userProfile = adaptUserProfile(iamResponse.user);

  const accessToken = generateFakeToken('access', iamResponse.user.id);
  const refreshToken = generateFakeToken('refresh', iamResponse.user.id);

  return {
    user: userProfile,
    accessToken,
    refreshToken,
    expiresIn: 3600,
  };
}

export function adaptRegisterResponse(
  iamResponse: IamApiResponse<IamUserResponse>,
  originalRequest: RegisterRequest
): RegisterResponse {
  if (!iamResponse.success || !iamResponse.user) {
    throw new Error(iamResponse.message || 'Error en registro');
  }

  const professionalData = {
    dni: originalRequest.dni,
    specialty: originalRequest.specialty,
    professionalId: originalRequest.professionalId,
    hospital: originalRequest.hospital,
  };
  localStorage.setItem('professionalData', JSON.stringify(professionalData));

  const userProfile = adaptUserProfile(iamResponse.user, professionalData);

  return {
    user: userProfile,
    message: iamResponse.message || 'Usuario registrado exitosamente',
  };
}

function generateFakeToken(type: 'access' | 'refresh', userId: number): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const payload = btoa(JSON.stringify({
    userId,
    type,
    timestamp,
    warning: 'This is a fake token for development only',
  }));
  
  return `fake-${type}-${userId}-${timestamp}-${random}.${payload}`;
}


export function validateFakeToken(token: string): boolean {
  if (!token) return false;
  
  if (!token.startsWith('fake-')) return false;
  
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  
  try {
    const payload = JSON.parse(atob(parts[1]));
    
    if (!payload.userId || !payload.type || !payload.timestamp) {
      return false;
    }
    
    const now = Date.now();
    const tokenAge = now - payload.timestamp;
    const ONE_HOUR = 60 * 60 * 1000;
    
    return tokenAge < ONE_HOUR;
  } catch {
    return false;
  }
}

export function decodeFakeToken(token: string): any {
  if (!validateFakeToken(token)) {
    return null;
  }
  
  try {
    const parts = token.split('.');
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

export function validateIamResponse(response: IamApiResponse): void {
  if (!response.success) {
    throw new Error(response.message || response.error || 'Error desconocido');
  }
}

export function extractErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Error desconocido en el servidor';
}
