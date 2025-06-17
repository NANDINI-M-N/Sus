import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clock, User, AlertTriangle, CheckCircle, Plus, Settings, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Interviewer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  status: 'available' | 'busy' | 'partial';
  availableHours: number;
  totalHours: number;
  conflicts: number;
}

interface Availability {
  [userId: string]: {
    [day: string]: string[];
  };
}

const AvailabilityManager = () => {
  const [selectedInterviewer, setSelectedInterviewer] = useState<string | null>(null);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [availability, setAvailability] = useState<Availability>({});
  const [loading, setLoading] = useState(true);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  useEffect(() => {
    fetchInterviewers();
  }, []);

  useEffect(() => {
    if (selectedInterviewer) {
      fetchAvailability(selectedInterviewer);
      fetchConflicts(selectedInterviewer);
    }
  }, [selectedInterviewer]);

  const fetchInterviewers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'recruiter');

      if (error) {
        throw error;
      }

      // Process interviewer data
      const processedInterviewers = await Promise.all(data.map(async (interviewer) => {
        // Get availability count
        const { data: availabilityData } = await supabase
          .from('user_availability')
          .select('*')
          .eq('user_id', interviewer.id)
          .eq('is_active', true);
        
        // Calculate available hours
        const availableHours = (availabilityData?.length || 0) * 1; // Each slot is 1 hour
        
        // Get conflicts
        const { data: conflictsData } = await supabase
          .from('interviews')
          .select('id')
          .eq('recruiter_id', interviewer.id)
          .overlaps('scheduled_at', [new Date().toISOString()]);
        
        const conflicts = conflictsData?.length || 0;
        
        // Determine status
        let status: 'available' | 'busy' | 'partial' = 'available';
        if (conflicts > 0) {
          status = 'busy';
        } else if (availableHours < 10) { // Arbitrary threshold
          status = 'partial';
        }
        
        return {
          ...interviewer,
          status,
          availableHours,
          totalHours: 40, // Default work week
          conflicts
        };
      }));

      setInterviewers(processedInterviewers);
      
      // Select first interviewer by default
      if (processedInterviewers.length > 0 && !selectedInterviewer) {
        setSelectedInterviewer(processedInterviewers[0].id);
      }
    } catch (error) {
      console.error('Error fetching interviewers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load interviewers',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async (interviewerId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_availability')
        .select('*')
        .eq('user_id', interviewerId);

      if (error) {
        throw error;
      }

      // Process availability data
      const availabilityMap: Availability = { [interviewerId]: {} };
      
      weekDays.forEach(day => {
        availabilityMap[interviewerId][day] = [];
      });
      
      data.forEach(slot => {
        const dayIndex = slot.day_of_week;
        const day = weekDays[dayIndex - 1]; // Convert 1-based to 0-based index
        
        if (day) {
          const startHour = slot.start_time.substring(0, 5); // Format: "09:00"
          
          if (!availabilityMap[interviewerId][day]) {
            availabilityMap[interviewerId][day] = [];
          }
          
          availabilityMap[interviewerId][day].push(startHour);
        }
      });
      
      setAvailability(availabilityMap);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to load availability data',
        variant: 'destructive'
      });
    }
  };

  const fetchConflicts = async (interviewerId: string) => {
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      // Get interviews that overlap with other interviews
      const { data: interviewsData, error } = await supabase
        .from('interviews')
        .select(`
          id, 
          title,
          scheduled_at,
          candidate:profiles!candidate_id(first_name, last_name)
        `)
        .eq('recruiter_id', interviewerId)
        .gte('scheduled_at', today.toISOString())
        .lte('scheduled_at', nextWeek.toISOString())
        .order('scheduled_at', { ascending: true });

      if (error) {
        throw error;
      }

      // Find conflicts (interviews scheduled at the same time)
      const conflictMap = new Map();
      const conflicts = [];
      
      interviewsData.forEach((interview, i) => {
        for (let j = i + 1; j < interviewsData.length; j++) {
          const interview2 = interviewsData[j];
          const time1 = new Date(interview.scheduled_at).getTime();
          const time2 = new Date(interview2.scheduled_at).getTime();
          
          // Check if interviews are within 1 hour of each other
          if (Math.abs(time1 - time2) < 60 * 60 * 1000) {
            const key = `${interview.id}-${interview2.id}`;
            if (!conflictMap.has(key)) {
              conflictMap.set(key, true);
              conflicts.push({
                id: key,
                time: new Date(interview.scheduled_at),
                candidates: [
                  `${interview.candidate.first_name || ''} ${interview.candidate.last_name || ''}`.trim(),
                  `${interview2.candidate.first_name || ''} ${interview2.candidate.last_name || ''}`.trim()
                ]
              });
            }
          }
        }
      });
      
      setConflicts(conflicts);
    } catch (error) {
      console.error('Error fetching conflicts:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-tech-green/20 text-tech-green border-tech-green';
      case 'busy': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getFullName = (interviewer: Interviewer) => {
    return `${interviewer.first_name || ''} ${interviewer.last_name || ''}`.trim() || interviewer.email;
  };

  // Check if a time slot has an interview scheduled
  const hasInterview = (day: string, time: string) => {
    // This would need to be implemented with real data
    // For now, return a random value
    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 text-tech-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interviewer Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {interviewers.map((interviewer) => (
          <Card 
            key={interviewer.id}
            className={`bg-dark-secondary border-border-dark cursor-pointer hover:border-tech-green/50 transition-colors ${
              selectedInterviewer === interviewer.id ? 'border-tech-green' : ''
            }`}
            onClick={() => setSelectedInterviewer(interviewer.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-text-primary">{getFullName(interviewer)}</h3>
                  <p className="text-sm text-text-secondary">{interviewer.role}</p>
                </div>
                <Badge className={`${getStatusColor(interviewer.status)} border capitalize`}>
                  {interviewer.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Available Hours:</span>
                  <span className="text-tech-green font-medium">
                    {interviewer.availableHours}h / {interviewer.totalHours}h
                  </span>
                </div>
                <div className="w-full bg-dark-primary rounded-full h-2">
                  <div 
                    className="bg-tech-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(interviewer.availableHours / interviewer.totalHours) * 100}%` }}
                  />
                </div>
                {interviewer.conflicts > 0 && (
                  <div className="flex items-center gap-1 text-red-400">
                    <AlertTriangle size={12} />
                    <span>{interviewer.conflicts} conflicts</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedInterviewer && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Availability Calendar */}
        <div className="lg:col-span-2">
          <Card className="bg-dark-secondary border-border-dark">
            <CardHeader>
              <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                <Clock className="h-5 w-5 text-tech-green" />
                  Weekly Availability - {interviewers.find(i => i.id === selectedInterviewer)?.first_name || 'Interviewer'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-text-secondary text-sm font-medium p-2">Time</th>
                      {weekDays.map(day => (
                        <th key={day} className="text-center text-text-secondary text-sm font-medium p-2">
                          {day.slice(0, 3)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(time => (
                      <tr key={time}>
                        <td className="text-text-secondary text-sm p-2 font-medium">{time}</td>
                        {weekDays.map(day => {
                            const isAvailable = availability[selectedInterviewer]?.[day]?.includes(time);
                            const hasScheduledInterview = hasInterview(day, time);
                          
                          return (
                            <td key={`${day}-${time}`} className="p-1">
                              <div 
                                className={`h-8 rounded cursor-pointer transition-colors ${
                                    hasScheduledInterview 
                                    ? 'bg-red-500/20 border border-red-500/30' 
                                    : isAvailable 
                                      ? 'bg-tech-green/20 border border-tech-green/30 hover:bg-tech-green/30' 
                                      : 'bg-dark-primary border border-border-dark hover:bg-gray-500/20'
                                }`}
                                  title={hasScheduledInterview ? 'Interview scheduled' : isAvailable ? 'Available' : 'Not available'}
                              >
                                  {hasScheduledInterview && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center gap-6 mt-4 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-tech-green/20 border border-tech-green/30 rounded" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500/20 border border-red-500/30 rounded" />
                  <span>Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-dark-primary border border-border-dark rounded" />
                  <span>Unavailable</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Availability Settings */}
        <div className="space-y-6">
          {/* Quick Settings */}
          <Card className="bg-dark-secondary border-border-dark">
            <CardHeader>
              <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                <Settings className="h-5 w-5 text-tech-green" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-text-primary">Auto-accept meetings</Label>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-text-primary">Buffer time (minutes)</Label>
                <Input 
                  type="number" 
                  defaultValue="15" 
                  className="w-20 bg-dark-primary border-border-dark text-text-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-text-primary">Max interviews/day</Label>
                <Input 
                  type="number" 
                  defaultValue="4" 
                  className="w-20 bg-dark-primary border-border-dark text-text-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-text-primary">Lunch break</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Conflicts & Alerts */}
          <Card className="bg-dark-secondary border-border-dark">
            <CardHeader>
              <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Conflicts & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {conflicts.length === 0 ? (
                  <div className="text-center py-4 text-text-secondary">
                    No conflicts detected
                  </div>
                ) : (
                  conflicts.map(conflict => (
                    <div key={conflict.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                  <AlertTriangle size={14} />
                  Double booking detected
                </div>
                <p className="text-xs text-text-secondary mt-1">
                        {new Date(conflict.time).toLocaleDateString()} {new Date(conflict.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {conflict.candidates.join(' & ')}
                </p>
              </div>
                  ))
                )}
            </CardContent>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
};

export default AvailabilityManager;
