import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, FileText, Lock } from 'lucide-react';
import { SharedNotesTab } from './communication/SharedNotesTab';
import { PrivateNotesTab } from './communication/PrivateNotesTab';

export const ChatNotesPanel = () => {
  const [unreadNotesCount, setUnreadNotesCount] = React.useState(1);

  return (
    <Card className="h-full bg-dark-secondary border-border-dark flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-dark">
        <h3 className="text-white font-medium">Notes</h3>
        <Button variant="ghost" size="icon" className="text-text-secondary hover:text-white h-8 w-8">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 p-4">
        <Tabs defaultValue="shared-notes" className="h-full flex flex-col">
          <TabsList className="bg-dark-primary border-border-dark mb-4 grid grid-cols-2">
            <TabsTrigger 
              value="shared-notes" 
              className="text-text-secondary data-[state=active]:text-white data-[state=active]:bg-tech-green/20 relative"
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Shared Notes</span>
                {unreadNotesCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-tech-green text-dark-primary text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium">
                    {unreadNotesCount}
                  </div>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="private-notes" 
              className="text-text-secondary data-[state=active]:text-white data-[state=active]:bg-tech-green/20"
            >
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Private</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="shared-notes" className="flex-1">
            <SharedNotesTab onUnreadChange={setUnreadNotesCount} />
          </TabsContent>
          
          <TabsContent value="private-notes" className="flex-1">
            <PrivateNotesTab />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
