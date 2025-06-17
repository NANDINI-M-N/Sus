
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Mic, MicOff, Video, VideoOff, Settings, LogOut, MessageCircle, Monitor, Users, Hand } from 'lucide-react';

interface VideoControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  isHandRaised: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onToggleHand: () => void;
  onShowParticipants: () => void;
  onLeaveInterview: () => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isMuted,
  isVideoOff,
  isScreenSharing,
  isChatOpen,
  isHandRaised,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onToggleHand,
  onShowParticipants,
  onLeaveInterview,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-dark-secondary/90 backdrop-blur-sm border border-border-dark rounded-lg px-4 py-3">
      <div className="flex items-center space-x-2">
        {/* Microphone Control */}
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="icon"
          onClick={onToggleMute}
          className={`h-10 w-10 ${
            isMuted 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-dark-primary hover:bg-gray-700 text-white"
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        {/* Video Control */}
        <Button
          variant={isVideoOff ? "destructive" : "secondary"}
          size="icon"
          onClick={onToggleVideo}
          className={`h-10 w-10 ${
            isVideoOff 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-dark-primary hover:bg-gray-700 text-white"
          }`}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </Button>

        {/* Screen Share Control */}
        <Button
          variant={isScreenSharing ? "default" : "secondary"}
          size="icon"
          onClick={onToggleScreenShare}
          className={`h-10 w-10 ${
            isScreenSharing 
              ? "bg-tech-green hover:bg-tech-green/80 text-dark-primary" 
              : "bg-dark-primary hover:bg-gray-700 text-white"
          }`}
        >
          <Monitor className="w-5 h-5" />
        </Button>

        {/* Raise Hand */}
        <Button
          variant={isHandRaised ? "default" : "secondary"}
          size="icon"
          onClick={onToggleHand}
          className={`h-10 w-10 ${
            isHandRaised 
              ? "bg-yellow-500 hover:bg-yellow-600 text-black" 
              : "bg-dark-primary hover:bg-gray-700 text-white"
          }`}
        >
          <Hand className="w-5 h-5" />
        </Button>

        {/* Chat Toggle */}
        <Button
          variant={isChatOpen ? "default" : "secondary"}
          size="icon"
          onClick={onToggleChat}
          className={`h-10 w-10 ${
            isChatOpen 
              ? "bg-tech-green hover:bg-tech-green/80 text-dark-primary" 
              : "bg-dark-primary hover:bg-gray-700 text-white"
          }`}
        >
          <MessageCircle className="w-5 h-5" />
        </Button>

        {/* Participants */}
        <Button
          variant="secondary"
          size="icon"
          onClick={onShowParticipants}
          className="h-10 w-10 bg-dark-primary hover:bg-gray-700 text-white"
        >
          <Users className="w-5 h-5" />
        </Button>

        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 bg-dark-primary hover:bg-gray-700 text-white"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-dark-secondary border-border-dark">
            <DropdownMenuItem className="text-white hover:bg-dark-primary">
              Audio Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-dark-primary">
              Video Quality
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-dark-primary">
              Bandwidth
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Leave Interview */}
        <Button
          variant="destructive"
          size="icon"
          onClick={onLeaveInterview}
          className="h-10 w-10 bg-red-600 hover:bg-red-700 text-white ml-2"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
