import { useState } from 'react';
import { analysisService } from '../services/analysis.service';
import {
  UploadAnalysisRequest,
  Analysis,
  PaginationParams,
  ApiError,
} from '../types/domain.types';

export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  const uploadAnalysis = async (request: UploadAnalysisRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analysisService.uploadAnalysis(request);
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al subir análisis');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAnalysisById = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analysisService.getAnalysisById(id);
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al obtener análisis');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const listAnalyses = async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analysisService.listAnalyses(params);
      setAnalyses(response.analyses);
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al listar análisis');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analysisService.deleteAnalysis(id);
      // Actualizar lista local
      setAnalyses(prev => prev.filter(a => a.id !== id));
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al eliminar análisis');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadAnalysis,
    getAnalysisById,
    listAnalyses,
    deleteAnalysis,
    analyses,
    loading,
    error,
  };
}
