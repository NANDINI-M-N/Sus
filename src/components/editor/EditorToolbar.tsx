
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Copy, 
  Download, 
  Upload, 
  Undo2, 
  Redo2, 
  Search, 
  Replace,
  Settings,
  Maximize2,
  Sun,
  Moon,
  Play,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';

interface EditorToolbarProps {
  onSave: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onUpload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFind: () => void;
  onReplace: () => void;
  onFormat: () => void;
  onSettings: () => void;
  onFullscreen: () => void;
  onThemeToggle: () => void;
  onExecutionToggle?: () => void;
  theme: 'vs-dark' | 'light';
  isFullscreen: boolean;
  showExecutionPanel?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSave,
  onCopy,
  onDownload,
  onUpload,
  onUndo,
  onRedo,
  onFind,
  onReplace,
  onFormat,
  onSettings,
  onFullscreen,
  onThemeToggle,
  onExecutionToggle,
  theme,
  isFullscreen,
  showExecutionPanel = true
}) => {
  const IconButton: React.FC<{
    icon: React.ReactNode;
    onClick: () => void;
    title: string;
    disabled?: boolean;
    variant?: 'default' | 'ghost';
    className?: string;
  }> = ({ icon, onClick, title, disabled = false, variant = 'ghost', className = '' }) => (
    <Button
      variant={variant}
      size="sm"
      className={`h-8 w-8 p-0 text-text-secondary hover:text-white disabled:opacity-50 ${className}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {icon}
    </Button>
  );

  return (
    <div className="flex items-center gap-1 p-2 bg-dark-primary border-b border-border-dark">
      {/* File Operations */}
      <div className="flex items-center gap-1">
        <IconButton icon={<Save className="w-4 h-4" />} onClick={onSave} title="Save (Ctrl+S)" />
        <IconButton icon={<Copy className="w-4 h-4" />} onClick={onCopy} title="Copy All" />
        <IconButton icon={<Download className="w-4 h-4" />} onClick={onDownload} title="Download" />
        <IconButton icon={<Upload className="w-4 h-4" />} onClick={onUpload} title="Upload File" />
      </div>

      <Separator orientation="vertical" className="h-6 bg-border-dark mx-2" />

      {/* Edit Operations */}
      <div className="flex items-center gap-1">
        <IconButton icon={<Undo2 className="w-4 h-4" />} onClick={onUndo} title="Undo (Ctrl+Z)" />
        <IconButton icon={<Redo2 className="w-4 h-4" />} onClick={onRedo} title="Redo (Ctrl+Y)" />
      </div>

      <Separator orientation="vertical" className="h-6 bg-border-dark mx-2" />

      {/* Search Operations */}
      <div className="flex items-center gap-1">
        <IconButton icon={<Search className="w-4 h-4" />} onClick={onFind} title="Find (Ctrl+F)" />
        <IconButton icon={<Replace className="w-4 h-4" />} onClick={onReplace} title="Replace (Ctrl+H)" />
      </div>

      <Separator orientation="vertical" className="h-6 bg-border-dark mx-2" />

      {/* Format */}
      <IconButton 
        icon={<span className="text-xs font-medium">FMT</span>} 
        onClick={onFormat} 
        title="Format Code (Alt+Shift+F)" 
      />

      <Separator orientation="vertical" className="h-6 bg-border-dark mx-2" />

      {/* Execution Panel Toggle */}
      {onExecutionToggle && (
        <IconButton
          icon={showExecutionPanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          onClick={onExecutionToggle}
          title={showExecutionPanel ? "Hide Execution Panel" : "Show Execution Panel"}
          className="text-tech-green hover:text-tech-green/80"
        />
      )}

      <div className="flex-1" />

      {/* View Options */}
      <div className="flex items-center gap-1">
        <IconButton 
          icon={theme === 'vs-dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} 
          onClick={onThemeToggle} 
          title="Toggle Theme" 
        />
        <IconButton 
          icon={<Maximize2 className="w-4 h-4" />} 
          onClick={onFullscreen} 
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} 
        />
        <IconButton icon={<Settings className="w-4 h-4" />} onClick={onSettings} title="Settings" />
      </div>
    </div>
  );
};
