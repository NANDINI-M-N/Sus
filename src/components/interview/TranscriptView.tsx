import React, { useEffect, useRef, useState } from 'react';
import { useInterview } from '@/contexts/InterviewContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, ExternalLink } from 'lucide-react';
import { createPaste } from '@/utils/pastebin';
import { useToast } from '@/hooks/use-toast';

interface TranscriptViewProps {
  className?: string;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ className = '' }) => {
  const { transcriptLines, transcript } = useInterview();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [pastebinUrl, setPastebinUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Auto-scroll to bottom when new transcripts arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [transcriptLines]);

  // Function to save transcript to Pastebin
  const saveTopastebin = async () => {
    if (transcriptLines.length === 0) {
      toast({
        title: "No Transcript Available",
        description: "There is no transcript content to save.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    // Format transcript for Pastebin
    const formattedTranscript = transcriptLines.map(line => 
      `[${line.timestamp.toLocaleTimeString()}] ${line.speaker}: ${line.text}`
    ).join('\n\n');
    
    try {
      const url = await createPaste(formattedTranscript, `Interview Transcript - ${new Date().toLocaleString()}`);
      
      if (url) {
        setPastebinUrl(url);
        toast({
          title: "Transcript Saved",
          description: "Your transcript has been saved to Pastebin successfully.",
        });
      } else {
        throw new Error("Failed to create paste");
      }
    } catch (error) {
      console.error("Error saving to Pastebin:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your transcript to Pastebin.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className={`p-4 h-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Interview Transcript</h3>
        
        <div className="flex items-center gap-2">
          {pastebinUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(pastebinUrl, '_blank')}
              className="text-xs gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              View Saved
            </Button>
          )}
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={saveTopastebin}
            disabled={isSaving || transcriptLines.length === 0}
            className="text-xs gap-1"
          >
            <Save className="w-3 h-3" />
            {isSaving ? "Saving..." : "Save to Pastebin"}
          </Button>
        </div>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="h-[calc(100%-3rem)] pr-4">
        {transcriptLines.length === 0 ? (
          <p className="text-text-secondary text-sm italic">
            No transcript available yet. Start recording to capture the conversation.
          </p>
        ) : (
          <div className="space-y-4">
            {transcriptLines.map((line, index) => (
              <div key={index} className="transcript-line">
                <div className="flex items-start gap-2">
                  <span 
                    className={`font-medium ${
                      line.speaker.includes('Interviewer') ? 'text-blue-500' : 'text-green-500'
                    }`}
                  >
                    {line.speaker}:
                  </span>
                  <span className="text-black">{line.text}</span>
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  {line.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default TranscriptView;