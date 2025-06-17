import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { VideoCallPanel } from '@/components/interview/VideoCallPanel';
import { CodeEditorPanel } from '@/components/interview/CodeEditorPanel';
import { ChatNotesPanel } from '@/components/interview/ChatNotesPanel';
import { AIAnalysisPanel } from '@/components/interview/AIAnalysisPanel';
import { Settings, LogOut, Users, Circle, Timer, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';
import { useInterviews } from '@/hooks/useInterviews';

const InterviewRoom = () => {
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [isRecording, setIsRecording] = React.useState(true);
  const [participantCount, setParticipantCount] = React.useState(2);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const interviewId = searchParams.get('id');
  const { interviews, updateInterview } = useInterviews();
  const [currentInterview, setCurrentInterview] = useState<any>(null);
  
  // State for code sharing between editor and analysis panel
  const [currentCode, setCurrentCode] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('javascript');
  
  // Reference to the AI Analysis panel
  const aiAnalysisPanelRef = useRef<any>(null);
  
  // Load the current interview data
  useEffect(() => {
    if (interviewId && interviews.length > 0) {
      const interview = interviews.find(i => i.id === interviewId);
      if (interview) {
        setCurrentInterview(interview);
        
        // If the interview is scheduled, update it to in_progress
        if (interview.status === 'scheduled') {
          updateInterview(interviewId, { status: 'in_progress' });
        }
      } else {
        // Interview not found, redirect back to interviews page
        navigate('/interviews');
      }
    }
  }, [interviewId, interviews]);

  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    // Calculate initial elapsed time if interview is already in progress
    if (currentInterview?.status === 'in_progress' && currentInterview.scheduled_at) {
      const startTime = new Date(currentInterview.scheduled_at);
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      
      // Only update if it's a positive number
      if (elapsedSeconds > 0) {
        setElapsedTime(elapsedSeconds);
      }
    }
    
    // Start the timer
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentInterview]);

  const handleEndInterview = async () => {
    // Mark the interview as completed when ending
    if (interviewId) {
      await updateInterview(interviewId, { 
        status: 'completed',
        updated_at: new Date().toISOString()
      });
    }
    navigate('/interviews');
  };
  
  // Handler for code updates from the editor
  const handleCodeUpdate = (code: string, language: string) => {
    setCurrentCode(code);
    setCurrentLanguage(language);
    
    // If we had a direct ref to the analysis panel component, we could call methods on it
    if (aiAnalysisPanelRef.current) {
      aiAnalysisPanelRef.current.handleCodeUpdate(code, language);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col">
      {/* Header Bar */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-4">
            <BackButton 
              label="Back to Interviews" 
              to="/interviews"
              className="text-gray-300 hover:text-white"
            />
            <div className="h-6 w-px bg-gray-700 mx-2"></div>
            <div>
              <h1 className="text-white font-semibold text-lg">
                {currentInterview?.title || 'Interview Session'}
              </h1>
              <p className="text-gray-300 text-sm">
                {currentInterview?.candidate ? 
                  `${currentInterview.candidate.first_name} ${currentInterview.candidate.last_name}` : 
                  'Candidate'
                }
                {currentInterview?.job_position?.title && ` - ${currentInterview.job_position.title}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Timer */}
            <div className="flex items-center space-x-2 bg-gray-900 px-3 py-1 rounded">
              <Timer className="w-4 h-4 text-emerald-green" />
              <span className="text-white font-mono">{formatTime(elapsedTime)}</span>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <Circle className={`w-3 h-3 fill-current ${
                currentInterview?.status === 'completed' ? 'text-gray-400' : 
                currentInterview?.status === 'in_progress' ? 'text-emerald-green' : 
                'text-yellow-400'
              }`} />
              <span className={`text-sm font-medium ${
                currentInterview?.status === 'completed' ? 'text-gray-400' : 
                currentInterview?.status === 'in_progress' ? 'text-emerald-green' : 
                'text-yellow-400'
              }`}>
                {currentInterview?.status === 'completed' ? 'Completed' : 
                 currentInterview?.status === 'in_progress' ? 'Active' : 
                 'Scheduled'}
              </span>
            </div>
            
            {/* Participants */}
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-300" />
              <span className="text-gray-300 text-sm">{participantCount} participants</span>
            </div>
            
            {/* Recording Indicator */}
            {isRecording && (
              <div className="flex items-center space-x-2 bg-red-900/20 px-3 py-1 rounded">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-sm">Recording</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              <DropdownMenuItem className="text-white hover:bg-gray-900">
                Audio Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-900">
                Video Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-900">
                Recording Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="destructive" 
            size="sm" 
            className="bg-red-600 hover:bg-red-700"
            onClick={handleEndInterview}
            disabled={currentInterview?.status === 'completed'}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {currentInterview?.status === 'completed' ? 'Interview Completed' : 'End Interview'}
          </Button>
        </div>
      </header>

      {/* Main Content Area - 4 Panel Layout */}
      <div className="flex-1 p-4 bg-gray-900">
        <ResizablePanelGroup direction="vertical" className="h-full">
          {/* Top Row */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <ResizablePanelGroup direction="horizontal">
              {/* Video Call Panel - Top Left */}
              <ResizablePanel defaultSize={50} minSize={25}>
                <VideoCallPanel />
              </ResizablePanel>
              
              <ResizableHandle withHandle className="bg-gray-700 hover:bg-emerald-green/20" />
              
              {/* Code Editor Panel - Top Right */}
              <ResizablePanel defaultSize={50} minSize={25}>
                <CodeEditorPanel onCodeChange={handleCodeUpdate} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-gray-700 hover:bg-emerald-green/20" />
          
          {/* Bottom Row */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <ResizablePanelGroup direction="horizontal">
              {/* Chat & Notes Panel - Bottom Left */}
              <ResizablePanel defaultSize={50} minSize={25}>
                <ChatNotesPanel />
              </ResizablePanel>
              
              <ResizableHandle withHandle className="bg-gray-700 hover:bg-emerald-green/20" />
              
              {/* AI Analysis Panel - Bottom Right */}
              <ResizablePanel defaultSize={50} minSize={25}>
                <AIAnalysisPanel 
                  ref={aiAnalysisPanelRef}
                  initialCode={currentCode}
                  initialLanguage={currentLanguage}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default InterviewRoom;
