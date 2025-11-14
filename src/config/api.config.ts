export const API_CONFIG = {
  // URL base del API Gateway
  BASE_URL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080',
  
  // Endpoints de microservicios me lo dio gpy eso va a cambiar
  AUTH_SERVICE: {
    BASE: '/api/v1',
    LOGIN: '/api/v1/login',
    REGISTER: '/api/v1/register',
    VERIFY_EMAIL: '/api/v1/iam/check-email',
    RESET_PASSWORD: '/api/v1/iam/reset-password',
    REFRESH_TOKEN: '/api/v1/iam/refresh-token',
    LOGOUT: '/api/v1/iam/logout',
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
    PROFILE: '/api/v1/iam/users/profile',
    UPDATE_PROFILE: '/api/v1/iam/users/profile',
  },
};

export const API_TIMEOUT = 30000; // 30 segundos
