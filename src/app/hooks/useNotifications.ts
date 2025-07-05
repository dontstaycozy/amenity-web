import { useState, useEffect, useCallback } from 'react';
import NotificationService, { Notification } from '../lib/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bibleTimeLeft, setBibleTimeLeft] = useState({ hours: 0, minutes: 0, isExpired: false });

  const notificationService = NotificationService.getInstance();

  const updateNotifications = useCallback(() => {
    const updatedNotifications = notificationService.getNotifications();
    const updatedUnreadCount = notificationService.getUnreadCount();
    const updatedBibleTimeLeft = notificationService.getBibleReadingTimeLeft();
    
    setNotifications(updatedNotifications);
    setUnreadCount(updatedUnreadCount);
    setBibleTimeLeft(updatedBibleTimeLeft);
  }, [notificationService]);

  const markAsRead = useCallback((notificationId: string) => {
    notificationService.markAsRead(notificationId);
    updateNotifications();
  }, [notificationService, updateNotifications]);

  const markAllAsRead = useCallback(() => {
    notificationService.markAllAsRead();
    updateNotifications();
  }, [notificationService, updateNotifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    notificationService.addNotification(notification);
    updateNotifications();
  }, [notificationService, updateNotifications]);

  const removeNotification = useCallback((notificationId: string) => {
    notificationService.removeNotification(notificationId);
    updateNotifications();
  }, [notificationService, updateNotifications]);

  // Update notifications every minute to keep Bible reading reminder current
  useEffect(() => {
    updateNotifications();

    const interval = setInterval(() => {
      updateNotifications();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [updateNotifications]);

  return {
    notifications,
    unreadCount,
    bibleTimeLeft,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    updateNotifications
  };
}; 