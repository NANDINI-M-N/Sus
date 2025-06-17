
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Monitor, Chrome, Settings } from 'lucide-react';

interface ScreenShareOption {
  id: string;
  type: 'screen' | 'window' | 'tab';
  title: string;
  preview: string;
}

interface ScreenShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSource: (sourceId: string) => void;
}

export const ScreenShareModal: React.FC<ScreenShareModalProps> = ({
  isOpen,
  onClose,
  onSelectSource,
}) => {
  const mockSources: ScreenShareOption[] = [
    { id: 'screen-1', type: 'screen', title: 'Entire Screen', preview: 'Desktop' },
    { id: 'window-1', type: 'window', title: 'VS Code', preview: 'Visual Studio Code' },
    { id: 'window-2', type: 'window', title: 'Terminal', preview: 'Terminal Window' },
    { id: 'tab-1', type: 'tab', title: 'CodeSignal Tab', preview: 'codesignal.com' },
    { id: 'tab-2', type: 'tab', title: 'Documentation', preview: 'docs.example.com' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'screen': return <Monitor className="w-6 h-6" />;
      case 'window': return <Monitor className="w-6 h-6" />;
      case 'tab': return <Chrome className="w-6 h-6" />;
      default: return <Monitor className="w-6 h-6" />;
    }
  };

  const handleSelect = (sourceId: string) => {
    onSelectSource(sourceId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-secondary border-border-dark max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-white">Choose what to share</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Screen Share Options */}
          <div>
            <h3 className="text-white font-medium mb-3">Select a source to share</h3>
            <div className="grid grid-cols-3 gap-4">
              {mockSources.map((source) => (
                <Card
                  key={source.id}
                  className="bg-dark-primary border-border-dark hover:border-tech-green cursor-pointer transition-colors"
                  onClick={() => handleSelect(source.id)}
                >
                  <div className="p-4 text-center">
                    <div className="w-full h-24 bg-gray-800 rounded mb-3 flex items-center justify-center">
                      <div className="text-tech-green">
                        {getIcon(source.type)}
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="text-text-secondary">
                        {getIcon(source.type)}
                      </div>
                      <span className="text-white text-sm font-medium">{source.title}</span>
                    </div>
                    <p className="text-text-secondary text-xs">{source.preview}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quality Settings */}
          <div className="border-t border-border-dark pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-text-secondary" />
                <div>
                  <p className="text-white text-sm font-medium">Share Settings</p>
                  <p className="text-text-secondary text-xs">Optimize for different content types</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border-border-dark text-text-secondary hover:text-white">
                  Optimize for text
                </Button>
                <Button variant="outline" size="sm" className="border-border-dark text-text-secondary hover:text-white">
                  Optimize for video
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border-dark">
            <Button variant="outline" onClick={onClose} className="border-border-dark text-text-secondary hover:text-white">
              Cancel
            </Button>
            <Button className="bg-tech-green hover:bg-tech-green/80 text-dark-primary">
              Share Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
