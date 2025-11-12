/**
 * User Service - Servicio de usuarios
 * Maneja toda la lógica relacionada con perfiles de usuario
 */

import { httpClient } from '../lib/http-client';
import { API_CONFIG } from '../config/api.config';
import {
  UserProfile,
  UpdateProfileRequest,
} from '../types/domain.types';

class UserService {
  /**
   * Obtener perfil del usuario actual
   */
  async getProfile(): Promise<UserProfile> {
    const response = await httpClient.get<UserProfile>(
      API_CONFIG.USER_SERVICE.PROFILE
    );
    
    // Actualizar localStorage con los datos más recientes
    localStorage.setItem('userProfile', JSON.stringify(response));
    
    return response;
  }

  /**
   * Actualizar perfil del usuario
   */
  async updateProfile(request: UpdateProfileRequest): Promise<UserProfile> {
    const response = await httpClient.put<UserProfile>(
      API_CONFIG.USER_SERVICE.UPDATE_PROFILE,
      request
    );
    
    // Actualizar localStorage con los datos actualizados
    localStorage.setItem('userProfile', JSON.stringify(response));
    
    return response;
  }
}

export const userService = new UserService();
