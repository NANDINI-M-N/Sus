
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Crown, Hand, X } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  role: 'interviewer' | 'candidate' | 'observer';
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor';
  isLocal: boolean;
}

interface ParticipantsListProps {
  participants: Participant[];
  isOpen: boolean;
  onClose: () => void;
  onMuteParticipant: (id: string) => void;
  onRemoveParticipant: (id: string) => void;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  isOpen,
  onClose,
  onMuteParticipant,
  onRemoveParticipant,
}) => {
  if (!isOpen) return null;

  const getConnectionColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-tech-green';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'interviewer': return <Badge className="bg-blue-600 text-white">Interviewer</Badge>;
      case 'candidate': return <Badge className="bg-tech-green text-dark-primary">Candidate</Badge>;
      case 'observer': return <Badge variant="outline" className="border-text-secondary text-text-secondary">Observer</Badge>;
      default: return null;
    }
  };

  return (
    <div className="absolute top-16 right-4 z-40">
      <Card className="w-80 bg-dark-secondary border-border-dark">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Participants ({participants.length})</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-text-secondary hover:text-white h-6 w-6"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 bg-dark-primary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-tech-green rounded-full flex items-center justify-center">
                      <span className="text-dark-primary font-semibold text-sm">
                        {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    {participant.isHandRaised && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Hand className="w-2 h-2 text-black" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium text-sm">
                        {participant.name}
                        {participant.isLocal && ' (You)'}
                      </span>
                      {participant.role === 'interviewer' && (
                        <Crown className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {getRoleBadge(participant.role)}
                      <div className={`w-2 h-2 rounded-full ${
                        participant.connectionQuality === 'excellent' ? 'bg-tech-green' :
                        participant.connectionQuality === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Audio/Video Status */}
                  <div className="flex space-x-1">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${
                      participant.isMuted ? 'bg-red-600' : 'bg-gray-600'
                    }`}>
                      {participant.isMuted ? (
                        <MicOff className="w-3 h-3 text-white" />
                      ) : (
                        <Mic className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${
                      participant.isVideoOff ? 'bg-red-600' : 'bg-gray-600'
                    }`}>
                      {participant.isVideoOff ? (
                        <VideoOff className="w-3 h-3 text-white" />
                      ) : (
                        <Video className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Admin Controls (only show for non-local participants) */}
                  {!participant.isLocal && (
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMuteParticipant(participant.id)}
                        className="h-6 w-6 text-text-secondary hover:text-white"
                      >
                        <MicOff className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveParticipant(participant.id)}
                        className="h-6 w-6 text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
