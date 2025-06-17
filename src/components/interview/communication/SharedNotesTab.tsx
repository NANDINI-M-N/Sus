import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SharedNotesPanel } from '@/components/interview/SharedNotesPanel';

interface SharedNotesTabProps {
  onUnreadChange: (count: number) => void;
}

export const SharedNotesTab: React.FC<SharedNotesTabProps> = ({ onUnreadChange }) => {
  // Get the roomId from URL parameters
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  
  // Use interview ID from search params or a unique fixed ID instead of default-room
  const interviewId = searchParams.get('id');
  const notesRoomId = roomId || (interviewId ? `interview-notes-${interviewId}` : 'shared-interview-notes-fixed');
  
  // Reset unread count when component mounts
  useEffect(() => {
    onUnreadChange(0);
  }, [onUnreadChange]);

  return (
    <div className="h-full">
      <SharedNotesPanel roomId={notesRoomId} />
    </div>
  );
};
