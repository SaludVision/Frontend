# 🏗️ Guía de Integración con Microservicios

Esta aplicación está preparada siguiendo **Domain-Driven Design (DDD)** y arquitectura de microservicios.

## 📁 Estructura del Proyecto

```
/
├── config/
│   └── api.config.ts          # Configuración de URLs de microservicios
├── types/
│   └── domain.types.ts        # Tipos de dominio (DTOs, Entities)
├── lib/
│   └── http-client.ts         # Cliente HTTP centralizado
├── services/
│   ├── auth.service.ts        # Servicio de autenticación
│   ├── analysis.service.ts    # Servicio de análisis médicos
│   ├── report.service.ts      # Servicio de reportes
│   ├── notification.service.ts # Servicio de notificaciones
│   └── user.service.ts        # Servicio de usuarios
├── hooks/
│   ├── useAuth.ts             # Hook de autenticación
│   └── useAnalysis.ts         # Hook de análisis
└── components/
    └── pages/                 # Páginas y componentes
```

## 🔧 Configuración Inicial

### 1. Configurar URLs de Microservicios

Edita `/config/api.config.ts` y actualiza las URLs:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://tu-api-gateway.com/api',
  // ... resto de endpoints
};
```

O usa variables de entorno:

```bash
REACT_APP_API_GATEWAY_URL=https://tu-api-gateway.com/api
```

### 2. Arquitectura de Microservicios Esperada

La aplicación espera los siguientes microservicios:

#### 🔐 Auth Service
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/verify-email` - Verificar si email existe
- `POST /auth/reset-password` - Restablecer contraseña
- `POST /auth/refresh-token` - Refrescar token
- `POST /auth/logout` - Cerrar sesión

#### 🔬 Analysis Service
- `POST /analysis/upload` - Subir imagen para análisis (FormData)
- `GET /analysis/:id` - Obtener análisis por ID
- `GET /analysis/list` - Listar análisis (con paginación)
- `DELETE /analysis/:id` - Eliminar análisis

#### 📄 Report Service
- `GET /reports/:id` - Obtener reporte por ID
- `GET /reports/list` - Listar reportes (con paginación)
- `GET /reports/:id/download` - Descargar reporte (PDF/archivo)

#### 🔔 Notification Service
- `GET /notifications/list` - Listar notificaciones
- `PUT /notifications/:id/read` - Marcar como leída
- `PUT /notifications/read-all` - Marcar todas como leídas

#### 👤 User Service
- `GET /users/profile` - Obtener perfil
- `PUT /users/profile` - Actualizar perfil

## 📝 Contratos de API (Request/Response)

### Login Request/Response
```typescript
// Request
{
  "email": "doctor@hospital.com",
  "password": "password123",
  "rememberMe": true
}

// Response
{
  "user": {
    "id": "uuid",
    "fullName": "Dr. Juan Pérez",
    "email": "doctor@hospital.com",
    "specialty": "Radiología",
    "medicalLicense": "MP12345",
    "hospital": "Hospital Central",
    "phone": "+1234567890",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

### Upload Analysis Request/Response
```typescript
// Request (FormData)
{
  "image": File,
  "analysisType": "radiografia" | "tomografia" | "resonancia" | "ecografia" | "mamografia",
  "patientId": "uuid" (opcional),
  "notes": "string" (opcional)
}

// Response
{
  "id": "uuid",
  "patientId": "uuid",
  "analysisType": "radiografia",
  "status": "pending" | "processing" | "completed" | "failed",
  "imageUrl": "https://...",
  "result": {
    "diagnosis": "Normal",
    "confidence": 0.95,
    "findings": ["No anomalías detectadas"],
    "recommendations": ["Continuar con chequeos regulares"]
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## 🔑 Autenticación

La aplicación usa **JWT Bearer Tokens**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Los tokens se almacenan en `localStorage`:
- `accessToken` - Token de acceso (corta duración)
- `refreshToken` - Token de refresco (larga duración)
- `userProfile` - Perfil del usuario (cache)

### Refresh Token Flow

Cuando el `accessToken` expira, usar el endpoint de refresh:

```typescript
POST /auth/refresh-token
Body: { "refreshToken": "..." }
```

## 📦 Ejemplo de Uso

### En un Componente

```typescript
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const { login, loading, error } = useAuth();

  const handleSubmit = async (data) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe
      });
      
      // El token ya está guardado automáticamente
      console.log('Usuario logueado:', response.user);
      
      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error:', error);
    }
  };
}
```

### Usando Servicios Directamente

```typescript
import { analysisService } from '../services/analysis.service';

async function uploadImage(file: File, type: string) {
  try {
    const response = await analysisService.uploadAnalysis({
      image: file,
      analysisType: type
    });
    
    console.log('Análisis creado:', response.id);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## 🛡️ Manejo de Errores

Todos los errores siguen el formato `ApiError`:

```typescript
{
  "message": "Mensaje de error legible",
  "code": "ERROR_CODE",
  "status": 400,
  "details": {
    "field": "email",
    "reason": "Email ya existe"
  }
}
```

Los errores comunes:
- `400` - Bad Request (validación fallida)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no existe)
- `408` - Timeout (tiempo de espera agotado)
- `500` - Internal Server Error (error del servidor)

## 🚀 Próximos Pasos

1. **Configurar tu API Gateway** con las URLs correctas en `api.config.ts`
2. **Implementar los endpoints** en tus microservicios siguiendo los contratos
3. **Probar la integración** endpoint por endpoint
4. **Ajustar tipos** si tus contratos difieren ligeramente
5. **Implementar WebSockets** para notificaciones en tiempo real (opcional)

## 📌 Notas Importantes

- ✅ Todos los servicios usan el mismo `httpClient` centralizado
- ✅ Los tokens se manejan automáticamente en cada request
- ✅ Timeout configurado a 30 segundos (ajustable en `api.config.ts`)
- ✅ Los errores se manejan de forma consistente
- ✅ El código sigue principios DDD y SOLID
- ✅ Preparado para escalabilidad

## 🔗 CORS

Asegúrate de que tu API Gateway permita CORS desde el origen de tu frontend:

```
Access-Control-Allow-Origin: https://tu-frontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```
