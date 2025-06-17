import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInterview } from '@/contexts/InterviewContext';

// No need to redeclare the types since we now have a proper d.ts file

interface WebSpeechRecorderProps {
  speakerName: string;
  speakerRole: 'Interviewer' | 'Candidate';
  roomId: string;
}

export const WebSpeechRecorder: React.FC<WebSpeechRecorderProps> = ({
  speakerName,
  speakerRole,
  roomId
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const { addTranscriptLine, setIsRecording: setGlobalRecording } = useInterview();
  
  // Check browser support on component mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      toast({
        title: 'Speech Recognition Not Supported',
        description: 'Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.',
        variant: 'destructive'
      });
      return;
    }

    // Check if online
    if (!navigator.onLine) {
      console.log('No internet connection - speech recognition requires internet');
      setNetworkError(true);
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    setNetworkError(false);
    
    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    
    // Configure recognition settings for continuous real-time transcription
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    
    // Remove speechTimeoutLength as it's not a standard property
    // if ('speechTimeoutLength' in recognition) {
    //   recognition.speechTimeoutLength = 10000; // 10 seconds
    // }
    
    // Handle recognition results for real-time transcription
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Add final transcripts to the transcript area
      if (finalTranscript.trim()) {
        console.log('Final transcript:', finalTranscript);
        addTranscriptLine({
          speaker: `${speakerName} (${speakerRole})`,
          text: finalTranscript.trim()
        });
      }
      
      // Log interim results for debugging (these show real-time speech)
      if (interimTranscript.trim()) {
        console.log('Interim transcript:', interimTranscript);
      }
    };
    
    // Handle recognition start
    recognition.onstart = () => {
        console.log('Speech recognition started - onstart event fired');
        console.log('Recognition state:', {
          continuous: recognition.continuous,
          interimResults: recognition.interimResults,
          lang: recognition.lang
        });
        setIsProcessing(false);
        setIsRecording(true);
        setGlobalRecording(true);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended - onend event fired');
        console.log('Recognition ended, current states:', {
          isRecording,
          isProcessing
        });
        setIsProcessing(false);
        setIsRecording(false);
        setGlobalRecording(false);
        // No auto-restart - user must manually start/stop
      };
    
    // Handle recognition errors
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', {
        error: event.error,
        message: event.message,
        timeStamp: event.timeStamp,
        currentState: {
          isRecording,
          isProcessing,
          continuous: recognition.continuous,
          interimResults: recognition.interimResults
        }
      });
      
      if (event.error === 'network') {
          console.log('Network error detected, stopping recognition');
          setNetworkError(true);
          setIsRecording(false);
          setGlobalRecording(false);
          setIsProcessing(false);
          toast({
            title: 'Network Error',
            description: 'Speech recognition requires a stable internet connection. Please check your connection and try again.',
            variant: 'destructive'
          });
        } else if (event.error === 'not-allowed') {
        console.log('Permission denied for microphone access');
        setIsRecording(false);
        setGlobalRecording(false);
        setIsProcessing(false);
        toast({
          title: 'Microphone Permission Denied',
          description: 'Please allow microphone access to use speech recognition.',
          variant: 'destructive'
        });
      } else if (event.error === 'no-speech') {
        // Don't stop recording for no-speech errors - this is normal during pauses
        console.log('No speech detected, but continuing to listen...');
        // Don't change any state - keep listening
      } else if (event.error === 'aborted') {
        // This happens when we manually stop - don't show error
        console.log('Speech recognition was manually stopped');
        setIsRecording(false);
        setIsProcessing(false);
        setGlobalRecording(false);
      } else {
        // For other errors, stop recording and show error
        console.log(`Other recognition error: ${event.error}`);
        setIsRecording(false);
        setGlobalRecording(false);
        setIsProcessing(false);
        toast({
          title: 'Recognition Error',
          description: `Speech recognition error: ${event.error}`,
          variant: 'destructive'
        });
      }
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [speakerName, speakerRole, addTranscriptLine, setGlobalRecording, toast]);
  
  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setNetworkError(false);
    const handleOffline = () => {
      setNetworkError(true);
      toast({
        title: 'Network Error',
        description: 'You are offline. Speech recognition requires an internet connection.',
        variant: 'destructive'
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial network status
    setNetworkError(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);
  
  const startRecording = useCallback(async () => {
    console.log('startRecording called', {
      isSupported,
      hasRecognition: !!recognitionRef.current,
      networkError,
      isRecording,
      onlineStatus: navigator.onLine
    });
    
    // Check internet connection first
    if (!navigator.onLine) {
      console.log('No internet connection detected');
      setNetworkError(true);
      toast({
        title: 'No Internet Connection',
        description: 'Speech recognition requires an internet connection. Please check your connection and try again.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!isSupported) {
      console.log('Speech recognition not supported');
      toast({
        title: 'Not Supported',
        description: 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!recognitionRef.current) {
      console.log('Recognition ref is null');
      return;
    }
    
    if (networkError) {
      console.log('Previous network error detected, clearing and retrying');
      setNetworkError(false);
    }
    
    if (isRecording) {
      console.log('Already recording, stopping first');
      recognitionRef.current.stop();
      return;
    }

    try {
      console.log('Setting processing to true and starting recognition');
      setIsProcessing(true);
      
      // Test connection to Google's speech service
      console.log('Testing speech recognition service...');
      
      // Start recognition immediately
      console.log('Starting speech recognition now');
      recognitionRef.current.start();
      
      toast({
        title: 'Recording Started',
        description: 'Speech recognition is now active. Start speaking to see transcripts.',
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsProcessing(false);
      
      toast({
        title: 'Recording Error',
        description: `Failed to start speech recognition: ${error}`,
        variant: 'destructive'
      });
    }
  }, [isSupported, networkError, toast, isRecording]);
  
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Error stopping recognition:', error);
      }
      
      setIsRecording(false);
      setGlobalRecording(false);
      setIsProcessing(false);
      
      toast({
        title: 'Recording Stopped',
        description: 'Speech recognition has been stopped.',
      });
    }
  }, [setGlobalRecording, toast]);
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  if (!isSupported) {
    return (
      <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
        <WifiOff className="w-5 h-5 text-red-500" />
        <span className="text-red-700 text-sm">
          Speech recognition not supported in this browser
        </span>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          onClick={toggleRecording}
          disabled={isProcessing || networkError}
          className={`flex items-center space-x-2 ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          <span>
            {isProcessing 
              ? 'Starting...' 
              : isRecording 
                ? 'Stop Recording' 
                : 'Start Recording'
            }
          </span>
        </Button>
        
        {isRecording && (
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Listening...</span>
          </div>
        )}
        
        {networkError && (
          <div className="flex items-center justify-between space-x-2 text-red-400 bg-red-900/20 p-3 rounded">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm">Network error - Speech recognition requires internet connection</span>
            </div>
            <button
              onClick={() => {
                setNetworkError(false);
                // Re-initialize if needed
                if (navigator.onLine) {
                  window.location.reload();
                }
              }}
              className="text-xs bg-red-700 hover:bg-red-600 px-2 py-1 rounded"
            >
              Retry
            </button>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-600">
        <p><strong>Speaker:</strong> {speakerName} ({speakerRole})</p>
        <p><strong>Room:</strong> {roomId}</p>
        <p className="mt-2 text-xs">
          Note: Speech recognition uses your browser's built-in capabilities. 
          Works best with Chrome, Edge, or Safari. Requires internet connection.
        </p>
      </div>
    </div>
  );
};

export default WebSpeechRecorder;