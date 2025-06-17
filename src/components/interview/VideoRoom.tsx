import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Video as VideoIcon, 
  VideoOff, 
  Mic, 
  MicOff, 
  ScreenShare, 
  PhoneOff,
  Users,
  Settings,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useInterview } from '@/contexts/InterviewContext';
import { API_ENDPOINTS } from '@/config/api';

// Import Twilio Video dynamically
let Video: any = null;

interface VideoRoomProps {
  roomName: string;
  identity: string;
  onTranscriptUpdate?: (transcript: string) => void;
  className?: string;
}

export const VideoRoom: React.FC<VideoRoomProps> = ({ 
  roomName, 
  identity,
  onTranscriptUpdate,
  className 
}) => {
  const [room, setRoom] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<string>('Checking camera...');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localTracksRef = useRef<any[]>([]);
  const screenTrackRef = useRef<any>(null);
  const { toast } = useToast();
  const { addTranscriptLine } = useInterview();
  
  // Use a ref to store participants to avoid dependency issues
  const participantsRef = useRef<any[]>([]);
  
  // Update the ref whenever participants state changes
  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  // Load Twilio Video on component mount
  useEffect(() => {
    const loadTwilioVideo = async () => {
      try {
        // Only import in browser environment
        if (typeof window !== 'undefined') {
          // Import the module properly
          const twilioModule = await import('twilio-video');
          Video = twilioModule.default || twilioModule;
          console.log('Twilio Video loaded successfully:', !!Video);
          console.log('Twilio Video:', Video);
          
          // Set loading to false once Twilio is loaded
          if (Video) {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error loading Twilio Video:', err);
        setError('Failed to load video library. Please refresh the page.');
        setLoading(false);
      }
    };
    
    loadTwilioVideo();
  }, []);
  
  // Check camera on mount
  useEffect(() => {
    // Direct camera check as a fallback
    const checkCameraDirectly = async () => {
      if (localVideoRef.current) {
        try {
          console.log('Performing direct camera check...');
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          
          // Store the stream temporarily
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(console.error);
          
          setCameraStatus('Direct camera check: Camera working');
          
          // We'll clean this up when Twilio connects
          return stream;
        } catch (err) {
          console.error('Direct camera check failed:', err);
          setCameraStatus('Camera access denied or not available');
          return null;
        }
      }
    };
    
    // Only do the direct check if we don't have Twilio loaded yet
    if (!Video) {
      checkCameraDirectly().then(stream => {
        // The cleanup function
        return () => {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        };
      });
    }
  }, []);
  
  // Join the video room
  useEffect(() => {
    if (!Video) {
      console.log('Twilio Video not loaded yet');
      return;
    }
    
    let localRoom: any = null;
    
    const joinRoom = async () => {
      try {
        console.log('Attempting to join room:', roomName, 'as:', identity);
        
        // Get token from server - hardcoded to use remote URL
        const remoteTokenUrl = 'https://server-faby.onrender.com/api/twilio/token';
        console.log('Requesting token from hardcoded remote URL:', remoteTokenUrl);
        const response = await axios.post(remoteTokenUrl, {
          identity,
          roomName
        });
        
        if (!response.data || !response.data.token) {
          throw new Error('No token received from server');
        }
        
        const { token } = response.data;
        console.log('Received token from server, length:', token.length);
        
        // Connect to the room with options
        const connectOptions = {
          name: roomName,
          audio: true,
          video: { 
            width: 640, 
            height: 480,
            frameRate: 24
          },
          dominantSpeaker: true
        };
        
        console.log('Connecting to room with options:', connectOptions);
        
        // Join the room
        const newRoom = await Video.connect(token, connectOptions);
        console.log('Connected to room:', newRoom.name);
        localRoom = newRoom;
        setRoom(newRoom);
        
        // Handle the LocalParticipant's media
        handleLocalParticipant(newRoom.localParticipant);
        
        // Subscribe to RemoteParticipants already in the Room
        newRoom.participants.forEach((participant: any) => {
          console.log(`Remote participant ${participant.identity} is already connected`);
          handleRemoteParticipantConnected(participant);
        });
        
        // Subscribe to new RemoteParticipants connecting to the Room
        newRoom.on('participantConnected', (participant: any) => {
          console.log(`Remote participant ${participant.identity} connected`);
          handleRemoteParticipantConnected(participant);
          
          // Add to transcript
          addTranscriptLine({
            speaker: 'System',
            text: `${participant.identity} joined the room`
          });
        });
        
        // Handle RemoteParticipants who disconnect
        newRoom.on('participantDisconnected', (participant: any) => {
          console.log(`Remote participant ${participant.identity} disconnected`);
          handleRemoteParticipantDisconnected(participant);
          
          // Add to transcript
          addTranscriptLine({
            speaker: 'System',
            text: `${participant.identity} left the room`
          });
        });
        
        // Handle dominant speaker changes
        newRoom.on('dominantSpeakerChanged', (participant: any) => {
          if (participant) {
            console.log(`Dominant speaker changed to ${participant.identity}`);
          }
        });
        
        // Handle Room disconnection
        newRoom.once('disconnected', (room: any, error: any) => {
          if (error) {
            console.error(`Room disconnected with error: ${error}`);
          }
          
          // Clean up local tracks
          if (localTracksRef.current.length > 0) {
            console.log('Stopping local tracks');
            localTracksRef.current.forEach((track: any) => {
              if (track && typeof track.stop === 'function') {
                track.stop();
              }
            });
            localTracksRef.current = [];
          }
          
          // Clean up screen sharing if active
          if (screenTrackRef.current) {
            console.log('Stopping screen sharing');
            screenTrackRef.current.stop();
            screenTrackRef.current = null;
          }
          
          // Clean up any direct camera access
          if (localVideoRef.current && localVideoRef.current.srcObject) {
            console.log('Cleaning up direct camera access');
            const stream = localVideoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            localVideoRef.current.srcObject = null;
          }
          
          setRoom(null);
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error joining video room:', err);
        setError('Failed to join video room');
        setLoading(false);
        
        toast({
          title: 'Connection Error',
          description: 'Failed to join the video room. Please try again.',
          variant: 'destructive'
        });
      }
    };
    
    joinRoom();
    
    // Cleanup function
    return () => {
      if (localRoom) {
        console.log('Disconnecting from room');
        localRoom.disconnect();
      }
      
      // Clean up any local tracks
      if (localTracksRef.current.length > 0) {
        console.log('Stopping local tracks');
        localTracksRef.current.forEach((track: any) => {
          if (track && typeof track.stop === 'function') {
            track.stop();
          }
        });
        localTracksRef.current = [];
      }
      
      // Clean up screen sharing if active
      if (screenTrackRef.current) {
        console.log('Stopping screen sharing');
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
      
      // Clean up any direct camera access
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        console.log('Cleaning up direct camera access');
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        localVideoRef.current.srcObject = null;
      }
    };
  }, [roomName, identity, Video, toast]);
  
  // Handle local participant
  const handleLocalParticipant = (participant: any) => {
    console.log('Setting up local participant:', participant.identity);
    
    // Get local tracks that were created during connect
    const videoTrackPublications = Array.from(participant.videoTracks.values());
    const audioTrackPublications = Array.from(participant.audioTracks.values());
    
    if (videoTrackPublications.length > 0) {
      const publication: any = videoTrackPublications[0];
      const videoTrack = publication.track;
      if (videoTrack) {
        console.log('Found local video track:', videoTrack);
        localTracksRef.current.push(videoTrack);
        
        // Attach local video - use setTimeout to ensure DOM is ready
        setTimeout(() => {
          if (localVideoRef.current) {
            try {
              console.log('Attaching local video track to element with delay');
              
              // First detach any existing elements
              videoTrack.detach().forEach((element: HTMLVideoElement) => {
                console.log('Detaching existing element:', element);
                element.remove();
              });
              
              // Direct MediaStream approach - most reliable
              console.log('Using MediaStream approach for local video');
              if (videoTrack.mediaStreamTrack) {
                const mediaStream = new MediaStream([videoTrack.mediaStreamTrack]);
                localVideoRef.current.srcObject = mediaStream;
                
                // Force play
                localVideoRef.current.play().catch(err => {
                  console.error('Error playing local video:', err);
                });
                
                setCameraStatus('Camera connected using MediaStream approach');
              } else {
                // Fallback to Twilio's attach method
                videoTrack.attach(localVideoRef.current);
                setCameraStatus('Camera connected using Twilio attach method');
              }
            } catch (err) {
              console.error('Error attaching local video:', err);
              setCameraStatus('Error attaching video: ' + (err as Error).message);
              
              // Last resort fallback - direct getUserMedia
              navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                  console.log('Using direct getUserMedia as fallback');
                  if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.play().catch(console.error);
                    setCameraStatus('Using direct camera access as fallback');
                  }
                })
                .catch(directErr => {
                  console.error('Direct camera access failed:', directErr);
                  setCameraStatus('All video connection methods failed');
                });
            }
          }
        }, 500); // Small delay to ensure DOM is ready
      }
    } else {
      console.warn('No local video track found');
      setCameraStatus('No local video track found');
    }
    
    if (audioTrackPublications.length > 0) {
      const publication: any = audioTrackPublications[0];
      const audioTrack = publication.track;
      if (audioTrack) {
        console.log('Found local audio track');
        localTracksRef.current.push(audioTrack);
      }
    }
    
    // Listen for local track publications
    participant.on('trackPublished', (publication: any) => {
      console.log('Local track published:', publication.trackName);
    });
  };
  
  // Handle remote participant connected
  const handleRemoteParticipantConnected = (participant: any) => {
    console.log(`Setting up remote participant: ${participant.identity}`);
    
    // Add the participant to the state
    setParticipants(prevParticipants => [...prevParticipants, participant]);
    
    // Handle tracks that are already published
    participant.tracks.forEach((publication: any) => {
      handleTrackPublication(publication, participant);
    });
    
    // Handle tracks that will be published later
    participant.on('trackPublished', (publication: any) => {
      console.log('Remote track published:', publication.trackName);
      handleTrackPublication(publication, participant);
    });
  };
  
  // Handle track publication
  const handleTrackPublication = (publication: any, participant: any) => {
    // If the track is already subscribed to, attach it
    if (publication.track) {
      handleTrackSubscribed(publication.track, participant);
    }
    
    // Handle newly subscribed tracks
    publication.on('subscribed', (track: any) => {
      console.log(`Subscribed to ${track.kind} track from ${participant.identity}`);
      handleTrackSubscribed(track, participant);
    });
    
    // Handle track unsubscriptions
    publication.on('unsubscribed', (track: any) => {
      console.log(`Unsubscribed from ${track.kind} track from ${participant.identity}`);
      handleTrackUnsubscribed(track, participant);
    });
  };
  
  // Handle track subscribed
  const handleTrackSubscribed = (track: any, participant: any) => {
    console.log(`Track ${track.kind} subscribed from ${participant.identity}`);
    
    // Find the participant's container in the DOM
    const participantId = participant.sid;
    const participantDiv = document.getElementById(participantId);
    
    if (participantDiv) {
      if (track.kind === 'video') {
        const videoElement = participantDiv.querySelector('video');
        if (videoElement) {
          try {
            // Attach the track to the element without removing existing elements
            const attachedElements = track.attach(videoElement);
            console.log(`Attached ${participant.identity}'s video track to element`);
            
            // Handle video play promise properly
            const playPromise = videoElement.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                console.log(`Remote video playing for ${participant.identity}`);
              }).catch(err => {
                console.error('Error playing remote video:', err);
                // Don't throw error, just log it
              });
            }
          } catch (err) {
            console.error(`Error attaching ${participant.identity}'s video:`, err);
            
            // Try alternative approach
            try {
              console.log('Trying alternative approach for remote video');
              if (track.mediaStreamTrack) {
                const mediaStream = new MediaStream([track.mediaStreamTrack]);
                videoElement.srcObject = mediaStream;
                const playPromise = videoElement.play();
                if (playPromise !== undefined) {
                  playPromise.catch(console.error);
                }
              }
            } catch (altErr) {
              console.error('Alternative approach failed:', altErr);
            }
          }
        } else {
          console.warn(`Video element for ${participant.identity} not found`);
        }
      } else if (track.kind === 'audio') {
        const audioElement = participantDiv.querySelector('audio');
        if (audioElement) {
          try {
            track.attach(audioElement);
            console.log(`Attached ${participant.identity}'s audio track to element`);
          } catch (err) {
            console.error(`Error attaching ${participant.identity}'s audio:`, err);
          }
        } else {
          console.warn(`Audio element for ${participant.identity} not found`);
        }
      }
    } else {
      console.warn(`Participant container for ${participant.identity} not found`);
    }
  };
  
  // Handle track unsubscribed
  const handleTrackUnsubscribed = (track: any, participant: any) => {
    try {
      const detachedElements = track.detach();
      console.log(`Detached ${participant.identity}'s ${track.kind} track from ${detachedElements.length} element(s)`);
      // Don't remove elements, just detach tracks to avoid DOM issues
    } catch (err) {
      console.error(`Error detaching ${participant.identity}'s ${track.kind} track:`, err);
    }
  };
  
  // Handle remote participant disconnected
  const handleRemoteParticipantDisconnected = (participant: any) => {
    console.log(`Cleaning up after participant ${participant.identity}`);
    
    // Remove the participant from the state
    setParticipants(prevParticipants => 
      prevParticipants.filter(p => p.identity !== participant.identity)
    );
  };
  
  // Toggle audio
  const toggleAudio = () => {
    const audioTrack = localTracksRef.current.find((track: any) => track.kind === 'audio');
    
    if (audioTrack) {
      try {
        if (isAudioEnabled) {
          audioTrack.disable();
        } else {
          audioTrack.enable();
        }
        
        setIsAudioEnabled(!isAudioEnabled);
        console.log(`Audio ${!isAudioEnabled ? 'enabled' : 'disabled'}`);
      } catch (err) {
        console.error('Error toggling audio:', err);
      }
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    const videoTrack = localTracksRef.current.find((track: any) => track.kind === 'video');
    
    if (videoTrack) {
      try {
        if (isVideoEnabled) {
          videoTrack.disable();
        } else {
          videoTrack.enable();
        }
        
        setIsVideoEnabled(!isVideoEnabled);
        console.log(`Video ${!isVideoEnabled ? 'enabled' : 'disabled'}`);
      } catch (err) {
        console.error('Error toggling video:', err);
      }
    }
  };
  
  // Toggle screen sharing
  const toggleScreenSharing = async () => {
    if (!Video || !room) {
      return;
    }
    
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenTrackRef.current) {
        room.localParticipant.unpublishTrack(screenTrackRef.current);
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
      setIsScreenSharing(false);
    } else {
      try {
        // Start screen sharing
        const screenTrack = await Video.createLocalVideoTrack({
          name: 'screen',
          video: { 
            frameRate: 15,
            height: 720,
            width: 1280
          }
        });
        
        screenTrackRef.current = screenTrack;
        
        room.localParticipant.publishTrack(screenTrack);
        setIsScreenSharing(true);
        
        // Handle the user ending the screen share
        screenTrack.on('stopped', () => {
          room.localParticipant.unpublishTrack(screenTrackRef.current);
          screenTrackRef.current = null;
          setIsScreenSharing(false);
        });
      } catch (err) {
        console.error('Error sharing screen:', err);
        toast({
          title: 'Screen Sharing Error',
          description: 'Failed to share your screen. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };
  
  // Leave the room
  const leaveRoom = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
    }
    
    toast({
      title: 'Call Ended',
      description: 'You have left the video call.',
    });
  };
  
  // Render participant video
  const renderParticipant = (participant: any) => {
    return (
      <div 
        key={participant.sid} 
        id={participant.sid}
        className="participant-container bg-dark-primary rounded-lg overflow-hidden relative mb-4"
      >
        <div className="video-container h-48 md:h-64">
          <video 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
            data-participant-id={participant.sid}
          />
          <audio 
            autoPlay 
            data-participant-id={participant.sid}
          />
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
          {participant.identity}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-tech-green animate-spin mb-4" />
        <p className="text-white">Connecting to video room...</p>
        <p className="text-text-secondary mt-2">{cameraStatus}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <p className="text-text-secondary mb-4">{cameraStatus}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className={`video-room h-full flex flex-col ${className || ''}`}>
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-auto">
        {/* Local video */}
        <div className="local-participant w-full md:w-1/2">
          <div className="video-container bg-dark-primary rounded-lg overflow-hidden relative">
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-64 object-cover" 
              id="local-video"
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
              You ({identity})
            </div>
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-primary bg-opacity-80">
                <VideoOff className="w-12 h-12 text-text-secondary" />
              </div>
            )}
          </div>
          <div className="mt-2 text-text-secondary text-xs text-center">
            {cameraStatus}
          </div>
        </div>
        
        {/* Remote participants */}
        <div className="remote-participants w-full md:w-1/2">
          {participants.length > 0 ? (
            participants.map(renderParticipant)
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-dark-primary rounded-lg">
              <Users className="w-12 h-12 text-text-secondary mb-2" />
              <p className="text-text-secondary">Waiting for others to join...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Video controls */}
      <div className="video-controls bg-dark-primary border-t border-border-dark p-4 flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${isAudioEnabled ? 'bg-dark-secondary' : 'bg-red-500'}`}
          onClick={toggleAudio}
        >
          {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${isVideoEnabled ? 'bg-dark-secondary' : 'bg-red-500'}`}
          onClick={toggleVideo}
        >
          {isVideoEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${isScreenSharing ? 'bg-tech-green' : 'bg-dark-secondary'}`}
          onClick={toggleScreenSharing}
        >
          <ScreenShare className="h-5 w-5" />
        </Button>
        
        <Button
          variant="destructive"
          size="icon"
          className="rounded-full"
          onClick={leaveRoom}
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default VideoRoom;