import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, User, Calendar, Mail, Phone, Video, MapPin, Loader2, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useInterviews } from '@/hooks/useInterviews';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface Props {
  onClose: () => void;
}

interface Candidate {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  avatar_url: string | null;
}

interface Interviewer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  available: boolean;
}

interface Template {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  questions: any | null;
  created_at: string;
}

interface Position {
  id: string;
  title: string;
  department?: string | null;
  company_id: string | null;
}

const SchedulingWizard = ({ onClose }: Props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    candidate: '',
    interviewType: '',
    duration: '',
    interviewer: '',
    date: '',
    time: '',
    template: '',
    position: ''
  });

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [loading, setLoading] = useState({
    candidates: true,
    interviewers: true,
    templates: true,
    positions: true
  });

  const { toast } = useToast();
  const { createInterview } = useInterviews();
  const { user } = useAuth();
  const totalSteps = 5;

  useEffect(() => {
    fetchCandidates();
    fetchInterviewers();
    fetchTemplates();
    fetchPositions();
  }, []);

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'candidate');

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: "Error",
        description: "Failed to load candidates",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, candidates: false }));
    }
  };

  const fetchInterviewers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'recruiter');

      if (error) throw error;
      
      // Check availability from user_availability table
      const { data: availabilityData } = await supabase
        .from('user_availability')
        .select('user_id, is_active');
      
      const availabilityMap = new Map();
      availabilityData?.forEach(item => {
        availabilityMap.set(item.user_id, item.is_active);
      });
      
      const interviewersWithAvailability = data?.map(interviewer => ({
        ...interviewer,
        available: availabilityMap.get(interviewer.id) || false
      })) || [];
      
      setInterviewers(interviewersWithAvailability);
    } catch (error) {
      console.error('Error fetching interviewers:', error);
      toast({
        title: "Error",
        description: "Failed to load interviewers",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, interviewers: false }));
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_templates')
        .select('*');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load interview templates",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, templates: false }));
    }
  };

  const fetchPositions = async () => {
    try {
      const { data, error } = await supabase
        .from('job_positions')
        .select('*');

      if (error) throw error;
      setPositions(data || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
      toast({
        title: "Error",
        description: "Failed to load job positions",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, positions: false }));
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const fullName = `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim();
    return fullName.toLowerCase().includes(candidateSearch.toLowerCase()) ||
           candidate.email.toLowerCase().includes(candidateSearch.toLowerCase());
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSchedule = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to schedule interviews",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Parse date and time
      if (!formData.date || !formData.time) {
        toast({
          title: "Error",
          description: "Please select a date and time",
          variant: "destructive"
        });
        return;
      }
      
      const [hours, minutes] = formData.time.split(':').map(Number);
      const scheduledAt = new Date(formData.date);
      scheduledAt.setHours(hours, minutes, 0, 0);
      
      // Get selected candidate
      const selectedCandidate = candidates.find(c => c.id === formData.candidate);
      if (!selectedCandidate) {
        toast({
          title: "Error",
          description: "Please select a valid candidate",
          variant: "destructive"
        });
        return;
      }
      
      // Create interview
      const interviewData = {
        candidate_id: formData.candidate,
        recruiter_id: user.id,
        job_position_id: formData.position || null,
        title: `Interview with ${selectedCandidate.first_name} ${selectedCandidate.last_name}`,
        description: `${formData.interviewType} interview for ${selectedCandidate.first_name} ${selectedCandidate.last_name}`,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: parseInt(formData.duration) || 60,
        status: 'scheduled' as const,
        template_id: formData.template || null
      };
      
      const { data, error } = await createInterview(interviewData);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to schedule interview",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Interview scheduled successfully",
      });
      
      onClose();
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!formData.candidate;
      case 2: return !!formData.interviewType && !!formData.duration;
      case 3: return !!formData.interviewer;
      case 4: return !!formData.date && !!formData.time;
      case 5: return !!formData.template;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Select Candidate</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
              <Input
                placeholder="Search candidates..."
                className="pl-10 bg-dark-primary border-border-dark text-text-primary"
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
              />
            </div>
            {loading.candidates ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 text-tech-green animate-spin" />
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredCandidates.length === 0 ? (
                  <div className="text-center py-4 text-text-secondary">No candidates found</div>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <Card 
                      key={candidate.id}
                      className={`bg-dark-primary border-border-dark cursor-pointer hover:border-tech-green/50 transition-colors ${
                        formData.candidate === candidate.id ? 'border-tech-green' : ''
                      }`}
                      onClick={() => setFormData({...formData, candidate: candidate.id})}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-text-primary">
                              {candidate.first_name} {candidate.last_name}
                            </h4>
                            <p className="text-sm text-text-secondary">{candidate.email}</p>
                            <Badge className="mt-1 bg-blue-500/20 text-blue-400 border-blue-500/30">
                              Candidate
                            </Badge>
                          </div>
                          <User className="text-tech-green" size={20} />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Interview Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-text-primary">Interview Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { type: 'video', icon: Video, label: 'Video' },
                    { type: 'phone', icon: Phone, label: 'Phone' },
                    { type: 'in-person', icon: MapPin, label: 'In-Person' }
                  ].map(({ type, icon: Icon, label }) => (
                    <Button
                      key={type}
                      variant={formData.interviewType === type ? 'default' : 'outline'}
                      className={`flex flex-col gap-2 h-16 ${
                        formData.interviewType === type 
                          ? 'bg-tech-green text-dark-primary' 
                          : 'border-border-dark text-text-secondary hover:text-text-primary'
                      }`}
                      onClick={() => setFormData({...formData, interviewType: type})}
                    >
                      <Icon size={16} />
                      <span className="text-xs">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-text-primary">Duration</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['30', '60', '90'].map((duration) => (
                    <Button
                      key={duration}
                      variant={formData.duration === duration ? 'default' : 'outline'}
                      className={`${
                        formData.duration === duration 
                          ? 'bg-tech-green text-dark-primary' 
                          : 'border-border-dark text-text-secondary hover:text-text-primary'
                      }`}
                      onClick={() => setFormData({...formData, duration})}
                    >
                      {duration} min
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-text-primary">Position</Label>
              {loading.positions ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 text-tech-green animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {positions.slice(0, 6).map((position) => (
                    <Button
                      key={position.id}
                      variant="outline"
                      className={`justify-start border-border-dark text-text-secondary hover:text-text-primary ${
                        formData.position === position.id ? 'border-tech-green text-tech-green' : ''
                      }`}
                      onClick={() => setFormData({...formData, position: position.id})}
                    >
                      {position.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Select Interviewer</h3>
            {loading.interviewers ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 text-tech-green animate-spin" />
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {interviewers.map((interviewer) => (
                  <Card 
                    key={interviewer.id}
                    className={`bg-dark-primary border-border-dark cursor-pointer hover:border-tech-green/50 transition-colors ${
                      formData.interviewer === interviewer.id ? 'border-tech-green' : ''
                    } ${!interviewer.available ? 'opacity-50' : ''}`}
                    onClick={() => interviewer.available && setFormData({...formData, interviewer: interviewer.id})}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-text-primary">
                            {interviewer.first_name} {interviewer.last_name}
                          </h4>
                          <p className="text-sm text-text-secondary">{interviewer.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={interviewer.available 
                            ? 'bg-tech-green/20 text-tech-green border-tech-green/30' 
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }>
                            {interviewer.available ? 'Available' : 'Busy'}
                          </Badge>
                          <User className="text-tech-green" size={20} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Date & Time</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-text-primary">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="mt-2 bg-dark-primary border-border-dark text-text-primary"
                />
              </div>
              <div>
                <Label className="text-text-primary">Time</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="mt-2 bg-dark-primary border-border-dark text-text-primary"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Select Template</h3>
            {loading.templates ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 text-tech-green animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`bg-dark-primary border-border-dark cursor-pointer hover:border-tech-green/50 transition-colors ${
                      formData.template === template.id ? 'border-tech-green' : ''
                    }`}
                    onClick={() => setFormData({...formData, template: template.id})}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-text-primary">{template.name}</h4>
                          <p className="text-sm text-text-secondary">{template.description || 'No description'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {template.duration_minutes} min
                            </Badge>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              {template.questions ? 
                                (Array.isArray(template.questions) ? template.questions.length : 'N/A') : 
                                'N/A'} questions
                            </Badge>
                          </div>
                        </div>
                        <FileText className="text-tech-green" size={20} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-secondary rounded-lg border border-border-dark w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              Schedule Interview - Step {currentStep} of {totalSteps}
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary"
            >
              ×
            </Button>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    index + 1 === currentStep
                      ? 'bg-tech-green text-dark-primary'
                      : index + 1 < currentStep
                        ? 'bg-tech-green/20 text-tech-green border border-tech-green'
                        : 'bg-dark-primary text-text-secondary border border-border-dark'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 right-0 h-1 bg-dark-primary rounded-full"></div>
              <div 
                className="absolute top-0 left-0 h-1 bg-tech-green rounded-full" 
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-8">
            {renderStep()}
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="border-border-dark text-text-secondary hover:text-text-primary"
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-tech-green hover:bg-tech-green/90 text-dark-primary"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSchedule}
                disabled={!isStepValid()}
                className="bg-tech-green hover:bg-tech-green/90 text-dark-primary"
              >
                Schedule Interview
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingWizard;
