import React from 'react';
import { ChatNotesPanel } from '@/components/interview/ChatNotesPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, FileText } from 'lucide-react';
import { useInterview } from '@/contexts/InterviewContext';

const ChatPage: React.FC = () => {
  const { notes, setNotes } = useInterview();
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Communication</h1>
      </div>
      
      <Card className="bg-dark-secondary border-border-dark h-[calc(100%-4rem)]">
        <CardContent className="p-0 h-full">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="bg-dark-primary px-4 py-2 border-b border-border-dark justify-start">
              <TabsTrigger value="chat" className="text-white data-[state=active]:bg-dark-secondary">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-white data-[state=active]:bg-dark-secondary">
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 p-0 m-0">
              <ChatNotesPanel />
            </TabsContent>
            
            <TabsContent value="notes" className="flex-1 p-0 m-0">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-border-dark">
                  <h3 className="text-white font-medium">Interview Notes</h3>
                </div>
                <div className="flex-1 p-4 overflow-auto">
                  <textarea 
                    className="w-full h-full bg-dark-primary border-border-dark rounded-md p-4 text-white resize-none focus:outline-none focus:ring-1 focus:ring-tech-green"
                    placeholder="Take notes during the interview..."
                    value={notes}
                    onChange={handleNotesChange}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage; 