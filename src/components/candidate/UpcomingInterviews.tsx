import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Building, Video, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInterviews } from '@/hooks/useInterviews';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

const UpcomingInterviews = () => {
  const navigate = useNavigate();
  const { interviews, loading } = useInterviews();
  const { user } = useAuth();
  
  const handleJoinInterview = (interviewId: string) => {
    navigate(`/interview-room?id=${interviewId}`);
  };

  // Filter interviews for the current candidate and upcoming ones
  const upcomingInterviews = interviews.filter(interview => {
    if (!user || interview.candidate_id !== user.id) return false;
    if (interview.status === 'cancelled' || interview.status === 'completed') return false;
    if (!interview.scheduled_at) return false;
    
    const interviewDate = new Date(interview.scheduled_at);
    const now = new Date();
    return interviewDate > now;
  }).sort((a, b) => {
    const dateA = new Date(a.scheduled_at!);
    const dateB = new Date(b.scheduled_at!);
    return dateA.getTime() - dateB.getTime();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-green text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Technical': return 'bg-blue-500';
      case 'Culture Fit': return 'bg-purple-500';
      case 'Final Round': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6">
      {loading ? (
        <div className="text-center py-8 text-gray-400">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-green/20 border-t-emerald-green rounded-full mx-auto mb-4"></div>
          Loading interviews...
        </div>
      ) : upcomingInterviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-white font-medium text-xl mb-2">No Upcoming Interviews</h3>
          <p className="text-gray-400 text-base">Your scheduled interviews will appear here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingInterviews.map((interview) => {
            const interviewDate = new Date(interview.scheduled_at!);
            const recruiterName = interview.recruiter ? 
              `${interview.recruiter.first_name || ''} ${interview.recruiter.last_name || ''}`.trim() : 
              'Unknown Recruiter';
            const companyName = interview.job_position?.company?.name || 'Company';
            const positionTitle = interview.job_position?.title || interview.title;
            
            return (
              <div key={interview.id} className="p-6 rounded-xl bg-gray-800 border border-gray-700 shadow-lg hover:shadow-emerald-green/5 transition-all">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-emerald-green/20 rounded-2xl flex items-center justify-center">
                      <Building className="h-8 w-8 text-emerald-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-xl mb-1">{positionTitle}</h3>
                      <div className="flex items-center gap-2 text-gray-300 text-base mb-2">
                        <Building className="h-4 w-4" />
                        <span>{companyName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Users className="h-3.5 w-3.5" />
                        <span>Interviewer: {recruiterName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Remote Interview</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-3">
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(interview.status) + " text-sm py-1 px-3"}>
                        {interview.status}
                      </Badge>
                      <Badge className="bg-blue-500 text-white text-sm py-1 px-3">
                        Interview
                      </Badge>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-emerald-green hover:bg-emerald-green/90 text-white w-full md:w-auto mt-2"
                      onClick={() => handleJoinInterview(interview.id)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Interview
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-700 flex flex-wrap gap-6">
                  <div className="flex items-center gap-3 text-base text-white">
                    <div className="w-10 h-10 rounded-full bg-emerald-green/20 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-emerald-green" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Date</div>
                      <div>{format(interviewDate, 'MMM dd, yyyy')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-base text-white">
                    <div className="w-10 h-10 rounded-full bg-emerald-green/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-emerald-green" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Time</div>
                      <div>{format(interviewDate, 'h:mm a')}</div>
                    </div>
                  </div>
                  
                  {interview.duration_minutes && (
                    <div className="flex items-center gap-3 text-base text-white">
                      <div className="w-10 h-10 rounded-full bg-emerald-green/20 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-emerald-green" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Duration</div>
                        <div>{interview.duration_minutes} minutes</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingInterviews;
