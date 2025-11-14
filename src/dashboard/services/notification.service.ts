import { httpClient } from '../../shared/services/http-client';
import { API_CONFIG } from '../../shared/config/api.config';

export type NotificationType = 'success' | 'warning' | 'info' | 'error';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}

class NotificationService {
  // Listar notificaciones del usuario
  async listNotifications(): Promise<NotificationListResponse> {
    const response = await httpClient.get<NotificationListResponse>(
      API_CONFIG.NOTIFICATION_SERVICE.LIST
    );
    return response;
  }

  // Marcar notificación como leída
  async markAsRead(id: string): Promise<Notification> {
    const endpoint = API_CONFIG.NOTIFICATION_SERVICE.MARK_READ.replace(':id', id);
    const response = await httpClient.put<Notification>(endpoint);
    return response;
  }

  // Marcar todas las notificaciones como leídas
  async markAllAsRead(): Promise<{ success: boolean }> {
    const response = await httpClient.put<{ success: boolean }>(
      API_CONFIG.NOTIFICATION_SERVICE.MARK_ALL_READ
    );
    return response;
  }
}

export const notificationService = new NotificationService();
