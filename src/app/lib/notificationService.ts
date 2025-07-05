// Notification service for handling dynamic notifications
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'flag' | 'bible_reminder' | 'streak' | 'trending' | 'deleted';
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

export class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];

  private constructor() {
    this.initializeNotifications();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initializeNotifications() {
    // Initialize with default notifications
    this.notifications = [
      {
        id: '1',
        type: 'like',
        title: 'New Activity',
        message: 'New likes/comments on your posts',
        icon: 'Like',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false
      },
      {
        id: '2',
        type: 'flag',
        title: 'Admin Action',
        message: 'Your post has been flagged by admin',
        icon: 'Fire',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: false
      },
      {
        id: '3',
        type: 'bible_reminder',
        title: 'Daily Reading Reminder',
        message: this.getBibleReadingReminderMessage(),
        icon: 'Bible',
        timestamp: new Date(),
        isRead: false,
        actionUrl: '/biblePage?view=daily'
      },
      {
        id: '4',
        type: 'streak',
        title: 'Reading Streak',
        message: 'Reading Streak milestones',
        icon: 'SaveChapIcon',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        isRead: false
      },
      {
        id: '5',
        type: 'trending',
        title: 'Trending',
        message: 'Popular posts trending',
        icon: 'Fire',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        isRead: false
      },
      {
        id: '6',
        type: 'deleted',
        title: 'Post Removed',
        message: 'Post deleted by admin',
        icon: 'Delete',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        isRead: false
      }
    ];
  }

  private getBibleReadingReminderMessage(): string {
    const now = dayjs().tz('Asia/Manila');
    const endOfDay = now.endOf('day');
    const timeLeft = endOfDay.diff(now, 'hour', true);
    
    if (timeLeft <= 0) {
      return 'Daily reading period has ended. Start tomorrow\'s reading!';
    } else if (timeLeft < 1) {
      const minutesLeft = Math.floor(endOfDay.diff(now, 'minute'));
      return `Only ${minutesLeft} minutes left for today's reading!`;
    } else {
      const hoursLeft = Math.floor(timeLeft);
      const minutesLeft = Math.floor((timeLeft - hoursLeft) * 60);
      if (minutesLeft > 0) {
        return `${hoursLeft}h ${minutesLeft}m remaining for today's reading`;
      } else {
        return `${hoursLeft} hours remaining for today's reading`;
      }
    }
  }

  public getNotifications(): Notification[] {
    // Update the Bible reading reminder message
    const bibleReminder = this.notifications.find(n => n.type === 'bible_reminder');
    if (bibleReminder) {
      bibleReminder.message = this.getBibleReadingReminderMessage();
      bibleReminder.timestamp = new Date();
    }
    
    return this.notifications;
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  public markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  public markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
  }

  public addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    this.notifications.unshift(newNotification);
    
    // Keep only the latest 20 notifications
    if (this.notifications.length > 20) {
      this.notifications = this.notifications.slice(0, 20);
    }
  }

  public removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  public getBibleReadingTimeLeft(): { hours: number; minutes: number; isExpired: boolean } {
    const now = dayjs().tz('Asia/Manila');
    const endOfDay = now.endOf('day');
    const timeLeft = endOfDay.diff(now, 'hour', true);
    
    if (timeLeft <= 0) {
      return { hours: 0, minutes: 0, isExpired: true };
    }
    
    const hours = Math.floor(timeLeft);
    const minutes = Math.floor((timeLeft - hours) * 60);
    
    return { hours, minutes, isExpired: false };
  }
}

export default NotificationService; 