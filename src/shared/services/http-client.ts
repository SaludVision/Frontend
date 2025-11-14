import { API_CONFIG, API_TIMEOUT } from '../config/api.config';

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

interface RequestConfig extends RequestInit {
  timeout?: number;
}

class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private async handleError(response: Response): Promise<never> {
    let errorData: any;
    
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    const apiError: ApiError = {
      message: errorData.message || 'Error en la petición',
      code: errorData.code || 'UNKNOWN_ERROR',
      status: response.status,
      details: errorData.details,
    };

    throw apiError;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const text = await response.text();
    
    // Si no hay contenido, devolver un objeto vacío
    if (!text) {
      return {} as T;
    }
    
    // Si el Content-Type indica JSON o el texto parece ser JSON, intentar parsearlo
    if (contentType?.includes('application/json')) {
      try {
        return JSON.parse(text) as T;
      } catch {
        // Si falla el parseo pero el Content-Type es JSON, devolver el texto como mensaje
        return { message: text } as T;
      }
    }
    
    // Si es texto plano, devolverlo como un objeto con el mensaje
    return { message: text } as T;
  }

  private async fetchWithTimeout(
    url: string,
    config: RequestConfig = {}
  ): Promise<Response> {
    const { timeout = API_TIMEOUT, ...fetchConfig } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw {
          message: 'Tiempo de espera agotado',
          code: 'TIMEOUT_ERROR',
          status: 408,
        } as ApiError;
      }
      throw error;
    }
  }

  //GET
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config?.headers,
    };

    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers,
      ...config,
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    return this.parseResponse<T>(response);
  }

  //POST
  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config?.headers,
    };

    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      ...config,
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    return this.parseResponse<T>(response);
  }

  //POST
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    config?: RequestConfig
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config?.headers,
    };
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
      ...config,
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    return this.parseResponse<T>(response);
  }

  //PUT
  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config?.headers,
    };

    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
      ...config,
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    return this.parseResponse<T>(response);
  }

  //DELETE
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config?.headers,
    };

    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
      ...config,
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    return this.parseResponse<T>(response);
  }
}

export const httpClient = new HttpClient(API_CONFIG.BASE_URL);
