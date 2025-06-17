import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Calendar as CalendarIcon, 
  Clock, 
  FileText, 
  Check,
  Search,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useInterviews } from '@/hooks/useInterviews';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useCandidates } from '@/hooks/useCandidates';
import { supabase } from '@/integrations/supabase/client';

interface ScheduleInterviewModalProps {
  onClose: () => void;
}

interface Candidate {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: 'admin' | 'recruiter' | 'candidate';
  created_at: string;
  updated_at: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: number;
  created_at: string;
}

interface Position {
  id: string;
  title: string;
  department: string;
  company_id: string;
}

const ScheduleInterviewModal = ({ onClose }: ScheduleInterviewModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [interviewDetails, setInterviewDetails] = useState({
    position: '',
    duration: '60',
    description: '',
    date: undefined as Date | undefined,
    time: '14:00',
    timezone: 'PST'
  });
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);
  
  const { createInterview } = useInterviews();
  const { user } = useAuth();
  const { toast } = useToast();
  const { candidates, loading: candidatesLoading } = useCandidates();

  const totalSteps = 5;

  useEffect(() => {
    fetchTemplates();
    fetchPositions();
  }, []);

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const { data, error } = await supabase
        .from('interview_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching templates:', error);
        toast({
          title: "Error",
          description: "Failed to load interview templates",
          variant: "destructive"
        });
        return;
      }
      
      setTemplates(data || []);
    } catch (error) {
      console.error('Error in fetchTemplates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchPositions = async () => {
    setLoadingPositions(true);
    try {
      const { data, error } = await supabase
        .from('job_positions')
        .select('*')
        .order('title', { ascending: true });
      
      if (error) {
        console.error('Error fetching positions:', error);
        toast({
          title: "Error",
          description: "Failed to load job positions",
          variant: "destructive"
        });
        return;
      }
      
      setPositions(data || []);
    } catch (error) {
      console.error('Error in fetchPositions:', error);
    } finally {
      setLoadingPositions(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const fullName = `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim();
    return fullName.toLowerCase().includes(candidateSearch.toLowerCase()) ||
           candidate.email.toLowerCase().includes(candidateSearch.toLowerCase());
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

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
    if (!selectedCandidate || !interviewDetails.date || !interviewDetails.time || !user) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine date and time into a proper datetime
      const scheduledDateTime = new Date(interviewDetails.date);
      const [hours, minutes] = interviewDetails.time.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      const interviewData = {
        candidate_id: selectedCandidate.id,
        recruiter_id: user.id,
        job_position_id: interviewDetails.position || null,
        title: `Interview with ${selectedCandidate.first_name} ${selectedCandidate.last_name}`,
        description: interviewDetails.description,
        scheduled_at: scheduledDateTime.toISOString(),
        duration_minutes: parseInt(interviewDetails.duration),
        status: 'scheduled' as const,
        meeting_url: null,
        notes: interviewDetails.description,
        overall_score: null,
        feedback: null,
        template_id: selectedTemplate?.id || null
      };

      const result = await createInterview(interviewData);
      
      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to schedule interview. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Interview scheduled successfully!",
          variant: "default"
        });
        onClose();
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return selectedCandidate !== null;
      case 2: return interviewDetails.position && interviewDetails.duration;
      case 3: return interviewDetails.date && interviewDetails.time;
      case 4: return selectedTemplate !== null;
      case 5: return true;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-text-primary mb-2 block">Search Candidates</Label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or position..."
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  className="pl-10 bg-dark-primary border-border-dark text-text-primary"
                />
              </div>
            </div>

            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {candidatesLoading ? (
                <div className="text-center py-4 text-text-secondary">Loading candidates...</div>
              ) : filteredCandidates.length === 0 ? (
                <div className="text-center py-4 text-text-secondary">No candidates found</div>
              ) : (
                filteredCandidates.map((candidate) => {
                  const fullName = `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim();
                  const initials = `${candidate.first_name?.[0] || ''}${candidate.last_name?.[0] || ''}`.toUpperCase();
                  
                  return (
                    <Card 
                      key={candidate.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedCandidate?.id === candidate.id 
                          ? 'bg-tech-green/10 border-tech-green' 
                          : 'bg-dark-primary border-border-dark hover:border-tech-green/50'
                      }`}
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={candidate.avatar_url || undefined} />
                            <AvatarFallback className="bg-tech-green text-dark-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-text-primary font-medium">{fullName || 'Unnamed Candidate'}</h4>
                            <p className="text-text-secondary text-sm">{candidate.email}</p>
                          </div>
                          {selectedCandidate?.id === candidate.id && (
                            <Check className="ml-auto text-tech-green h-5 w-5" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-text-primary mb-2 block">Position</Label>
              {loadingPositions ? (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading positions...
                </div>
              ) : (
                <Select 
                  value={interviewDetails.position} 
                  onValueChange={(value) => setInterviewDetails({...interviewDetails, position: value})}
                >
                  <SelectTrigger className="bg-dark-primary border-border-dark text-text-primary">
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-secondary border-border-dark">
                    {positions.map(position => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.title} - {position.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div>
              <Label className="text-text-primary mb-2 block">Duration (minutes)</Label>
              <Select 
                value={interviewDetails.duration} 
                onValueChange={(value) => setInterviewDetails({...interviewDetails, duration: value})}
              >
                <SelectTrigger className="bg-dark-primary border-border-dark text-text-primary">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-dark-secondary border-border-dark">
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-text-primary mb-2 block">Description</Label>
              <Textarea 
                placeholder="Interview description and notes..."
                value={interviewDetails.description}
                onChange={(e) => setInterviewDetails({...interviewDetails, description: e.target.value})}
                className="bg-dark-primary border-border-dark text-text-primary min-h-[100px]"
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-text-primary mb-2 block">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-dark-primary border-border-dark text-text-primary",
                      !interviewDetails.date && "text-text-secondary"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {interviewDetails.date ? format(interviewDetails.date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-dark-secondary border-border-dark">
                  <Calendar
                    mode="single"
                    selected={interviewDetails.date}
                    onSelect={(date) => setInterviewDetails({...interviewDetails, date})}
                    initialFocus
                    disabled={(date) => date < new Date(Date.now() - 86400000)}
                    className="bg-dark-secondary text-text-primary"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label className="text-text-primary mb-2 block">Time</Label>
              <Select 
                value={interviewDetails.time} 
                onValueChange={(value) => setInterviewDetails({...interviewDetails, time: value})}
              >
                <SelectTrigger className="bg-dark-primary border-border-dark text-text-primary">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-dark-secondary border-border-dark max-h-[300px]">
                  {Array.from({ length: 24 }).map((_, hour) => (
                    [0, 30].map((minute) => {
                      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                      return (
                        <SelectItem key={timeString} value={timeString}>
                          {format(new Date().setHours(hour, minute), 'h:mm a')}
                        </SelectItem>
                      );
                    })
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-text-primary mb-2 block">Timezone</Label>
              <Select 
                value={interviewDetails.timezone} 
                onValueChange={(value) => setInterviewDetails({...interviewDetails, timezone: value})}
              >
                <SelectTrigger className="bg-dark-primary border-border-dark text-text-primary">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="bg-dark-secondary border-border-dark">
                  <SelectItem value="PST">Pacific Time (PST/PDT)</SelectItem>
                  <SelectItem value="MST">Mountain Time (MST/MDT)</SelectItem>
                  <SelectItem value="CST">Central Time (CST/CDT)</SelectItem>
                  <SelectItem value="EST">Eastern Time (EST/EDT)</SelectItem>
                  <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <Label className="text-text-primary mb-2 block">Select Interview Template</Label>
            
            {loadingTemplates ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 text-tech-green animate-spin" />
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                No interview templates found
              </div>
            ) : (
              <div className="grid gap-3 max-h-[400px] overflow-y-auto">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id 
                        ? 'bg-tech-green/10 border-tech-green' 
                        : 'bg-dark-primary border-border-dark hover:border-tech-green/50'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-text-primary font-medium">{template.name}</h3>
                          <p className="text-text-secondary text-sm mt-1">{template.description}</p>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className={getDifficultyColor(template.difficulty)}>
                              {template.difficulty}
                            </Badge>
                            <span className="text-xs text-text-secondary">
                              {template.duration} min • {template.questions} questions
                            </span>
                          </div>
                        </div>
                        
                        {selectedTemplate?.id === template.id && (
                          <Check className="text-tech-green h-5 w-5" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-text-primary">Review Interview Details</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-text-secondary">Candidate</h4>
                {selectedCandidate && (
                  <div className="flex items-center mt-2 gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedCandidate.avatar_url || undefined} />
                      <AvatarFallback className="bg-tech-green text-dark-primary">
                        {`${selectedCandidate.first_name?.[0] || ''}${selectedCandidate.last_name?.[0] || ''}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-text-primary">
                        {selectedCandidate.first_name} {selectedCandidate.last_name}
                      </p>
                      <p className="text-sm text-text-secondary">{selectedCandidate.email}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-text-secondary">Position</h4>
                <p className="text-text-primary mt-1">
                  {positions.find(p => p.id === interviewDetails.position)?.title || 'Not specified'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-text-secondary">Date & Time</h4>
                <p className="text-text-primary mt-1">
                  {interviewDetails.date 
                    ? `${format(interviewDetails.date, "PPP")} at ${format(new Date().setHours(
                        parseInt(interviewDetails.time.split(':')[0]),
                        parseInt(interviewDetails.time.split(':')[1])
                      ), 'h:mm a')} ${interviewDetails.timezone}`
                    : 'Not specified'
                  }
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-text-secondary">Duration</h4>
                <p className="text-text-primary mt-1">{interviewDetails.duration} minutes</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-text-secondary">Template</h4>
                <p className="text-text-primary mt-1">{selectedTemplate?.name || 'None'}</p>
              </div>
              
              {interviewDetails.description && (
                <div>
                  <h4 className="text-sm font-medium text-text-secondary">Description</h4>
                  <p className="text-text-primary mt-1">{interviewDetails.description}</p>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary">
          Step {currentStep} of {totalSteps}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 w-6 rounded-full ${
                index < currentStep ? 'bg-tech-green' : 'bg-dark-primary'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-border-dark">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onClose : handlePrevious}
          className="border-border-dark text-text-secondary hover:text-text-primary"
        >
          {currentStep === 1 ? 'Cancel' : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          )}
        </Button>

        <Button
          onClick={currentStep === totalSteps ? handleSchedule : handleNext}
          disabled={(currentStep !== totalSteps && !isStepValid()) || isSubmitting}
          className="bg-tech-green hover:bg-tech-green/90 text-dark-primary"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : currentStep === totalSteps ? (
            'Schedule Interview'
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
