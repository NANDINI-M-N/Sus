import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInterview } from '@/contexts/InterviewContext';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

// Add this to make the global variable accessible
declare global {
  interface Window {
    deepgramSocket?: WebSocket;
  }
}

interface DeepgramRecorderProps {
  speakerName: string;
  speakerRole: 'Interviewer' | 'Candidate';
  roomId: string;
}

// Utility function to get WebSocket state as a string
const getWebSocketStateString = (ws: WebSocket | null): string => {
  if (!ws) return 'null';
  
  switch (ws.readyState) {
    case WebSocket.CONNECTING:
      return 'CONNECTING';
    case WebSocket.OPEN:
      return 'OPEN';
    case WebSocket.CLOSING:
      return 'CLOSING';
    case WebSocket.CLOSED:
      return 'CLOSED';
    default:
      return `UNKNOWN (${ws.readyState})`;
  }
};

export const DeepgramRecorder: React.FC<DeepgramRecorderProps> = ({
  speakerName,
  speakerRole,
  roomId
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const deepgramSocketRef = useRef<WebSocket | null>(null);
  const transcriptSocketRef = useRef<WebSocket | null>(null);
  const [transcriptConnected, setTranscriptConnected] = useState(false);
  
  const { toast } = useToast();
  const { setIsRecording: setContextIsRecording, addTranscriptLine } = useInterview();
  
  // Connect to transcript WebSocket on component mount
  useEffect(() => {
    if (!roomId) return;
    
    const wsUrl = API_ENDPOINTS.TRANSCRIPT_WS(roomId);
    console.log(`Attempting to connect to transcript service at: ${wsUrl}`);
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log(`Connected to transcript sharing service for room ${roomId}`);
      setTranscriptConnected(true);
      
      // Send a ping message to verify the connection is working
      try {
        socket.send(JSON.stringify({ type: 'ping' }));
        console.log('Sent ping message to transcript service');
      } catch (pingError) {
        console.error('Error sending ping message:', pingError);
      }
    };
    
    socket.onerror = (error) => {
      console.error('Transcript WebSocket error:', error);
      setTranscriptConnected(false);
      toast({
        title: 'Connection Error',
        description: 'Error connecting to transcript service.',
        variant: 'destructive'
      });
    };
    
    socket.onclose = (event) => {
      console.log(`Transcript WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`);
      setTranscriptConnected(false);
    };
    
    socket.onmessage = (event) => {
      try {
        console.log(`Received message from transcript service: ${event.data.substring(0, 100)}...`);
        const data = JSON.parse(event.data);
        
        if (data.type === 'init') {
          // Initialize with existing transcripts
          console.log(`Received transcript history with ${data.transcripts?.length || 0} entries`);
          
          // Add existing transcripts to the UI
          data.transcripts?.forEach((line: any) => {
            addTranscriptLine({
              speaker: line.speaker,
              text: line.text
            });
          });
        } else if (data.type === 'transcript') {
          // Add new transcript line if it's from another participant
          if (data.line?.speaker !== speakerName) {
            console.log(`Received transcript from ${data.line?.speaker}:`, data.line?.text);
            
            addTranscriptLine({
              speaker: data.line?.speaker,
              text: data.line?.text
            });
          }
        }
      } catch (error) {
        console.error('Error processing transcript message:', error);
      }
    };
    
    transcriptSocketRef.current = socket;
    
    return () => {
      if (transcriptSocketRef.current) {
        transcriptSocketRef.current.close();
        transcriptSocketRef.current = null;
      }
    };
  }, [roomId, toast, speakerName, addTranscriptLine]);
  
  // Check network status
  useEffect(() => {
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
    
    // Initial check
    setNetworkError(!navigator.onLine);
    
    // Add listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isRecording, toast]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);
  
  // Update context isRecording state when local state changes
  useEffect(() => {
    setContextIsRecording(isRecording);
  }, [isRecording, setContextIsRecording]);
  
  // Function to stop recording
  const stopRecording = useCallback(() => {
    console.log('Stopping recording...');
    
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('Stopping MediaRecorder');
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping MediaRecorder:', error);
      }
      mediaRecorderRef.current = null;
    }
    
    // Stop and release media stream
    if (streamRef.current) {
      console.log('Stopping media stream');
      try {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopped track: ${track.kind}`);
        });
      } catch (error) {
        console.error('Error stopping media tracks:', error);
      }
      streamRef.current = null;
    }
    
    // Close Deepgram WebSocket
    if (deepgramSocketRef.current) {
      console.log('Closing Deepgram WebSocket connection');
      
      // Send a finish message to properly close the connection
      if (deepgramSocketRef.current.readyState === WebSocket.OPEN) {
        try {
          deepgramSocketRef.current.send(JSON.stringify({ type: 'CloseStream' }));
        } catch (error) {
          console.error('Error sending close message to Deepgram:', error);
        }
      }
      
      deepgramSocketRef.current.close();
      deepgramSocketRef.current = null;
      window.deepgramSocket = undefined;
    }
    
    setIsRecording(false);
  }, []);
  
  // Function to start recording
  const startRecording = useCallback(async () => {
    if (networkError) {
      toast({
        title: 'Network Error',
        description: 'Cannot start speech recognition without internet connection.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsProcessing(true);
    console.log('Starting recording process...');
    
    try {
      // Stop any existing recording
      stopRecording();
      
      // Get Deepgram token
      console.log('Requesting Deepgram token from server...');
      const tokenResponse = await axios.get(API_ENDPOINTS.DEEPGRAM_TOKEN);
      const { token } = tokenResponse.data;
      
      if (!token) {
        throw new Error('Failed to get Deepgram token');
      }
      
      console.log('Deepgram token received successfully');
      
      // Get microphone access
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      console.log('Microphone access granted');
      streamRef.current = stream;
      
      // Create Deepgram WebSocket connection
      console.log('Creating Deepgram WebSocket connection...');
      const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
        'token',
        token
      ]);
      
      deepgramSocketRef.current = socket;
      window.deepgramSocket = socket; // For debugging
      
      // Set up event handlers for the WebSocket
      socket.onopen = () => {
        console.log('Deepgram WebSocket connection established');
        
        // Configure Deepgram
        socket.send(JSON.stringify({
          type: 'Configure',
          model: 'nova-2',
          language: 'en',
          punctuate: true,
          smart_format: true,
          interim_results: true
        }));
        
        // Create MediaRecorder once the socket is open
        setupMediaRecorder(stream, socket);
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'Results') {
            if (data.channel && data.channel.alternatives && data.channel.alternatives.length > 0) {
              const transcript = data.channel.alternatives[0].transcript;
              
              // Only process non-empty transcripts
              if (transcript && transcript.trim()) {
                console.log(`Transcript (${speakerName}):`, transcript, 'is_final:', data.is_final);
                
                // Only add final transcripts to avoid cluttering the UI with interim results
                if (data.is_final) {
                  // Add to local transcript
                  addTranscriptLine({
                    speaker: speakerName,
                    text: transcript
                  });
                  
                  // Share with other participants
                  if (transcriptSocketRef.current?.readyState === WebSocket.OPEN) {
                    transcriptSocketRef.current.send(JSON.stringify({
                      type: 'transcript',
                      speaker: speakerName,
                      text: transcript
                    }));
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error processing Deepgram message:', error);
        }
      };
      
      socket.onerror = (error) => {
        console.error('Deepgram WebSocket error:', error);
        toast({
          title: 'Connection Error',
          description: 'Error connecting to Deepgram. Please try again.',
          variant: 'destructive'
        });
        stopRecording();
      };
      
      socket.onclose = (event) => {
        console.log(`Deepgram WebSocket closed. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`);
        if (isRecording) {
          stopRecording();
        }
      };
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording Error',
        description: 'Failed to start recording. Please check your microphone permissions.',
        variant: 'destructive'
      });
      
      stopRecording();
    } finally {
      setIsProcessing(false);
    }
  }, [networkError, toast, stopRecording, speakerName, addTranscriptLine]);
  
  // Helper function to set up MediaRecorder
  const setupMediaRecorder = (stream: MediaStream, socket: WebSocket) => {
    // Check for supported MIME types
    let mimeType = 'audio/webm';
    
    // Check if the browser supports the preferred MIME type
    if (!MediaRecorder.isTypeSupported('audio/webm')) {
      console.warn('audio/webm is not supported, trying alternatives');
      if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else {
        mimeType = ''; // Let the browser use its default
      }
    }
    
    console.log(`Creating MediaRecorder with MIME type: ${mimeType || 'default'}`);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: mimeType || undefined
    });
    
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
        socket.send(event.data);
      } else if (socket.readyState !== WebSocket.OPEN) {
        console.warn(`Cannot send audio data, Deepgram WebSocket state: ${getWebSocketStateString(socket)}`);
      }
    };
    
    mediaRecorder.onstart = () => {
      console.log('MediaRecorder started');
      setIsRecording(true);
    };
    
    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
    };
    
    mediaRecorder.onstop = () => {
      console.log('MediaRecorder stopped');
    };
    
    console.log('Starting MediaRecorder...');
    mediaRecorder.start(250); // Send data every 250ms
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
          <span className="w-2 h-2 bg-tech-green rounded-full mr-2 animate-pulse"></span>
          Recording as {speakerName}
        </span>
      )}
      
      {networkError && (
        <span className="ml-3 text-red-500 flex items-center">
          <WifiOff className="w-4 h-4 mr-1" />
          Network error
        </span>
      )}
    </div>
  );
}; 