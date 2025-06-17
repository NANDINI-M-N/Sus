import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInterview } from '@/contexts/InterviewContext';

// Import type definitions from declaration file
// (TypeScript will automatically pick up the types from the .d.ts file)

interface AudioRecorderProps {
  onTranscriptUpdate?: (transcript: string) => void;
  speakerName?: string;
  speakerRole?: 'Interviewer' | 'Candidate';
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTranscriptUpdate,
  speakerName = 'Speaker',
  speakerRole = 'Interviewer'
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  
  const {
    isRecording,
    setIsRecording,
    transcript,
    addTranscriptLine
  } = useInterview();
  
  // Initialize Web Speech API
  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Browser Not Supported',
        description: 'Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.',
        variant: 'destructive'
      });
    }
    
    // Check internet connection
    if (!navigator.onLine) {
      toast({
        title: 'No Internet Connection',
        description: 'Speech recognition requires an internet connection to work properly.',
        variant: 'destructive'
      });
    }
    
    // Add online/offline event listeners
    const handleOnline = () => setNetworkError(false);
    const handleOffline = () => {
      setNetworkError(true);
      if (isRecording) {
        toast({
          title: 'Network Connection Lost',
          description: 'Speech recognition paused due to network issues.',
          variant: 'destructive'
        });
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      stopRecording();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const startRecording = async () => {
    if (networkError) {
      toast({
        title: 'Network Error',
        description: 'Cannot start speech recognition without internet connection.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize Web Speech Recognition
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionConstructor) {
        throw new Error('Speech recognition not supported in this browser');
      }
      
      const recognition = new SpeechRecognitionConstructor();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsRecording(true);
        setIsProcessing(false);
        setRecognitionActive(true);
        setRetryCount(0); // Reset retry count on successful start
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript;
        const isFinal = event.results[lastResultIndex].isFinal;
        
        if (isFinal) {
          // Add to transcript
          addTranscriptLine({
            speaker: speakerName,
            text: transcript
          });
          
          // Call the callback if provided
          if (onTranscriptUpdate) {
            onTranscriptUpdate(transcript);
          }
          
          console.log(`${speakerName}: ${transcript}`);
        }
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'network') {
          setNetworkError(true);
          toast({
            title: 'Network Error',
            description: 'Speech recognition encountered a network error. Please check your internet connection.',
            variant: 'destructive'
          });
          
          // Try to restart if we haven't tried too many times
          if (retryCount < 3 && isRecording) {
            setRetryCount(prev => prev + 1);
            setTimeout(() => {
              if (navigator.onLine && isRecording) {
                try {
                  recognition.start();
                  console.log('Attempting to restart speech recognition...');
                } catch (e) {
                  console.error('Failed to restart recognition:', e);
                }
              }
            }, 3000); // Wait 3 seconds before retrying
          }
        } else if (event.error !== 'no-speech') {
          toast({
            title: 'Recognition Error',
            description: `Speech recognition error: ${event.error}`,
            variant: 'destructive'
          });
        }
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setRecognitionActive(false);
        
        // Restart if still recording (recognition can time out after inactivity)
        if (isRecording && recognitionRef.current && !networkError) {
          try {
            recognitionRef.current.start();
            console.log('Restarting speech recognition after timeout');
          } catch (e) {
            console.log('Could not restart recognition:', e);
          }
        }
      };
      
      // Store reference for cleanup
      recognitionRef.current = recognition;
      
      // Start recognition
      recognition.start();
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording Error',
        description: 'Failed to start recording. Please check your microphone permissions.',
        variant: 'destructive'
      });
      setIsProcessing(false);
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Error stopping recognition:', e);
      }
      recognitionRef.current = null;
    }
    
    setIsRecording(false);
    setRecognitionActive(false);
  };
  
  return (
    <div className="flex items-center">
      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="sm"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing || networkError}
        className={isRecording ? "bg-red-600 hover:bg-red-700" : "border-tech-green text-tech-green hover:bg-tech-green/10"}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Initializing...
          </>
        ) : isRecording ? (
          <>
            <MicOff className="w-4 h-4 mr-2" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Start Recording
          </>
        )}
      </Button>
      
      {isRecording && (
        <span className="ml-3 text-tech-green flex items-center">
          <span className={`w-2 h-2 bg-tech-green rounded-full mr-2 ${recognitionActive ? 'animate-pulse' : ''}`}></span>
          Recording as {speakerName}
        </span>
      )}
      
      {networkError && !isRecording && (
        <span className="ml-3 text-red-500 text-sm">
          Network error - Check connection
        </span>
      )}
    </div>
  );
};

export default AudioRecorder; 