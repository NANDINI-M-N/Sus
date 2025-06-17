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

interface DeepgramAudioRecorderProps {
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

export const DeepgramAudioRecorder: React.FC<DeepgramAudioRecorderProps> = ({
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
  const sessionIdRef = useRef<string | null>(null);
  
  const [transcriptConnected, setTranscriptConnected] = useState(false);
  
  const { toast } = useToast();
  const { setIsRecording: setContextIsRecording, addTranscriptLine } = useInterview();
  
  // Connect to transcript WebSocket on component mount
  useEffect(() => {
    if (!roomId) return;
    
    // Add a flag to prevent multiple connections
    let isConnecting = false;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;
    
    const connectToTranscriptService = () => {
      if (isConnecting || reconnectAttempts >= maxReconnectAttempts) return;
      
      isConnecting = true;
      const wsUrl = API_ENDPOINTS.TRANSCRIPT_WS(roomId);
      
      // Only log on first connection or after max retries
      if (reconnectAttempts === 0 || reconnectAttempts === maxReconnectAttempts - 1) {
        console.log(`Connecting to transcript service for room ${roomId}`);
      }
      
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        // Only log on first successful connection
        if (reconnectAttempts === 0) {
          console.log(`Connected to transcript service`);
        }
        
        setTranscriptConnected(true);
        reconnectAttempts = 0;
        isConnecting = false;
        
        // Send a ping message to verify the connection is working
        try {
          socket.send(JSON.stringify({ type: 'ping' }));
        } catch (pingError) {
          console.error('Error sending ping message:', pingError);
        }
      };
      
      socket.onerror = (error) => {
        console.error('Transcript connection error');
        setTranscriptConnected(false);
        isConnecting = false;
        
        if (reconnectAttempts === 0) {
          toast({
            title: 'Connection Error',
            description: 'Error connecting to transcript service.',
            variant: 'destructive'
          });
        }
      };
      
      socket.onclose = (event) => {
        // Only log on final disconnection
        if (reconnectAttempts >= maxReconnectAttempts - 1) {
          console.log(`Transcript connection closed. Code: ${event.code}`);
        }
        
        setTranscriptConnected(false);
        isConnecting = false;
        transcriptSocketRef.current = null;
        
        // Only attempt reconnect if not a normal closure and under max attempts
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          setTimeout(connectToTranscriptService, 2000); // Wait 2 seconds before reconnecting
        }
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'init') {
            // Initialize with existing transcripts
            const transcriptCount = data.transcripts?.length || 0;
            if (transcriptCount > 0) {
              // Only log once
              if (reconnectAttempts === 0) {
                console.log(`Loaded ${transcriptCount} existing transcript entries`);
              }
              
              // Add existing transcripts to the UI
              data.transcripts?.forEach((line: any) => {
                addTranscriptLine({
                  speaker: line.speaker,
                  text: line.text
                });
              });
            }
          } else if (data.type === 'transcript') {
            // Handle both possible data structures
            const speaker = data.speaker || (data.line && data.line.speaker);
            const text = data.text || (data.line && data.line.text);
            
            if (speaker && speaker !== speakerName && text) {
              console.log(`Received transcript from ${speaker}`);
              
              addTranscriptLine({
                speaker: speaker,
                text: text
              });
            }
          }
        } catch (error) {
          console.error('Error processing transcript message:', error);
        }
      };
      
      transcriptSocketRef.current = socket;
    };
    
    // Initial connection
    connectToTranscriptService();
    
    return () => {
      if (transcriptSocketRef.current) {
        // Use code 1000 for normal closure to prevent reconnection attempts
        transcriptSocketRef.current.close(1000, "Component unmounting");
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
    // Only log if actually stopping something
    if (mediaRecorderRef.current || streamRef.current || deepgramSocketRef.current) {
      console.log('Stopping speech recognition');
    }
    
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping MediaRecorder:', error);
      }
      mediaRecorderRef.current = null;
    }
    
    // Stop and release media stream
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Error stopping media tracks:', error);
      }
      streamRef.current = null;
    }
    
    // Close Deepgram WebSocket
    if (deepgramSocketRef.current) {
      // Send a close message to properly close the connection
      if (deepgramSocketRef.current.readyState === WebSocket.OPEN) {
        try {
          deepgramSocketRef.current.send(JSON.stringify({ type: 'close' }));
        } catch (error) {
          console.error('Error sending close message to Deepgram:', error);
        }
      }
      
      // Use code 1000 for normal closure to prevent logging
      deepgramSocketRef.current.close(1000, "Stopping recording");
      deepgramSocketRef.current = null;
    }
    
    // Reset session ID
    sessionIdRef.current = null;
    
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
    console.log('Starting speech recognition...');
    
    try {
      // Stop any existing recording
      stopRecording();
      
      // Initialize the transcription session with the server
      const sessionResponse = await axios.post(API_ENDPOINTS.DEEPGRAM_STREAM, {
        roomId,
        identity: speakerName
      });
      
      const { sessionId } = sessionResponse.data;
      
      if (!sessionId) {
        throw new Error('Failed to initialize transcription session');
      }
      
      // Store the session ID for later use
      sessionIdRef.current = sessionId;
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      // Create WebSocket connection to our server for Deepgram streaming
      const wsUrl = API_ENDPOINTS.DEEPGRAM_WS(roomId, speakerName, sessionId);
      const socket = new WebSocket(wsUrl);
      
      deepgramSocketRef.current = socket;
      
      // Set up event handlers for the WebSocket
      socket.onopen = () => {
        console.log('Connected to Deepgram WebSocket server');
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'ready') {
            console.log('Deepgram connection is ready, starting audio streaming');
            // Create MediaRecorder once the socket is open and ready
            setupMediaRecorder(stream, socket);
          } else if (data.type === 'transcript') {
            // Handle transcript data from our server
            if (data.line && data.line.text) {
              // Add to local transcript
              addTranscriptLine({
                speaker: data.line.speaker,
                text: data.line.text
              });
            }
          } else if (data.type === 'error') {
            console.error('Deepgram error:', data.message);
            toast({
              title: 'Transcription Error',
              description: data.message || 'An error occurred with the transcription service',
              variant: 'destructive'
            });
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      socket.onerror = (error) => {
        console.error('Deepgram WebSocket connection error');
        toast({
          title: 'Connection Error',
          description: 'Error connecting to transcription service. Please try again.',
          variant: 'destructive'
        });
        stopRecording();
      };
      
      socket.onclose = (event) => {
        // Only log abnormal closures
        if (event.code !== 1000) {
          console.log(`Deepgram WebSocket connection closed. Code: ${event.code}`);
        }
        
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
  }, [networkError, toast, stopRecording, speakerName, roomId, addTranscriptLine]);
  
  // Helper function to set up MediaRecorder
  const setupMediaRecorder = (stream: MediaStream, socket: WebSocket) => {
    // Check for supported MIME types
    let mimeType = 'audio/webm';
    
    // Check if the browser supports the preferred MIME type
    if (!MediaRecorder.isTypeSupported('audio/webm')) {
      if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else {
        mimeType = ''; // Let the browser use its default
      }
    }
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: mimeType || undefined,
      audioBitsPerSecond: 128000
    });
    
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
        socket.send(event.data);
      }
    };
    
    mediaRecorder.onstart = () => {
      setIsRecording(true);
    };
    
    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
    };
    
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

export default DeepgramAudioRecorder; 