/**
 * Configuración de URLs de microservicios
 * Actualiza estas URLs con las de tu API Gateway
 */

export const API_CONFIG = {
  // URL base del API Gateway
  BASE_URL: process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8080/api',
  
  // Endpoints de microservicios
  AUTH_SERVICE: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_EMAIL: '/auth/verify-email',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  
  ANALYSIS_SERVICE: {
    BASE: '/analysis',
    UPLOAD: '/analysis/upload',
    GET_BY_ID: '/analysis/:id',
    LIST: '/analysis/list',
    DELETE: '/analysis/:id',
  },
  
  REPORT_SERVICE: {
    BASE: '/reports',
    GET_BY_ID: '/reports/:id',
    LIST: '/reports/list',
    DOWNLOAD: '/reports/:id/download',
  },
  
  NOTIFICATION_SERVICE: {
    BASE: '/notifications',
    LIST: '/notifications/list',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
  },
  
  USER_SERVICE: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
};

export const API_TIMEOUT = 30000; // 30 segundos
