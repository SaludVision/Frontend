import { httpClient } from '../../shared/services/http-client';
import { API_CONFIG } from '../../shared/config/api.config';
import { UserProfile } from '../../iam/model/auth.types';

export interface UpdateProfileRequest {
  name?: string;
  dni?: string;
  specialty?: string;
  hospital?: string;
  phone?: string;
}

class UserService {
  // Obtener perfil del usuario
  async getProfile(): Promise<UserProfile> {
    const response = await httpClient.get<UserProfile>(
      API_CONFIG.USER_SERVICE.PROFILE
    );
    
    // Actualizar localStorage con los datos más recientes
    localStorage.setItem('userProfile', JSON.stringify(response));
    
    return response;
  }

  // Actualizar perfil del usuario
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
