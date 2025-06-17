import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, TrendingUp, Award } from 'lucide-react';
import { useInterviews } from '@/hooks/useInterviews';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

const InterviewHistory = () => {
  const { interviews, loading } = useInterviews();
  const { user } = useAuth();

  // Filter interviews for the current candidate that are completed
  const interviewHistory = interviews.filter(interview => {
    if (!user || interview.candidate_id !== user.id) return false;
    if (!interview.scheduled_at) return false;
    
    const interviewDate = new Date(interview.scheduled_at);
    const now = new Date();
    return interviewDate < now; // Past interviews only
  }).sort((a, b) => {
    const dateA = new Date(a.scheduled_at!);
    const dateB = new Date(b.scheduled_at!);
    return dateB.getTime() - dateA.getTime(); // Most recent first
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-emerald-green text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-green';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="p-6">
      {loading ? (
        <div className="text-center py-8 text-gray-400">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-green/20 border-t-emerald-green rounded-full mx-auto mb-4"></div>
          Loading interview history...
        </div>
      ) : interviewHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-white font-medium text-xl mb-2">No Interview History</h3>
          <p className="text-gray-400 text-base">Your past interviews will appear here</p>
        </div>
      ) : (
        <div className="space-y-8">
          {interviewHistory.map((interview, index) => (
            <div key={interview.id} className="relative">
              {/* Timeline Line */}
              {index !== interviewHistory.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-24 bg-gray-700"></div>
              )}
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-emerald-green/20 border-2 border-emerald-green flex items-center justify-center">
                    <Award className="h-6 w-6 text-emerald-green" />
                  </div>
                </div>
                
                <div className="flex-1 bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-white text-lg">
                        {interview.job_position?.title || 'Interview'}
                      </h3>
                      <p className="text-sm text-gray-300 mt-1">
                        {interview.recruiter ? 
                          `${interview.recruiter.first_name} ${interview.recruiter.last_name}` : 
                          'Unknown Recruiter'
                        } • {interview.scheduled_at ? format(new Date(interview.scheduled_at), 'MMM dd, yyyy') : 'No date'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {interview.overall_score && (
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-400">Score</span>
                          <span className={`text-2xl font-bold ${getScoreColor(interview.overall_score)}`}>
                            {interview.overall_score}
                          </span>
                        </div>
                      )}
                      <Badge className={getStatusColor(interview.status || 'completed') + " text-sm py-1 px-3"}>
                        {interview.status || 'completed'}
                      </Badge>
                    </div>
                  </div>
                  
                  {interview.duration_minutes && (
                    <div className="mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        Duration: {interview.duration_minutes} minutes
                      </span>
                    </div>
                  )}
                  
                  {interview.feedback && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-400 mb-2">Feedback:</div>
                      <p className="text-sm text-gray-300 bg-gray-700 p-4 rounded-lg border border-gray-600">
                        {interview.feedback}
                      </p>
                    </div>
                  )}
                  
                  {interview.overall_score && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-400">Overall Performance</span>
                        <span className={`text-sm ${getScoreColor(interview.overall_score)}`}>{interview.overall_score}%</span>
                      </div>
                      <Progress 
                        value={interview.overall_score} 
                        className={`h-2 bg-gray-700 ${
                          interview.overall_score >= 80 
                            ? "[&>div]:bg-emerald-green" 
                            : interview.overall_score >= 60 
                              ? "[&>div]:bg-yellow-500" 
                              : "[&>div]:bg-red-500"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;
