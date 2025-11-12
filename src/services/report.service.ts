/**
 * Report Service - Servicio de reportes
 * Maneja toda la lógica relacionada con reportes médicos
 */

import { httpClient } from '../lib/http-client';
import { API_CONFIG } from '../config/api.config';
import {
  Report,
  ReportListResponse,
  PaginationParams,
} from '../types/domain.types';

class ReportService {
  /**
   * Obtener reporte por ID
   */
  async getReportById(id: string): Promise<Report> {
    const endpoint = API_CONFIG.REPORT_SERVICE.GET_BY_ID.replace(':id', id);
    const response = await httpClient.get<Report>(endpoint);
    return response;
  }

  /**
   * Listar reportes con paginación
   */
  async listReports(params?: PaginationParams): Promise<ReportListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const endpoint = `${API_CONFIG.REPORT_SERVICE.LIST}?${queryParams.toString()}`;
    const response = await httpClient.get<ReportListResponse>(endpoint);
    
    return response;
  }

  /**
   * Descargar reporte
   */
  async downloadReport(id: string): Promise<Blob> {
    const endpoint = API_CONFIG.REPORT_SERVICE.DOWNLOAD.replace(':id', id);
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Error al descargar el reporte');
    }

    return response.blob();
  }
}

export const reportService = new ReportService();
