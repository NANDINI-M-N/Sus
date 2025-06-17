import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInterview } from '@/contexts/InterviewContext';

// No need to redeclare the types since we now have a proper d.ts file

interface SimpleSpeechRecorderProps {
  speakerName: string;
  speakerRole: 'Interviewer' | 'Candidate';
  roomId: string;
}

export const SimpleSpeechRecorder: React.FC<SimpleSpeechRecorderProps> = ({
  speakerName,
  speakerRole,
  roomId
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const { addTranscriptLine, setIsRecording: setGlobalRecording } = useInterview();
  
  // Initialize component and check browser support
  useEffect(() => {
    // Clear any existing network error state on mount
    setNetworkError(false);
    setIsRecording(false);
    setIsProcessing(false);
    setGlobalRecording(false);
    
    // Check browser support
    checkSupport();
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Cleanup error:', error);
        }
        recognitionRef.current = null;
      }
    };
  }, []);
  
  const checkSupport = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      toast({
        title: 'Speech Recognition Not Supported',
        description: 'Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.',
        variant: 'destructive'
      });
      return false;
    }

    // Don't check navigator.onLine as it's unreliable
    // Let the Web Speech API handle network connectivity
    setIsSupported(true);
    return true;
  };
  
  const startRecording = async () => {
    if (!checkSupport()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Configure recognition for continuous live transcription
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      // Handle speech recognition start
      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsProcessing(false);
        setIsRecording(true);
        setGlobalRecording(true);
        toast({
          title: 'Recording Started',
          description: 'Listening for speech...',
          variant: 'default'
        });
      };
      
      // Handle speech recognition results
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        // Process all results from the current event
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Add final transcripts to the transcript view
        if (finalTranscript.trim()) {
          console.log('Final transcript:', finalTranscript);
          addTranscriptLine({
            speaker: `${speakerName} (${speakerRole})`,
            text: finalTranscript.trim()
          });
          // Clear interim text when we have final results
          setInterimText('');
        }
        
        // Update interim results for real-time display
        if (interimTranscript.trim()) {
          console.log('Interim transcript:', interimTranscript);
          setInterimText(interimTranscript.trim());
        } else if (!finalTranscript.trim()) {
          // Clear interim text if no speech detected
          setInterimText('');
        }
      };
      
      // Handle speech recognition end
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsProcessing(false);
        
        // Only auto-restart if we're still supposed to be recording
        // and the recognition wasn't manually stopped
        if (recognitionRef.current && isRecording && !networkError) {
          console.log('Auto-restarting speech recognition');
          setTimeout(() => {
            if (recognitionRef.current && isRecording) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('Failed to restart recognition:', error);
                setIsRecording(false);
                setGlobalRecording(false);
              }
            }
          }, 500);
        } else {
          setIsRecording(false);
          setGlobalRecording(false);
        }
      };
      
      // Handle speech recognition errors
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        setIsProcessing(false);
        
        if (event.error === 'network') {
          console.log('Network error detected, stopping recognition');
          setNetworkError(true);
          setIsRecording(false);
          setGlobalRecording(false);
          if (recognitionRef.current) {
            recognitionRef.current = null;
          }
          toast({
            title: 'Network Error',
            description: 'Speech recognition requires a stable internet connection. Please check your connection and try again.',
            variant: 'destructive'
          });
        } else if (event.error === 'not-allowed') {
          setIsRecording(false);
          setGlobalRecording(false);
          toast({
            title: 'Microphone Permission Denied',
            description: 'Please allow microphone access to use speech recognition.',
            variant: 'destructive'
          });
        } else if (event.error === 'no-speech') {
          console.log('No speech detected, continuing...');
          // Don't show error for no-speech, just continue
          return;
        } else if (event.error === 'aborted') {
          console.log('Speech recognition was aborted');
          // Don't show error for manual abort
          return;
        } else {
          console.log('Other speech recognition error:', event.error);
          // For other errors, try to continue
          return;
        }
      };
      
      // Store reference and start recognition
      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsProcessing(false);
      toast({
        title: 'Error',
        description: 'Failed to start speech recognition. Please check microphone permissions.',
        variant: 'destructive'
      });
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    
    setIsRecording(false);
    setIsProcessing(false);
    setGlobalRecording(false);
    setInterimText(''); // Clear interim text when stopping
    
    toast({
      title: 'Recording Stopped',
      description: 'Speech recognition has been stopped.',
      variant: 'default'
    });
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const retryConnection = () => {
    // Reset network error state and try to start recording again
    setNetworkError(false);
    setIsRecording(false);
    setIsProcessing(false);
    setGlobalRecording(false);
    
    // Clear any existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Error stopping existing recognition:', error);
      }
      recognitionRef.current = null;
    }
    
    toast({
      title: 'Ready to Try Again',
      description: 'Network error cleared. You can now try recording again.',
      variant: 'default'
    });
  };
  
  // Show network error state
  if (networkError) {
    return (
      <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-red-50">
        <WifiOff className="h-8 w-8 text-red-500" />
        <div className="text-center">
          <p className="text-sm font-medium text-red-700">Network Error</p>
          <p className="text-xs text-red-600">Speech recognition requires internet connection</p>
        </div>
        <Button 
          onClick={retryConnection}
          variant="outline" 
          size="sm"
          className="text-red-700 border-red-300 hover:bg-red-100"
        >
          Retry
        </Button>
      </div>
    );
  }
  
  // Show unsupported browser state
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-yellow-50">
        <MicOff className="h-8 w-8 text-yellow-500" />
        <div className="text-center">
          <p className="text-sm font-medium text-yellow-700">Speech Recognition Not Supported</p>
          <p className="text-xs text-yellow-600">Please use Chrome, Edge, or Safari</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          onClick={toggleRecording}
          disabled={isProcessing}
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          className="flex items-center space-x-2"
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
          <span>
            {isProcessing ? 'Starting...' : isRecording ? 'Stop Recording' : 'Start Recording'}
          </span>
        </Button>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Speaker: {speakerName} ({speakerRole})
        </p>
        {isRecording && (
          <p className="text-xs text-green-600 mt-1">
            🔴 Recording live audio...
          </p>
        )}
        {interimText && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 font-medium mb-1">Live Recognition:</p>
            <p className="text-sm text-blue-800 italic">"{interimText}"</p>
          </div>
        )}
      </div>
    </div>
  );
};