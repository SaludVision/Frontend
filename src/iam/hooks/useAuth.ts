import { useState } from 'react';
import { authService } from '../services/auth.service';
import {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ResetPasswordRequest,
  ApiError,
} from '../model/auth.types';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (request: LoginRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(request);
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (request: RegisterRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(request);
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (request: VerifyEmailRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.verifyEmail(request);
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al verificar email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (request: ResetPasswordRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.resetPassword(request);
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al restablecer contraseña');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.logout();
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cerrar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    verifyEmail,
    resetPassword,
    logout,
    loading,
    error,
    isAuthenticated: authService.isAuthenticated(),
    currentUser: authService.getCurrentUser(),
  };
}
