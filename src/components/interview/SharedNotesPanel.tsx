import React, { useEffect, useState } from 'react';
import { useInterview } from '@/contexts/InterviewContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Share2 } from 'lucide-react';

interface SharedNotesPanelProps {
  roomId: string;
}

export function SharedNotesPanel({ roomId }: SharedNotesPanelProps) {
  const { 
    sharedNotes, 
    setSharedNotes, 
    isEditingSharedNotes, 
    setIsEditingSharedNotes,
    lastSharedNotesUpdate,
    notes,
    setNotes
  } = useInterview();
  
  const { 
    notesSocket, 
    notesConnected, 
    connectNotesSocket, 
    sendNoteUpdate 
  } = useWebSocket();
  
  const { toast } = useToast();
  const [localNotes, setLocalNotes] = useState(sharedNotes);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [activeTab, setActiveTab] = useState<string>('private');
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // Log component mounting and props
  useEffect(() => {
    console.log('SharedNotesPanel: Component mounted', { 
      roomId,
      hasNotesSocket: !!notesSocket,
      notesConnected,
      sharedNotesLength: sharedNotes?.length || 0
    });
    
    return () => {
      console.log('SharedNotesPanel: Component unmounting');
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, []);
  
  // Connect to notes WebSocket on component mount
  useEffect(() => {
    if (roomId) {
      console.log('SharedNotesPanel: Connecting to notes socket for room', roomId);
      setConnectionAttempts(prev => prev + 1);
      
      // Force reconnection to ensure we're using the correct URL
      if (notesSocket) {
        const url = notesSocket.url;
        console.log('SharedNotesPanel: Current notes socket URL:', url);
        
        const isCorrectServer = url.includes('shared-notes-server.onrender.com');
        const roomFromUrl = new URL(url).searchParams.get('room');
        const isCorrectRoom = roomFromUrl === roomId;
        
        if (!isCorrectServer || !isCorrectRoom) {
          console.warn('SharedNotesPanel: Connected to wrong server or room:', {
            url,
            expectedRoom: roomId,
            actualRoom: roomFromUrl,
            isCorrectServer,
            isCorrectRoom
          });
          console.log('SharedNotesPanel: Forcing reconnection to correct server and room...');
          
          // Force reconnection to the correct server
          connectNotesSocket(roomId);
        } else {
          console.log('SharedNotesPanel: Already connected to correct server and room');
        }
      } else {
        console.log('SharedNotesPanel: No existing socket, creating new connection');
        connectNotesSocket(roomId);
      }
    } else {
      console.warn('SharedNotesPanel: No roomId provided, cannot connect to notes socket');
    }
    
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [roomId, connectNotesSocket, notesSocket]);
  
  // Retry connection every 10 seconds if disconnected, up to 5 attempts
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout | null = null;
    
    if (!notesConnected && connectionAttempts < 5) {
      console.log(`SharedNotesPanel: Scheduling automatic reconnection attempt ${connectionAttempts + 1}/5`);
      retryTimeout = setTimeout(() => {
        if (!notesConnected) {
          console.log('SharedNotesPanel: Automatic reconnection attempt');
          handleReconnect();
        }
      }, 10000); // 10 seconds
    }
    
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [notesConnected, connectionAttempts]);
  
  // Log connection status changes
  useEffect(() => {
    console.log('SharedNotesPanel: Connection status changed:', { 
      notesConnected, 
      hasSocket: !!notesSocket,
      socketUrl: notesSocket?.url,
      connectionAttempts
    });
  }, [notesConnected, notesSocket, connectionAttempts]);
  
  // Set up WebSocket message listener
  useEffect(() => {
    if (!notesSocket) {
      console.log('SharedNotesPanel: No notes socket available for message listener');
      return;
    }
    
    console.log('SharedNotesPanel: Setting up message listener');
    
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('SharedNotesPanel: Received WebSocket message:', data);
        
        if (data.type === 'update' && !isEditingSharedNotes) {
          console.log('SharedNotesPanel: Updating shared notes from received message', {
            contentLength: data.content?.length || 0,
            timestamp: data.timestamp,
            isEditingSharedNotes
          });
          setSharedNotes(data.content);
          setLocalNotes(data.content);
        } else if (data.type === 'initial') {
          console.log('SharedNotesPanel: Setting initial shared notes', {
            contentLength: data.content?.length || 0,
            isEmpty: !data.content,
            timestamp: data.timestamp
          });
          setSharedNotes(data.content);
          setLocalNotes(data.content);
          
          // If we received empty content, send our local notes to initialize the room
          if (!data.content && localNotes && localNotes.trim().length > 0) {
            console.log('SharedNotesPanel: Sending initial notes to empty room');
            setTimeout(() => {
              sendNoteUpdate(localNotes);
            }, 500);
          }
        } else if (data.type === 'error') {
          console.error('SharedNotesPanel: Received error from server:', data.message);
          toast({
            title: 'Notes Error',
            description: data.message || 'An error occurred with shared notes',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('SharedNotesPanel: Error parsing notes message:', error);
        console.error('SharedNotesPanel: Raw message data:', event.data);
      }
    };
    
    notesSocket.addEventListener('message', handleMessage);
    
    return () => {
      console.log('SharedNotesPanel: Removing message listener');
      notesSocket.removeEventListener('message', handleMessage);
    };
  }, [notesSocket, isEditingSharedNotes, setSharedNotes, toast, sendNoteUpdate, localNotes, typingTimeout]);
  
  // Handle local note changes with debounce
  const handleSharedNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    console.log('SharedNotesPanel: Shared notes changed', { 
      length: newValue.length,
      isConnected: notesConnected
    });
    
    setLocalNotes(newValue);
    setIsEditingSharedNotes(true);
    
    if (typingTimeout) clearTimeout(typingTimeout);
    
    const timeout = setTimeout(() => {
      console.log('SharedNotesPanel: Debounce timeout triggered, sending update');
      setSharedNotes(newValue);
      
      if (notesConnected) {
        console.log('SharedNotesPanel: Sending note update to server');
        sendNoteUpdate(newValue);
      } else {
        console.warn('SharedNotesPanel: Cannot send update - not connected');
        toast({
          title: 'Connection Issue',
          description: 'Not connected to notes service. Changes may not be saved.',
          variant: 'destructive'
        });
      }
      
      setIsEditingSharedNotes(false);
    }, 500); // 500ms debounce
    
    setTypingTimeout(timeout);
  };
  
  // Handle private notes changes
  const handlePrivateNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  // Manual reconnection function
  const handleReconnect = () => {
    console.log('SharedNotesPanel: Manual reconnection requested');
    setConnectionAttempts(prev => prev + 1);
    if (roomId) {
          // Run diagnostics to check server availability
    checkServerAvailability();
      
      // Force reconnection
      setTimeout(() => {
        console.log('SharedNotesPanel: Forcing reconnection after diagnostics');
        connectNotesSocket(roomId);
        toast({
          title: 'Reconnecting',
          description: 'Attempting to reconnect to notes service...',
        });
      }, 1000);
    }
  };
  
  // Diagnostic function to log connection details
  const handleDiagnostics = () => {
    console.log('SharedNotesPanel: Running diagnostics');
    
    // Check WebSocket status
    if (notesSocket) {
      const readyStateMap = {
        0: 'CONNECTING',
        1: 'OPEN',
        2: 'CLOSING',
        3: 'CLOSED'
      };
      
      console.log('WebSocket Diagnostics:', {
        url: notesSocket.url,
        readyState: notesSocket.readyState,
        readyStateString: readyStateMap[notesSocket.readyState as keyof typeof readyStateMap],
        protocol: notesSocket.protocol,
        extensions: notesSocket.extensions,
        binaryType: notesSocket.binaryType,
        bufferedAmount: notesSocket.bufferedAmount,
        isConnected: notesConnected,
        roomId
      });
      
      // Test sending a ping message
      try {
        if (notesSocket.readyState === WebSocket.OPEN) {
          const pingMessage = JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() });
          notesSocket.send(pingMessage);
          console.log('SharedNotesPanel: Sent diagnostic ping message:', pingMessage);
        } else {
          console.warn('SharedNotesPanel: Cannot send ping - WebSocket not open');
        }
      } catch (error) {
        console.error('SharedNotesPanel: Error sending diagnostic ping:', error);
      }
    } else {
      console.warn('SharedNotesPanel: No WebSocket instance available for diagnostics');
    }
    
    // Check network connectivity
    console.log('SharedNotesPanel: Checking network connectivity');
    if (navigator.onLine) {
      console.log('SharedNotesPanel: Browser reports online status');
    } else {
      console.warn('SharedNotesPanel: Browser reports offline status');
    }
    
    // Check server reachability
    checkServerAvailability();
    
    // Log context state
    console.log('SharedNotesPanel: Context state', {
      isEditingSharedNotes,
      hasSharedNotes: !!sharedNotes,
      sharedNotesLength: sharedNotes?.length || 0,
      hasLastUpdate: !!lastSharedNotesUpdate,
      lastUpdateTime: lastSharedNotesUpdate?.toISOString(),
      connectionAttempts
    });
    
    toast({
      title: 'Diagnostics Run',
      description: 'Check browser console for connection details',
    });
  };
  
  // Check if the server is reachable using the context utility
  const checkServerAvailability = async () => {
    console.log('SharedNotesPanel: Checking server reachability');
    
    try {
      // Use the context utility function from WebSocketContext
      const { checkServerReachability } = useWebSocket();
      const isReachable = await checkServerReachability();
      
      if (isReachable) {
        console.log('SharedNotesPanel: Server is reachable');
        toast({
          title: 'Server Check',
          description: 'Notes server is reachable. Attempting to reconnect...',
        });
      } else {
        console.error('SharedNotesPanel: Server is not reachable');
        toast({
          title: 'Server Unreachable',
          description: 'Cannot connect to notes server. Please try again later.',
          variant: 'destructive'
        });
      }
      
      return isReachable;
    } catch (error) {
      console.error('SharedNotesPanel: Error checking server reachability:', error);
      return false;
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            Notes
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Private notes are only visible to you. Shared notes are visible to all participants.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeTab === 'shared' && (
              <>
                {notesConnected ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Connected
                  </Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Disconnected
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleReconnect}
                      className="h-6 px-2 text-xs"
                    >
                      Reconnect
                    </Button>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDiagnostics}
                  className="h-6 px-2 text-xs"
                >
                  Diagnostics
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <Tabs defaultValue="private" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mb-2">
            <TabsTrigger value="private" className="text-white">Private Notes</TabsTrigger>
            <TabsTrigger value="shared" className="text-white flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Shared Notes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="private" className="flex-grow">
            <Textarea
              className="h-full min-h-[200px] resize-none"
              placeholder="Your private notes here..."
              value={notes}
              onChange={handlePrivateNotesChange}
            />
          </TabsContent>
          
          <TabsContent value="shared" className="flex-grow">
            <Textarea
              className="h-full min-h-[200px] resize-none"
              placeholder="Type shared notes here..."
              value={localNotes}
              onChange={handleSharedNotesChange}
              disabled={!notesConnected}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-muted-foreground">
                {lastSharedNotesUpdate && `Last updated: ${lastSharedNotesUpdate.toLocaleTimeString()}`}
              </div>
              <div className="text-xs text-muted-foreground">
                Room: {roomId}
              </div>
            </div>
            {!notesConnected && (
              <div className="text-xs text-red-500 mt-2">
                Not connected to shared notes service. Reconnecting... (Attempt: {connectionAttempts})
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 