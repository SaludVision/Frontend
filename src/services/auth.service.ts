/**
 * Auth Service - Servicio de autenticación
 * Maneja toda la lógica relacionada con autenticación
 */

import { httpClient } from '../lib/http-client';
import { API_CONFIG } from '../config/api.config';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../types/domain.types';

class AuthService {
  /**
   * Iniciar sesión
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      API_CONFIG.AUTH_SERVICE.LOGIN,
      request
    );

    // Guardar tokens en localStorage
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userProfile', JSON.stringify(response.user));
    }

    return response;
  }

  /**
   * Registrar nuevo usuario
   */
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await httpClient.post<RegisterResponse>(
      API_CONFIG.AUTH_SERVICE.REGISTER,
      request
    );

    return response;
  }

  /**
   * Verificar si un email existe
   */
  async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const response = await httpClient.post<VerifyEmailResponse>(
      API_CONFIG.AUTH_SERVICE.VERIFY_EMAIL,
      request
    );

    return response;
  }

  /**
   * Restablecer contraseña
   */
  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await httpClient.post<ResetPasswordResponse>(
      API_CONFIG.AUTH_SERVICE.RESET_PASSWORD,
      request
    );

    return response;
  }

  /**
   * Refrescar token de acceso
   */
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await httpClient.post<{ accessToken: string; refreshToken: string }>(
      API_CONFIG.AUTH_SERVICE.REFRESH_TOKEN,
      { refreshToken }
    );

    // Actualizar tokens
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response;
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post(API_CONFIG.AUTH_SERVICE.LOGOUT);
    } finally {
      // Limpiar localStorage incluso si la petición falla
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userProfile');
    }
  }

  /**
   * Obtener perfil del usuario actual desde localStorage
   */
  getCurrentUser() {
    const userProfile = localStorage.getItem('userProfile');
    return userProfile ? JSON.parse(userProfile) : null;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
