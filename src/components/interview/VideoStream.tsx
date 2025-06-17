
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface VideoStreamProps {
  name: string;
  initials: string;
  isLocal?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isSpeaking?: boolean;
  connectionQuality?: 'excellent' | 'good' | 'poor';
  className?: string;
}

export const VideoStream: React.FC<VideoStreamProps> = ({
  name,
  initials,
  isLocal = false,
  isMuted = false,
  isVideoOff = false,
  isSpeaking = false,
  connectionQuality = 'good',
  className = '',
}) => {
  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'bg-tech-green';
      case 'good': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`relative bg-dark-primary rounded-lg overflow-hidden ${className}`}>
      {/* Video Content or Avatar */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isVideoOff ? (
          <div className={`w-20 h-20 ${isLocal ? 'bg-blue-500' : 'bg-tech-green'} rounded-full flex items-center justify-center`}>
            <span className="text-white font-semibold text-xl">{initials}</span>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className={`w-20 h-20 ${isLocal ? 'bg-blue-500' : 'bg-tech-green'} rounded-full flex items-center justify-center`}>
              <span className="text-white font-semibold text-xl">{initials}</span>
            </div>
          </div>
        )}
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="absolute inset-0 border-2 border-tech-green rounded-lg animate-pulse" />
      )}

      {/* Name Label */}
      <div className="absolute bottom-3 left-3 bg-black/50 px-3 py-1 rounded">
        <span className="text-white text-sm font-medium">
          {name} {isLocal && '(You)'}
        </span>
      </div>

      {/* Status Indicators */}
      <div className="absolute top-3 right-3 flex space-x-2">
        {/* Connection Quality */}
        <div className={`w-2 h-2 ${getConnectionColor()} rounded-full`} />
        
        {/* Muted Indicator */}
        {isMuted && (
          <Badge variant="destructive" className="text-xs px-1 py-0">
            Muted
          </Badge>
        )}
      </div>

      {/* Video Quality Indicator */}
      {!isVideoOff && (
        <div className="absolute top-3 left-3">
          <div className="flex space-x-1">
            {[1, 2, 3].map((bar) => (
              <div
                key={bar}
                className={`w-1 h-3 rounded ${
                  connectionQuality === 'excellent' || 
                  (connectionQuality === 'good' && bar <= 2) || 
                  (connectionQuality === 'poor' && bar === 1)
                    ? 'bg-tech-green' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
