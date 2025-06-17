import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInterview } from '@/contexts/InterviewContext';
import { Lock } from 'lucide-react';

export const PrivateNotesTab = () => {
  const { notes, setNotes } = useInterview();

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Private Notes
          <span className="text-xs text-muted-foreground font-normal">
            (only visible to you)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <Textarea
          className="h-full min-h-[200px] resize-none"
          placeholder="Your private notes here..."
          value={notes}
          onChange={handleNotesChange}
        />
      </CardContent>
    </Card>
  );
};
