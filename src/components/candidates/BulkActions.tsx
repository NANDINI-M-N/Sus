
import { useState } from 'react';
import { 
  X, 
  Mail, 
  Calendar, 
  Download, 
  Tag, 
  Trash2,
  Users,
  CalendarIcon,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useInterviews } from '@/hooks/useInterviews';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BulkActionsProps {
  selectedCount: number;
  selectedCandidateIds: string[];
  onClearSelection: () => void;
}

export const BulkActions = ({ selectedCount, selectedCandidateIds, onClearSelection }: BulkActionsProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  
  // Bulk interview scheduling state
  const [bulkInterviewData, setBulkInterviewData] = useState({
    position: '',
    duration: '60',
    description: '',
    date: undefined as Date | undefined,
    time: '14:00',
    interviewType: 'technical'
  });
  
  const { createInterview } = useInterviews();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSendEmail = () => {
    setShowEmailDialog(true);
  };

  const handleScheduleInterview = () => {
    setShowScheduleDialog(true);
  };

  const handleBulkSchedule = async () => {
    if (!bulkInterviewData.date || !bulkInterviewData.time || !user) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsScheduling(true);
    
    try {
      // Combine date and time into a proper datetime
      const scheduledDateTime = new Date(bulkInterviewData.date);
      const [hours, minutes] = bulkInterviewData.time.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      let successCount = 0;
      let errorCount = 0;

      // Create interviews for each selected candidate
      for (const candidateId of selectedCandidateIds) {
        const interviewData = {
          candidate_id: candidateId,
          recruiter_id: user.id,
          job_position_id: null,
          scheduled_at: scheduledDateTime.toISOString(),
          duration: parseInt(bulkInterviewData.duration),
          notes: bulkInterviewData.description,
          status: 'scheduled' as const,
          interview_type: bulkInterviewData.interviewType as 'technical' | 'behavioral' | 'cultural',
          meeting_link: null,
          feedback: null,
          score: null
        };

        const result = await createInterview(interviewData);
        
        if (result.error) {
          errorCount++;
        } else {
          successCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `${successCount} interview(s) scheduled successfully!${errorCount > 0 ? ` ${errorCount} failed.` : ''}`,
          variant: "default"
        });
      }

      if (errorCount > 0 && successCount === 0) {
        toast({
          title: "Error",
          description: "Failed to schedule interviews. Please try again.",
          variant: "destructive"
        });
      }

      if (successCount > 0) {
        setShowScheduleDialog(false);
        onClearSelection();
        // Reset form
        setBulkInterviewData({
          position: '',
          duration: '60',
          description: '',
          date: undefined,
          time: '14:00',
          interviewType: 'technical'
        });
      }
    } catch (error) {
      console.error('Error scheduling bulk interviews:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const handleExportData = () => {
    // Mock export functionality
    console.log('Exporting data for', selectedCount, 'candidates');
  };

  const handleAddTags = () => {
    // Mock tag functionality
    console.log('Adding tags to', selectedCount, 'candidates');
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    // Mock delete functionality
    console.log('Deleting', selectedCount, 'candidates');
    setShowDeleteDialog(false);
    onClearSelection();
  };

  return (
    <>
      <div className="bg-tech-green/10 border border-tech-green/30 rounded-lg p-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className="bg-tech-green text-dark-primary">
              <Users size={14} className="mr-1" />
              {selectedCount} selected
            </Badge>
            <span className="text-text-primary font-medium">Bulk Actions:</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-text-secondary hover:text-text-primary"
          >
            <X size={16} className="mr-1" />
            Clear Selection
          </Button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Button
            size="sm"
            onClick={handleSendEmail}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Mail size={14} className="mr-1" />
            Send Email
          </Button>
          
          <Button
            size="sm"
            onClick={handleScheduleInterview}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Calendar size={14} className="mr-1" />
            Schedule Interviews
          </Button>
          
          <Button
            size="sm"
            onClick={handleExportData}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download size={14} className="mr-1" />
            Export Data
          </Button>
          
          <Button
            size="sm"
            onClick={handleAddTags}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Tag size={14} className="mr-1" />
            Add Tags
          </Button>
          
          <Button
            size="sm"
            onClick={handleDelete}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 size={14} className="mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="bg-dark-secondary border-border-dark">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Send Email to {selectedCount} Candidates</DialogTitle>
            <DialogDescription className="text-text-secondary">
              This will send an email to all selected candidates. You can customize the message template.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-text-primary">
              Email templates and customization options would be implemented here.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-tech-green hover:bg-tech-green/90 text-dark-primary">
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="bg-dark-secondary border-border-dark max-w-md">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Schedule Interviews for {selectedCount} Candidates</DialogTitle>
            <DialogDescription className="text-text-secondary">
              This will create interview schedules for all selected candidates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-text-primary">Position/Role</Label>
              <Input
                value={bulkInterviewData.position}
                onChange={(e) => setBulkInterviewData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="e.g., Senior Frontend Developer"
                className="bg-dark-primary border-border-dark text-text-primary"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-primary">Duration (minutes)</Label>
                <Select value={bulkInterviewData.duration} onValueChange={(value) => setBulkInterviewData(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger className="bg-dark-primary border-border-dark text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-text-primary">Interview Type</Label>
                <Select value={bulkInterviewData.interviewType} onValueChange={(value) => setBulkInterviewData(prev => ({ ...prev, interviewType: value }))}>
                  <SelectTrigger className="bg-dark-primary border-border-dark text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="cultural">Cultural Fit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-primary">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-dark-primary border-border-dark text-text-primary",
                        !bulkInterviewData.date && "text-text-secondary"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bulkInterviewData.date ? format(bulkInterviewData.date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-dark-secondary border-border-dark">
                    <CalendarComponent
                      mode="single"
                      selected={bulkInterviewData.date}
                      onSelect={(date) => setBulkInterviewData(prev => ({ ...prev, date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label className="text-text-primary">Time</Label>
                <Input
                  type="time"
                  value={bulkInterviewData.time}
                  onChange={(e) => setBulkInterviewData(prev => ({ ...prev, time: e.target.value }))}
                  className="bg-dark-primary border-border-dark text-text-primary"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-text-primary">Notes (Optional)</Label>
              <Textarea
                value={bulkInterviewData.description}
                onChange={(e) => setBulkInterviewData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional notes for the interview..."
                className="bg-dark-primary border-border-dark text-text-primary"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)} disabled={isScheduling}>
              Cancel
            </Button>
            <Button 
              onClick={handleBulkSchedule}
              disabled={isScheduling || !bulkInterviewData.date || !bulkInterviewData.time}
              className="bg-tech-green hover:bg-tech-green/90 text-dark-primary disabled:opacity-50"
            >
              {isScheduling ? 'Scheduling...' : 'Schedule Interviews'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-dark-secondary border-border-dark">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Delete {selectedCount} Candidates</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Are you sure you want to delete {selectedCount} candidates? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Candidates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
