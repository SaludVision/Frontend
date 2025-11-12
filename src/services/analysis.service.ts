/**
 * Analysis Service - Servicio de análisis médicos
 * Maneja toda la lógica relacionada con análisis de imágenes
 */

import { httpClient } from '../lib/http-client';
import { API_CONFIG } from '../config/api.config';
import {
  UploadAnalysisRequest,
  Analysis,
  AnalysisListResponse,
  PaginationParams,
} from '../types/domain.types';

class AnalysisService {
  /**
   * Subir imagen para análisis
   */
  async uploadAnalysis(request: UploadAnalysisRequest): Promise<Analysis> {
    const formData = new FormData();
    formData.append('image', request.image);
    formData.append('analysisType', request.analysisType);
    
    if (request.patientId) {
      formData.append('patientId', request.patientId);
    }
    
    if (request.notes) {
      formData.append('notes', request.notes);
    }

    const response = await httpClient.postFormData<Analysis>(
      API_CONFIG.ANALYSIS_SERVICE.UPLOAD,
      formData
    );

    return response;
  }

  /**
   * Obtener análisis por ID
   */
  async getAnalysisById(id: string): Promise<Analysis> {
    const endpoint = API_CONFIG.ANALYSIS_SERVICE.GET_BY_ID.replace(':id', id);
    const response = await httpClient.get<Analysis>(endpoint);
    return response;
  }

  /**
   * Listar análisis con paginación
   */
  async listAnalyses(params?: PaginationParams): Promise<AnalysisListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const endpoint = `${API_CONFIG.ANALYSIS_SERVICE.LIST}?${queryParams.toString()}`;
    const response = await httpClient.get<AnalysisListResponse>(endpoint);
    
    return response;
  }

  /**
   * Eliminar análisis
   */
  async deleteAnalysis(id: string): Promise<{ success: boolean }> {
    const endpoint = API_CONFIG.ANALYSIS_SERVICE.DELETE.replace(':id', id);
    const response = await httpClient.delete<{ success: boolean }>(endpoint);
    return response;
  }
}

export const analysisService = new AnalysisService();
