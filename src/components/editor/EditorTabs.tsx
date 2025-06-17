
import React from 'react';
import { X, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES } from './LanguageSelector';

export interface EditorTab {
  id: string;
  name: string;
  language: string;
  content: string;
  isModified: boolean;
}

interface EditorTabsProps {
  tabs: EditorTab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab
}) => {
  const getLanguageIcon = (languageId: string) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.id === languageId);
    return language?.icon || <FileText className="w-3 h-3" />;
  };

  return (
    <div className="flex items-center bg-dark-primary border-b border-border-dark overflow-x-auto">
      <div className="flex">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 border-r border-border-dark cursor-pointer transition-colors min-w-0 ${
              activeTabId === tab.id
                ? 'bg-dark-secondary text-white border-b-2 border-tech-green'
                : 'text-text-secondary hover:text-white hover:bg-dark-secondary/50'
            }`}
            onClick={() => onTabSelect(tab.id)}
          >
            {getLanguageIcon(tab.language)}
            <span className="text-sm truncate max-w-32">
              {tab.name}
              {tab.isModified && <span className="ml-1 text-yellow-500">•</span>}
            </span>
            {tabs.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 text-text-secondary hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 mx-2 text-text-secondary hover:text-white"
        onClick={onNewTab}
        title="New file"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};
