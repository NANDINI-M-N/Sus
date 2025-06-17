
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VideoRoom } from './VideoRoom';
import { Maximize, Minimize } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';

export const VideoCallPanel = () => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  // Get room ID from URL parameters or generate a default one
  const roomIdFromUrl = searchParams.get('room');
  const roomName = roomIdFromUrl || "interview-room-123";
  
  // Use user identity or fallback
  const identity = user?.email || `user-${Date.now()}`;

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Video Call</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex-1">
        <VideoRoom 
          roomName={roomName}
          identity={identity}
          className="h-full"
        />
      </div>
    </Card>
  );
};
