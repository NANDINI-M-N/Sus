import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, MapPin, Loader2 } from 'lucide-react';
import { useInterviews } from '@/hooks/useInterviews';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, addWeeks, subWeeks, startOfWeek, endOfWeek, getDay } from 'date-fns';

const SchedulingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const { interviews, loading } = useInterviews();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'scheduled': return 'bg-tech-green/20 text-tech-green border-tech-green';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getTypeIcon = (meetingUrl: string | null) => {
    if (!meetingUrl) return '🏢'; // In-person
    if (meetingUrl.includes('zoom')) return '📹'; // Video
    if (meetingUrl.includes('phone') || meetingUrl.includes('tel:')) return '📞'; // Phone
    return '📹'; // Default to video
  };

  const navigateMonth = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const navigateWeek = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get days for the current month/week view
  const getDays = () => {
    if (viewMode === 'month') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
      const end = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday
      return eachDayOfInterval({ start, end });
    } else {
      return [currentDate]; // Day view shows only current day
    }
  };

  // Get interviews for a specific day
  const getInterviewsForDay = (day: Date) => {
    if (!interviews) return [];
    
    return interviews.filter(interview => {
      if (!interview.scheduled_at) return false;
      const interviewDate = parseISO(interview.scheduled_at);
      return (
        interviewDate.getDate() === day.getDate() &&
        interviewDate.getMonth() === day.getMonth() &&
        interviewDate.getFullYear() === day.getFullYear()
      );
    });
  };

  // Get today's interviews
  const getTodaysInterviews = () => {
    const today = new Date();
    return getInterviewsForDay(today);
  };

  // Format time from ISO string
  const formatTime = (isoString: string | null) => {
    if (!isoString) return '';
    return format(parseISO(isoString), 'HH:mm');
  };

  // Get candidate full name
  const getCandidateName = (interview: any) => {
    if (!interview.candidate) return 'Unknown Candidate';
    return `${interview.candidate.first_name || ''} ${interview.candidate.last_name || ''}`.trim() || interview.candidate.email;
  };

  // Get recruiter full name
  const getRecruiterName = (interview: any) => {
    if (!interview.recruiter) return 'Unassigned';
    return `${interview.recruiter.first_name || ''} ${interview.recruiter.last_name || ''}`.trim() || interview.recruiter.email;
  };

  const days = getDays();
  const todaysInterviews = getTodaysInterviews();

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-text-secondary hover:text-text-primary"
                  onClick={() => viewMode === 'month' ? navigateMonth('prev') : navigateWeek('prev')}
                >
                  <ChevronLeft size={16} />
                </Button>
                <h2 className="text-lg font-semibold text-text-primary">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-text-secondary hover:text-text-primary"
                  onClick={() => viewMode === 'month' ? navigateMonth('next') : navigateWeek('next')}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border-dark text-text-secondary hover:text-text-primary"
                onClick={goToToday}
              >
                Today
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              {['month', 'week', 'day'].map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode(mode as 'month' | 'week' | 'day')}
                  className={viewMode === mode 
                    ? 'bg-tech-green text-dark-primary' 
                    : 'border-border-dark text-text-secondary hover:text-text-primary'
                  }
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-tech-green animate-spin" />
        </div>
      ) : (
        <>
          {/* Calendar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {/* Time Column */}
            <div className="lg:col-span-1">
              <Card className="bg-dark-secondary border-border-dark h-full">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className="text-sm text-text-secondary py-2">
                        {String(9 + i).padStart(2, '0')}:00
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Calendar Days */}
            <div className="lg:col-span-6">
              <Card className="bg-dark-secondary border-border-dark">
                <CardContent className="p-4">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-text-secondary py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((day, i) => {
                      const dayInterviews = getInterviewsForDay(day);
                      return (
                        <div 
                          key={i} 
                          className={`min-h-32 p-2 border rounded-lg relative ${
                            isToday(day) 
                              ? 'border-tech-green bg-tech-green/5' 
                              : 'border-border-dark'
                          }`}
                        >
                          <div className={`text-xs ${isToday(day) ? 'text-tech-green font-bold' : 'text-text-secondary'} mb-2`}>
                            {format(day, 'd')}
                          </div>
                          
                          <div className="space-y-1">
                            {dayInterviews.map((interview) => (
                              <div 
                                key={interview.id}
                                className={`text-xs p-1 rounded cursor-pointer hover:bg-opacity-50 transition-colors ${
                                  getStatusColor(interview.status)
                                }`}
                              >
                                <div className="font-medium truncate">
                                  {formatTime(interview.scheduled_at)} {getCandidateName(interview)}
                                </div>
                                <div className="text-text-secondary truncate">
                                  {interview.job_position?.title || 'Interview'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Today's Schedule */}
          <Card className="bg-dark-secondary border-border-dark">
            <CardHeader>
              <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                <Calendar className="h-5 w-5 text-tech-green" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysInterviews.length === 0 ? (
                <div className="text-center py-6 text-text-secondary">
                  No interviews scheduled for today
                </div>
              ) : (
                todaysInterviews.map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between p-4 bg-dark-primary rounded-lg border border-border-dark">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getTypeIcon(interview.meeting_url)}</div>
                      <div>
                        <h4 className="font-medium text-text-primary">{getCandidateName(interview)}</h4>
                        <p className="text-sm text-text-secondary">{interview.job_position?.title || 'Interview'}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatTime(interview.scheduled_at)} ({interview.duration_minutes || 60} min)
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {getRecruiterName(interview)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(interview.status)} border capitalize`}>
                        {interview.status}
                      </Badge>
                      <Button size="sm" variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SchedulingCalendar;
