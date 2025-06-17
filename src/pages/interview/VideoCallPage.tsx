import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Circle, Timer, Users, Video, FileText, UserCog } from 'lucide-react';
import { useInterview } from '@/contexts/InterviewContext';
import { VideoRoom } from '@/components/interview/VideoRoom';
import { SimpleSpeechRecorder } from '@/components/interview/SimpleSpeechRecorder';
import { TranscriptView } from '@/components/interview/TranscriptView';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const VideoCallPage: React.FC = () => {
  // State for elapsed time
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeTab, setActiveTab] = useState('video');
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { profile } = useProfile();
  
  // Access the interview context
  const { isRecording, transcriptLines } = useInterview();
  
  // Track new transcripts for notification
  const [newTranscripts, setNewTranscripts] = useState(0);
  
  // Reset new transcript count when switching to transcript tab
  useEffect(() => {
    if (activeTab === 'transcript') {
      setNewTranscripts(0);
    }
  }, [activeTab]);
  
  // Increment new transcript count when not on transcript tab
  const prevTranscriptLengthRef = useRef(transcriptLines.length);
  
  useEffect(() => {
    if (activeTab !== 'transcript' && transcriptLines.length > prevTranscriptLengthRef.current) {
      setNewTranscripts(prev => prev + (transcriptLines.length - prevTranscriptLengthRef.current));
    }
    prevTranscriptLengthRef.current = transcriptLines.length;
  }, [transcriptLines, activeTab]);
  
  // Get room ID from URL parameters or generate a default one
  const roomIdFromUrl = searchParams.get('room');
  
  // Generate a unique room name based on the URL parameter or a default
  const roomName = roomIdFromUrl || "interview-room-123";
  
  // Use the user's actual role from their profile
  const userRole = profile?.role === 'candidate' ? 'Candidate' : 'Interviewer';
  const identity = user?.email || `${userRole}-${Date.now()}`;
  
  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);



  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Video Call</h1>
        
        <div className="flex items-center space-x-4">
          {/* User Role Display */}
          <div className="flex items-center space-x-2 bg-dark-secondary px-3 py-1 rounded">
            <UserCog className="w-4 h-4 text-tech-green" />
            <span className="text-xs text-white">
              {userRole}
            </span>
          </div>
          
          {/* Room ID Display */}
          <div className="flex items-center space-x-2 bg-dark-secondary px-3 py-1 rounded">
            <Users className="w-4 h-4 text-tech-green" />
            <span className="text-white font-mono text-xs">Room: {roomName}</span>
          </div>
          
          {/* Timer */}
          <div className="flex items-center space-x-2 bg-dark-secondary px-3 py-1 rounded">
            <Timer className="w-4 h-4 text-tech-green" />
            <span className="text-white font-mono">{formatTime(elapsedTime)}</span>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <Circle className="w-3 h-3 text-tech-green fill-current" />
            <span className="text-tech-green text-sm font-medium">Active</span>
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
      
      <Card className="bg-dark-secondary border-border-dark h-[calc(100%-4rem)]">
        <CardContent className="p-0 h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="bg-dark-primary px-4 py-2 border-b border-border-dark justify-start">
              <TabsTrigger value="video" className="text-white data-[state=active]:bg-dark-secondary">
                <Video className="w-4 h-4 mr-2" />
                Video Call
              </TabsTrigger>
              <TabsTrigger value="transcript" className="text-white data-[state=active]:bg-dark-secondary">
                <FileText className="w-4 h-4 mr-2" />
                Transcript {isRecording && <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                {newTranscripts > 0 && activeTab !== 'transcript' && (
                  <span className="ml-2 bg-tech-green text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {newTranscripts > 9 ? '9+' : newTranscripts}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="video" className="flex-1 p-0 m-0">
              <VideoRoom 
                roomName={roomName} 
                identity={identity}
              />
            </TabsContent>
            
            <TabsContent value="transcript" className="flex-1 p-6 m-0 overflow-auto">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Speech Recognition</h2>
                <div className="p-4 bg-dark-primary rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-3">
                    You are speaking as: <span className="text-tech-green">{userRole}</span>
                  </h3>
                  <SimpleSpeechRecorder 
                    speakerName={userRole}
                    speakerRole={userRole === "Interviewer" ? "Interviewer" : "Candidate"}
                    roomId={roomName}
                  />
                  <p className="mt-4 text-text-secondary text-sm">
                    Note: Speech recognition uses your browser's built-in capabilities. Works best with Chrome, Edge, or Safari. Requires internet connection.
                  </p>
                </div>
              </div>
              
              {/* Transcript View */}
              <TranscriptView className="mt-6" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoCallPage;