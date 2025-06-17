import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Activity {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string;
  metadata?: any;
  created_at: string;
}

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchActivities = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching activities:', error);
        return;
      }

      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async ({
    type,
    title,
    description,
    metadata = null
  }: {
    type: string;
    title: string;
    description: string;
    metadata?: any;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          type,
          title,
          description,
          metadata
        })
        .select()
        .single();

      if (error) {
        console.error('Error logging activity:', error);
        return;
      }

      // Add the new activity to the beginning of the list
      setActivities(prev => [data, ...prev.slice(0, 49)]); // Keep only 50 activities
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const getRecentActivities = (limit: number = 10) => {
    return activities.slice(0, limit);
  };

  const getActivitiesByType = (type: string) => {
    return activities.filter(activity => activity.type === type);
  };

  const formatActivityTime = (createdAt: string) => {
    const now = new Date();
    const activityTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return activityTime.toLocaleDateString();
  };

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  return {
    activities,
    loading,
    logActivity,
    getRecentActivities,
    getActivitiesByType,
    formatActivityTime,
    refetch: fetchActivities
  };
};