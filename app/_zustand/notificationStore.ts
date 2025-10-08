import { create } from 'zustand';
import { Notification, NotificationFilters, NotificationResponse } from '@/types/notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: NotificationFilters;
  selectedIds: string[];
  
  // Actions
  setNotifications: (response: NotificationResponse) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  deleteNotification: (id: string) => void;
  setFilters: (filters: Partial<NotificationFilters>) => void;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUnreadCount: (count: number) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  total: 0,
  page: 1,
  totalPages: 0,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  selectedIds: [],

  // Actions
  setNotifications: (response: NotificationResponse) => 
    set({
      notifications: response.notifications,
      unreadCount: response.unreadCount,
      total: response.total,
      page: response.page,
      totalPages: response.totalPages,
      loading: false,
      error: null
    }),

  addNotification: (notification: Notification) =>
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
      total: state.total + 1
    })),

  markAsRead: (id: string) =>
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    })),

  markAsUnread: (id: string) =>
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, isRead: false } : n
      ),
      unreadCount: state.unreadCount + 1
    })),

  deleteNotification: (id: string) =>
    set(state => {
      const notification = state.notifications.find(n => n.id === id);
      const wasUnread = notification && !notification.isRead;
      
      return {
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        total: Math.max(0, state.total - 1),
        selectedIds: state.selectedIds.filter(selectedId => selectedId !== id)
      };
    }),

  setFilters: (newFilters: Partial<NotificationFilters>) =>
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      selectedIds: [] // Clear selection when filters change
    })),

  toggleSelection: (id: string) =>
    set(state => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter(selectedId => selectedId !== id)
        : [...state.selectedIds, id]
    })),

  selectAll: () =>
    set(state => ({
      selectedIds: state.notifications.map(n => n.id)
    })),

  clearSelection: () =>
    set({ selectedIds: [] }),

  setLoading: (loading: boolean) =>
    set({ loading }),

  setError: (error: string | null) =>
    set({ error, loading: false }),

  setUnreadCount: (unreadCount: number) =>
    set({ unreadCount }),

  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
      total: 0,
      page: 1,
      totalPages: 0,
      selectedIds: []
    })
}));