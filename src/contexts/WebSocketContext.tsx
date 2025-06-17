import React, { createContext, useContext, useRef, useState, useEffect, ReactNode, useCallback } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

interface WebSocketContextState {
  // Transcript WebSocket
  transcriptSocket: WebSocket | null;
  transcriptConnected: boolean;
  connectTranscriptSocket: (roomId: string) => void;
  disconnectTranscriptSocket: () => void;
  
  // Notes WebSocket
  notesSocket: WebSocket | null;
  notesConnected: boolean;
  connectNotesSocket: (roomId: string) => void;
  disconnectNotesSocket: () => void;
  sendNoteUpdate: (content: string) => void;
  
  // Utility functions
  checkServerReachability: () => Promise<boolean>;
}

const WebSocketContext = createContext<WebSocketContextState | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Transcript WebSocket state
  const transcriptSocketRef = useRef<WebSocket | null>(null);
  const [transcriptConnected, setTranscriptConnected] = useState(false);
  
  // Notes WebSocket state
  const notesSocketRef = useRef<WebSocket | null>(null);
  const [notesConnected, setNotesConnected] = useState(false);
  
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Reconnection state
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notesReconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const notesReconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 2000; // 2 seconds

  // Helper function to get WebSocket state as a string
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

  // Connect to transcript WebSocket - memoized with useCallback
  const connectTranscriptSocket = useCallback((roomId: string) => {
    if (!roomId) return;
    
    // Store the room ID for reconnections
    setCurrentRoomId(roomId);
    
    // Don't reconnect if already connected to the same room
    if (transcriptSocketRef.current?.readyState === WebSocket.OPEN) {
      console.log(`Already connected to transcript service for room ${roomId}`);
      return;
    }
    
    try {
      const wsUrl = API_ENDPOINTS.TRANSCRIPT_WS(roomId);
      console.log(`Attempting to connect to transcript service at: ${wsUrl}`);
      
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log(`Connected to transcript sharing service for room ${roomId}`);
        setTranscriptConnected(true);
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
        
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
          description: 'Error connecting to transcript service. Retrying...',
          variant: 'destructive'
        });
      };
      
      socket.onclose = (event) => {
        console.log(`Transcript WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`);
        setTranscriptConnected(false);
        
        // Attempt to reconnect unless this was a clean close
        if (reconnectAttemptsRef.current < maxReconnectAttempts && event.code !== 1000 && currentRoomId) {
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts}) in ${reconnectDelay}ms...`);
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connectTranscriptSocket(currentRoomId);
          }, reconnectDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error('Maximum reconnection attempts reached. Giving up.');
          toast({
            title: 'Connection Failed',
            description: 'Could not connect to transcript service after multiple attempts.',
            variant: 'destructive'
          });
        }
      };
      
      transcriptSocketRef.current = socket;
    } catch (error) {
      console.error('Error connecting to transcript service:', error);
      setTranscriptConnected(false);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to transcript service.',
        variant: 'destructive'
      });
    }
  }, [toast, currentRoomId]); // Depends on toast and currentRoomId

  // Connect to notes WebSocket - memoized with useCallback
  const connectNotesSocket = useCallback((roomId: string) => {
    if (!roomId) {
      console.warn('WebSocketContext: Cannot connect to notes service - roomId is empty');
      return;
    }
    
    // Store the room ID for reconnections
    setCurrentRoomId(roomId);
    
    // Log the current WebSocket state if it exists
    if (notesSocketRef.current) {
      console.log(`WebSocketContext: Current notes socket state: ${getWebSocketStateString(notesSocketRef.current)}, URL: ${notesSocketRef.current.url}`);
    }
    
    // Don't reconnect if already connected to the same room
    if (notesSocketRef.current?.readyState === WebSocket.OPEN) {
      console.log(`WebSocketContext: Already connected to notes service for room ${roomId}`);
      setNotesConnected(true); // Ensure the connected state is true
      return;
    }
    
    try {
      // Use hardcoded URL directly to prevent any overrides
      const wsUrl = `wss://shared-notes-server.onrender.com/notes?room=${roomId}`;
      console.log(`WebSocketContext: Attempting to connect to notes service at: ${wsUrl}`);
      
      // Close any existing socket before creating a new one
      if (notesSocketRef.current) {
        console.log('WebSocketContext: Closing existing socket before creating new one');
        notesSocketRef.current.close();
        notesSocketRef.current = null;
      }
      
      const socket = new WebSocket(wsUrl);
      notesSocketRef.current = socket;
      
      socket.onopen = () => {
        console.log(`WebSocketContext: Connected to notes sharing service for room ${roomId} at ${wsUrl}`);
        setNotesConnected(true);
        notesReconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
        
        // Send a ping message to verify the connection is working
        try {
          const pingMessage = JSON.stringify({ type: 'ping' });
          socket.send(pingMessage);
          console.log('WebSocketContext: Sent ping message to notes service:', pingMessage);
        } catch (pingError) {
          console.error('WebSocketContext: Error sending ping message:', pingError);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocketContext: Notes WebSocket error:', error);
        // Try to get more details about the error
        console.error('WebSocketContext: Error details:', {
          readyState: socket.readyState,
          readyStateString: getWebSocketStateString(socket),
          url: wsUrl,
          timestamp: new Date().toISOString()
        });
        setNotesConnected(false);
        toast({
          title: 'Connection Error',
          description: 'Error connecting to notes service. Retrying...',
          variant: 'destructive'
        });
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (notesReconnectAttemptsRef.current < 5) {
            console.log(`WebSocketContext: Attempting to reconnect (attempt ${notesReconnectAttemptsRef.current + 1})`);
            notesReconnectAttemptsRef.current++;
            connectNotesSocket(roomId);
          }
        }, 2000);
      };
      
      socket.onclose = (event) => {
        console.log(`WebSocketContext: Notes WebSocket closed with code ${event.code}, reason: ${event.reason || 'No reason provided'}`);
        setNotesConnected(false);
        
        // Attempt to reconnect after a delay if not closed intentionally
        if (event.code !== 1000) {
          setTimeout(() => {
            if (notesReconnectAttemptsRef.current < 5) {
              console.log(`WebSocketContext: Attempting to reconnect after close (attempt ${notesReconnectAttemptsRef.current + 1})`);
              notesReconnectAttemptsRef.current++;
              connectNotesSocket(roomId);
            }
          }, 2000);
        }
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocketContext: Received message from notes service:', data);
          
          // If we receive any message, ensure we're marked as connected
          if (!notesConnected) {
            console.log('WebSocketContext: Received message while marked as disconnected, updating state');
            setNotesConnected(true);
          }
        } catch (error) {
          console.error('WebSocketContext: Error parsing message from notes service:', error, event.data);
        }
      };
    } catch (error) {
      console.error('WebSocketContext: Error creating WebSocket connection:', error);
      setNotesConnected(false);
      
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (notesReconnectAttemptsRef.current < 5) {
          console.log(`WebSocketContext: Attempting to reconnect after error (attempt ${notesReconnectAttemptsRef.current + 1})`);
          notesReconnectAttemptsRef.current++;
          connectNotesSocket(roomId);
        }
      }, 2000);
    }
  }, [toast]);

  // Disconnect from transcript WebSocket - memoized with useCallback
  const disconnectTranscriptSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (transcriptSocketRef.current) {
      console.log('Closing transcript WebSocket connection');
      transcriptSocketRef.current.close(1000, 'Intentional disconnect');
      transcriptSocketRef.current = null;
      setTranscriptConnected(false);
    }
  }, []);

  // Disconnect from notes WebSocket - memoized with useCallback
  const disconnectNotesSocket = useCallback(() => {
    if (notesReconnectTimeoutRef.current) {
      clearTimeout(notesReconnectTimeoutRef.current);
      notesReconnectTimeoutRef.current = null;
    }
    
    if (notesSocketRef.current) {
      console.log('Closing notes WebSocket connection');
      notesSocketRef.current.close(1000, 'Intentional disconnect');
      notesSocketRef.current = null;
      setNotesConnected(false);
    }
  }, []);

  // Send note update - memoized with useCallback
  const sendNoteUpdate = useCallback((content: string) => {
    // Check if the WebSocket is connected to the correct server
    const ensureCorrectServer = () => {
      if (!notesSocketRef.current) {
        console.error('WebSocketContext: Cannot ensure correct server - WebSocket is null');
        return false;
      }
      
      // Extract the hostname from the WebSocket URL
      const url = notesSocketRef.current.url;
      console.log(`WebSocketContext: Checking server URL: ${url}`);
      
      // Extract room ID from URL for debugging
      const roomId = new URL(url).searchParams.get('room');
      console.log(`WebSocketContext: Current room ID from URL: ${roomId}`);
      
      const isCorrectServer = url.includes('shared-notes-server.onrender.com');
      
      if (!isCorrectServer) {
        console.error(`WebSocketContext: WebSocket is connected to wrong server: ${url}`);
        console.log('WebSocketContext: Reconnecting to correct server...');
        
        // Force reconnection to correct server
        if (notesSocketRef.current) {
          notesSocketRef.current.close();
          notesSocketRef.current = null;
        }
        
        if (currentRoomId) {
          connectNotesSocket(currentRoomId);
        }
        
        return false;
      }
      
      console.log('WebSocketContext: Connected to correct server');
      return true;
    };
    
    if (!notesSocketRef.current) {
      console.error('WebSocketContext: Cannot send note update: WebSocket is null');
      return;
    }
    
    if (notesSocketRef.current.readyState !== WebSocket.OPEN) {
      console.error(`WebSocketContext: Cannot send note update: WebSocket not connected (state: ${getWebSocketStateString(notesSocketRef.current)})`);
      return;
    }
    
    // Ensure we're connected to the correct server before sending
    if (!ensureCorrectServer()) {
      console.error('WebSocketContext: Cannot send note update: Connected to wrong server');
      return;
    }
    
    try {
      const message = JSON.stringify({
        type: 'update',
        content,
        timestamp: new Date().toISOString()
      });
      
      console.log('WebSocketContext: Sending note update', { 
        contentLength: content.length,
        timestamp: new Date().toISOString(),
        roomId: new URL(notesSocketRef.current.url).searchParams.get('room'),
        readyState: getWebSocketStateString(notesSocketRef.current)
      });
      notesSocketRef.current.send(message);
    } catch (error) {
      console.error('WebSocketContext: Error sending note update:', error);
    }
  }, [currentRoomId, connectNotesSocket]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnectTranscriptSocket();
      disconnectNotesSocket();
      setCurrentRoomId(null);
    };
  }, [disconnectTranscriptSocket, disconnectNotesSocket]);

  // Create a context value that directly exposes the refs
  const contextValue = {
    transcriptSocket: transcriptSocketRef.current,
    transcriptConnected,
    connectTranscriptSocket,
    disconnectTranscriptSocket,
    
    notesSocket: notesSocketRef.current,
    notesConnected,
    connectNotesSocket,
    disconnectNotesSocket,
    sendNoteUpdate,
    
    // Utility functions
    checkServerReachability: async () => {
      console.log('WebSocketContext: Checking server reachability');
      
      try {
        // First try a simple fetch to the server's health endpoint
        const healthResponse = await fetch('https://shared-notes-server.onrender.com/health', { 
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache'
        });
        
        if (healthResponse.ok) {
          console.log('WebSocketContext: Server health check successful');
          return true;
        }
        
        console.warn('WebSocketContext: Server health check failed with status:', healthResponse.status);
        
        // If health check fails, try creating a test WebSocket connection
        return new Promise((resolve) => {
          console.log('WebSocketContext: Testing WebSocket connection directly');
          const testRoom = `test-${Date.now()}`;
          const testSocket = new WebSocket(`wss://shared-notes-server.onrender.com/notes?room=${testRoom}`);
          
          // Set a timeout to avoid hanging indefinitely
          const timeout = setTimeout(() => {
            console.error('WebSocketContext: WebSocket connection test timed out');
            testSocket.close();
            resolve(false);
          }, 5000);
          
          testSocket.onopen = () => {
            console.log('WebSocketContext: Test WebSocket connection successful');
            clearTimeout(timeout);
            testSocket.close(1000, 'Test complete');
            resolve(true);
          };
          
          testSocket.onerror = (error) => {
            console.error('WebSocketContext: Test WebSocket connection error:', error);
            clearTimeout(timeout);
            resolve(false);
          };
        });
      } catch (error) {
        console.error('WebSocketContext: Error checking server reachability:', error);
        return false;
      }
    }
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}; 