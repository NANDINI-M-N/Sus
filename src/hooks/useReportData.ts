import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InterviewReport {
  id: string;
  candidate: string;
  position: string;
  interviewer: string;
  date: string;
  duration: string;
  status: string;
  overall_score: number;
  recommendation: string;
  ai_analysis: string;
  sections: {
    technical: number;
    communication: number;
    cultural_fit: number;
    problem_solving: number;
  };
}

export interface DepartmentPerformance {
  department: string;
  interviews: number;
  hires: number;
  avg_score: number;
  time_to_hire: number;
}

export interface InterviewTrend {
  month: string;
  interviews: number;
  hires: number;
  success_rate: number;
}

export interface SkillMetric {
  skill: string;
  current: number;
  target: number;
}

export interface PositionDistribution {
  name: string;
  value: number;
  color: string;
}

export interface InterviewerEfficiency {
  interviewer: string;
  efficiency: number;
  satisfaction: number;
  interviews: number;
}

export interface PerformanceData {
  interview_score: number;
  hire_probability: number;
  candidate: string;
  department: string;
}

export interface ReportData {
  id: string;
  title: string;
  description: string | null;
  type: string;
  data: any;
  filters: any;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
}

interface RawInterviewData {
  id: string;
  scheduled_at: string;
  completed_at: string | null;
  duration: number;
  status: string;
  overall_score: number | null;
  recommendation: string | null;
  ai_feedback: string | null;
  technical_score: number | null;
  communication_score: number | null;
  cultural_fit_score: number | null;
  problem_solving_score: number | null;
  candidate_feedback_score: number | null;
  candidates: {
    id: string;
    first_name: string;
    last_name: string;
  };
  positions: {
    id: string;
    title: string;
    department: string;
  };
  users: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface DepartmentStats {
  interviews: number;
  hires: number;
  scores: number[];
  timesToHire: number[];
}

interface InterviewerStats {
  interviews: number;
  completedOnTime: number;
  satisfactionScores: number[];
}

export const useReportData = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: "Error",
          description: "Failed to load reports",
          variant: "destructive"
        });
        return;
      }

      setReports(data || []);
    } catch (error) {
      console.error('Error in fetchReports:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportData: Omit<ReportData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert(reportData)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create report",
          variant: "destructive"
        });
        return { error };
      }

      setReports(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Report created successfully",
        variant: "default"
      });

      return { data, error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const updateReport = async (id: string, updates: Partial<ReportData>) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update report",
          variant: "destructive"
        });
        return { error };
      }

      setReports(prev => prev.map(report => report.id === id ? data : report));
      toast({
        title: "Success",
        description: "Report updated successfully",
        variant: "default"
      });

      return { data, error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete report",
          variant: "destructive"
        });
        return { error };
      }

      setReports(prev => prev.filter(report => report.id !== id));
      toast({
        title: "Success",
        description: "Report deleted successfully",
        variant: "default"
      });

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const getReportById = (id: string) => {
    return reports.find(report => report.id === id);
  };

  return {
    reports,
    loading,
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
    getReportById
  };
};