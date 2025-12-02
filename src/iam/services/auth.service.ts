import { httpClient } from '../../shared/services/http-client';
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

class AuthService {
  // Iniciar sesión
  async login(request: LoginRequest): Promise<LoginResponse> {
    const backendResponse = await httpClient.post<{ userId: number; mensaje: string }>(
      API_CONFIG.AUTH_SERVICE.LOGIN,
      {
        correo: request.email,
        password: request.password
      }
    );

    // Adaptar respuesta del backend al formato del frontend
    if (backendResponse.userId === 0) {
      throw new Error(backendResponse.mensaje || 'Credenciales incorrectas');
    }

    // Crear respuesta adaptada (sin tokens reales por ahora)
    const response: LoginResponse = {
      user: {
        id: backendResponse.userId.toString(),
        name: '',
        email: request.email,
        dni: '',
        specialty: '',
        professionalId: '',
        hospital: '',
        phone: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      accessToken: `temp-token-${backendResponse.userId}`,
      refreshToken: `temp-refresh-${backendResponse.userId}`,
      expiresIn: 3600
    };

    // Guardar en localStorage
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('userId', backendResponse.userId.toString());
    localStorage.setItem('userProfile', JSON.stringify(response.user));

    return response;
  }

  // Registrar nuevo usuario
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const backendResponse = await httpClient.post<{ response: string }>(
      API_CONFIG.AUTH_SERVICE.REGISTER,
      {
        nombre: request.name,
        correo: request.email,
        password: request.password,
        dni: request.dni,
        especialidad: request.specialty,
        idProfesional: parseInt(request.professionalId) || 0,
        hospital: request.hospital,
        telefonoContacto: request.phone
      }
    );

    console.log('Register response:', backendResponse);

    // Verificar si el registro fue exitoso
    if (backendResponse.response !== 'Registro Exitoso') {
      throw new Error(backendResponse.response || 'Error en el registro');
    }

    // Adaptar respuesta del backend al formato del frontend
    const response: RegisterResponse = {
      user: {
        id: '0',
        name: request.name,
        email: request.email,
        dni: request.dni,
        specialty: request.specialty,
        professionalId: request.professionalId,
        hospital: request.hospital,
        phone: request.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      message: backendResponse.response
    };

    return response;
  }

  // Verificar email
  async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const response = await httpClient.get<{
      success: boolean;
      email: string;
      available: boolean;
      message: string;
    }>(`${API_CONFIG.AUTH_SERVICE.VERIFY_EMAIL}/${encodeURIComponent(request.email)}`);

    return {
      exists: !response.available,
      email: request.email,
    };
  }

 // Restablecer contraseña
  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    try {
      const response = await httpClient.post<{ success: boolean; message: string }>(
        API_CONFIG.AUTH_SERVICE.RESET_PASSWORD,
        {
          email: request.email,
          newPassword: request.newPassword
        }
      );

      return {
        success: response.success,
        message: response.message || 'Contraseña actualizada correctamente'
      };
    } catch (error: any) {
      if (error.status === 404) {
        return {
          success: false,
          message: 'No existe una cuenta asociada a este correo electrónico'
        };
      }
      
      throw error;
    }
  }

  // Renovar tokens
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    throw new Error('La renovación de tokens no está disponible');
  }

 // Cerrar sesión
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

  // Obtener perfil del usuario actual
  getCurrentUser() {
    const userProfile = localStorage.getItem('userProfile');
    return userProfile ? JSON.parse(userProfile) : null;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
