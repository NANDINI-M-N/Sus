import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AnalyticsData {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  completionRate: number;
  timeToHire: number;
  hireRate: number;
  monthlyTrends: Array<{
    month: string;
    completed: number;
    scheduled: number;
    success_rate: number;
  }>;
  departmentStats: Array<{
    name: string;
    interviews: number;
    hires: number;
    success_rate: number;
  }>;
  interviewerStats: Array<{
    interviewer: string;
    interviews: number;
    avg_score: number;
    hire_rate: number;
  }>;
  performanceTrends: Array<{
    month: string;
    overall: number;
    coding_score?: number;
    communication?: number;
    problem_solving?: number;
  }>;
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch interviews data
      const { data: interviews, error: interviewsError } = await supabase
        .from('interviews')
        .select(`
          *,
          candidate:profiles!interviews_candidate_id_fkey(first_name, last_name),
          recruiter:profiles!interviews_recruiter_id_fkey(first_name, last_name),
          job_position:job_positions(title, company:companies(name))
        `);

      if (interviewsError) {
        console.error('Error fetching interviews:', interviewsError);
        return;
      }

      const interviewsData = interviews || [];
      const completedInterviews = interviewsData.filter(i => i.status === 'completed');
      const totalInterviews = interviewsData.length;
      const completionRate = totalInterviews > 0 ? (completedInterviews.length / totalInterviews) * 100 : 0;
      
      // Calculate average score
      const scoresSum = completedInterviews
        .filter(i => i.overall_score !== null)
        .reduce((sum, i) => sum + (i.overall_score || 0), 0);
      const averageScore = completedInterviews.length > 0 ? scoresSum / completedInterviews.length : 0;

      // Calculate monthly trends (last 6 months)
      const monthlyTrends = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const monthInterviews = interviewsData.filter(interview => {
          const interviewDate = new Date(interview.created_at);
          return interviewDate.getMonth() === date.getMonth() && 
                 interviewDate.getFullYear() === date.getFullYear();
        });
        
        const monthCompleted = monthInterviews.filter(i => i.status === 'completed');
        const monthScheduled = monthInterviews.length;
        const successRate = monthScheduled > 0 ? (monthCompleted.length / monthScheduled) * 100 : 0;
        
        monthlyTrends.push({
          month: monthName,
          completed: monthCompleted.length,
          scheduled: monthScheduled,
          success_rate: Math.round(successRate * 10) / 10
        });
      }

      // Calculate department stats (using job positions)
      const departmentMap = new Map();
      interviewsData.forEach(interview => {
        if (interview.job_position?.company?.name) {
          const deptName = interview.job_position.company.name;
          if (!departmentMap.has(deptName)) {
            departmentMap.set(deptName, { interviews: 0, completed: 0 });
          }
          const dept = departmentMap.get(deptName);
          dept.interviews++;
          if (interview.status === 'completed') {
            dept.completed++;
          }
        }
      });

      const departmentStats = Array.from(departmentMap.entries()).map(([name, stats]) => ({
        name,
        interviews: stats.interviews,
        hires: stats.completed, // Using completed as proxy for hires
        success_rate: stats.interviews > 0 ? (stats.completed / stats.interviews) * 100 : 0
      }));

      // Calculate interviewer stats
      const interviewerMap = new Map();
      interviewsData.forEach(interview => {
        if (interview.recruiter) {
          const name = `${interview.recruiter.first_name || ''} ${interview.recruiter.last_name || ''}`.trim();
          if (!interviewerMap.has(name)) {
            interviewerMap.set(name, { interviews: 0, totalScore: 0, scoredInterviews: 0, completed: 0 });
          }
          const interviewer = interviewerMap.get(name);
          interviewer.interviews++;
          if (interview.overall_score !== null) {
            interviewer.totalScore += interview.overall_score;
            interviewer.scoredInterviews++;
          }
          if (interview.status === 'completed') {
            interviewer.completed++;
          }
        }
      });

      const interviewerStats = Array.from(interviewerMap.entries())
        .filter(([name]) => name.trim() !== '')
        .map(([name, stats]) => ({
          interviewer: name,
          interviews: stats.interviews,
          avg_score: stats.scoredInterviews > 0 ? stats.totalScore / stats.scoredInterviews : 0,
          hire_rate: stats.interviews > 0 ? (stats.completed / stats.interviews) * 100 : 0
        }));

      // Performance trends (simplified - using overall scores by month)
      const performanceTrends = monthlyTrends.map(trend => ({
        month: trend.month,
        overall: averageScore // Simplified - using overall average
      }));

      const analyticsData: AnalyticsData = {
        totalInterviews,
        completedInterviews: completedInterviews.length,
        averageScore: Math.round(averageScore * 10) / 10,
        completionRate: Math.round(completionRate * 10) / 10,
        timeToHire: 20, // Default value - would need more complex calculation
        hireRate: Math.round(completionRate * 10) / 10, // Using completion rate as proxy
        monthlyTrends,
        departmentStats,
        interviewerStats,
        performanceTrends
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  return {
    analytics,
    loading,
    refetch: fetchAnalytics
  };
};