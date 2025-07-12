
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, MessageSquare, ThumbsUp, UserPlus, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      markAsRead();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          questions(title),
          answers(content),
          profiles:sender_id(username)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'answer':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'vote':
        return <ThumbsUp className="h-5 w-5 text-green-600" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-purple-600" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationMessage = (notification: any) => {
    switch (notification.type) {
      case 'answer':
        return `${notification.profiles?.username} answered your question: ${notification.questions?.title}`;
      case 'vote':
        return `Your ${notification.target_type} received a vote`;
      case 'follow':
        return `${notification.profiles?.username} started following you`;
      case 'accepted':
        return `Your answer was accepted for: ${notification.questions?.title}`;
      default:
        return notification.message;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <Button
            onClick={markAsRead}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Mark All Read
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                <CardContent className="p-12 text-center">
                  <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-600">
                    You're all caught up! Check back later for new notifications.
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`bg-white/80 backdrop-blur-sm border-blue-100 transition-all duration-200 hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-gray-900 mb-2">
                          {getNotificationMessage(notification)}
                        </p>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{new Date(notification.created_at).toLocaleString()}</span>
                          {!notification.read && (
                            <Badge className="bg-blue-100 text-blue-800">New</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
