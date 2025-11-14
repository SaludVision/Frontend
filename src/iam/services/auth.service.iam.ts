import { API_CONFIG } from '../../shared/config/api.config';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../model/auth.types';

import {
  adaptLoginRequest,
  adaptRegisterRequest,
  adaptLoginResponse,
  adaptRegisterResponse,
  validateIamResponse,
  extractErrorMessage,
  type IamApiResponse,
  type IamUserResponse,
} from '../adapters/iam.adapter';

// URL base del servicio IAM (sin usar httpClient para mayor control)
const IAM_BASE_URL = `${API_CONFIG.BASE_URL}/v1/iam`;

class AuthServiceIAM {
  // Iniciar sesión
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const iamRequest = adaptLoginRequest(request);

      const response = await fetch(`${IAM_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(iamRequest),
      });

      const data: IamApiResponse<IamUserResponse> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      const loginResponse = adaptLoginResponse(data);

      this.saveAuthData(loginResponse);

      return loginResponse;
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(extractErrorMessage(error));
    }
  }

  // Registrar nuevo usuario
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    try {

      const iamRequest = adaptRegisterRequest(request);

      const response = await fetch(`${IAM_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(iamRequest),
      });

      const data: IamApiResponse<IamUserResponse> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      const registerResponse = adaptRegisterResponse(data, request);

      return registerResponse;
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(extractErrorMessage(error));
    }
  }

  async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    try {
      const response = await fetch(`${IAM_BASE_URL}/check-email/${encodeURIComponent(request.email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: IamApiResponse & { email?: string; available?: boolean } = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al verificar email');
      }

      return {
        exists: !(data.available ?? true),
        email: request.email,
      };
    } catch (error: any) {
      console.error('Error al verificar email:', error);
      throw new Error(extractErrorMessage(error));
    }
  }

  // Restablecer contraseña
  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    console.warn('Reset password no implementado en backend IAM');
    throw new Error('La función de restablecer contraseña no está disponible temporalmente');
  }

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    console.warn('Refresh token no implementado (backend no usa JWT)');
    throw new Error('La renovación de tokens no está disponible');
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {  
      this.clearAuthData();
    } catch (error: any) {
      this.clearAuthData();
      console.error('Error en logout:', error);
    }
  }

  // Obtener perfil del usuario actual
  getCurrentUser() {
    const userProfile = localStorage.getItem('userProfile');
    return userProfile ? JSON.parse(userProfile) : null;
  }

// Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    return true;
  }


  private saveAuthData(loginResponse: LoginResponse): void {
    localStorage.setItem('accessToken', loginResponse.accessToken);
    localStorage.setItem('refreshToken', loginResponse.refreshToken);
    localStorage.setItem('userProfile', JSON.stringify(loginResponse.user));
    
    localStorage.setItem('loginTimestamp', Date.now().toString());
  }

  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('professionalData');
    localStorage.removeItem('loginTimestamp');
  }
}

export const authServiceIAM = new AuthServiceIAM();
