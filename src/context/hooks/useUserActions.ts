
import { useState, useCallback } from 'react';
import { UserProfileSummary, NotificationSummary } from '../types';
import { defaultUser, defaultNotifications } from '../utils/defaults';
import { useToast } from '@/components/ui/use-toast';

export const useUserActions = () => {
  const [user, setUser] = useState<UserProfileSummary>(defaultUser);
  const [notifications, setNotifications] = useState<NotificationSummary>(defaultNotifications);
  const { toast } = useToast();

  const login = useCallback((userData: UserProfileSummary) => {
    setUser({ ...userData, isLoggedIn: true });
    toast({
      title: "Đăng nhập thành công",
      description: `Chào mừng ${userData.name || 'quý khách'} đã quay trở lại.`,
    });
  }, [toast]);

  const logout = useCallback(() => {
    setUser(defaultUser);
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi tài khoản.",
    });
  }, [toast]);

  const setNotificationCount = useCallback((count: number) => {
    setNotifications(prev => ({ ...prev, unreadCount: count }));
  }, []);

  return {
    user,
    notifications,
    login,
    logout,
    setNotificationCount
  };
};
