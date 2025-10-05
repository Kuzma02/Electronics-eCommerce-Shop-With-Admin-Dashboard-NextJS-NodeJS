export enum NotificationType {
  ORDER_UPDATE = 'ORDER_UPDATE',
  PAYMENT_STATUS = 'PAYMENT_STATUS', 
  PROMOTION = 'PROMOTION',
  SYSTEM_ALERT = 'SYSTEM_ALERT'
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  priority: NotificationPriority;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCreateInput {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  metadata?: any;
}

export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  totalPages: number;
  unreadCount: number;
}

export interface BulkActionPayload {
  notificationIds: string[];
}