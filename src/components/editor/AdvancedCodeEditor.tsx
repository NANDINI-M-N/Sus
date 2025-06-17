import React, { useState, useCallback, useRef } from 'react';
import { MonacoEditor } from './MonacoEditor';
import { LanguageSelector } from './LanguageSelector';
import { EditorTabs } from './EditorTabs';
import { EditorToolbar } from './EditorToolbar';
import { EditorStatusBar } from './EditorStatusBar';
import { EditorSettings } from './EditorSettings';
import { ExecutionPanel } from './execution/ExecutionPanel';
import { useEditorStore } from '@/hooks/useEditorStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';

export const AdvancedCodeEditor: React.FC = () => {
  const {
    tabs,
    activeTabId,
    settings,
    cursorPosition,
    createNewTab,
    closeTab,
    setActiveTabId,
    updateTabContent,
    updateTabLanguage,
    saveTab,
    getCurrentTab,
    updateSettings,
    updateCursorPosition
  } = useEditorStore();

  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showExecutionPanel, setShowExecutionPanel] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorInstanceRef = useRef<any>(null);

  const currentTab = getCurrentTab();

  const handleEditorChange = useCallback((value: string) => {
    if (currentTab) {
      updateTabContent(currentTab.id, value);
    }
  }, [currentTab, updateTabContent]);

  const handleLanguageChange = useCallback((language: string) => {
    if (currentTab) {
      updateTabLanguage(currentTab.id, language);
    }
  }, [currentTab, updateTabLanguage]);

  const handleSave = useCallback(() => {
    if (currentTab) {
      saveTab(currentTab.id);
    }
  }, [currentTab, saveTab]);

  const handleCopy = useCallback(() => {
    if (currentTab?.content) {
      navigator.clipboard.writeText(currentTab.content);
    }
  }, [currentTab]);

  const handleDownload = useCallback(() => {
    if (currentTab) {
      const blob = new Blob([currentTab.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentTab.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [currentTab]);

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const extension = file.name.split('.').pop()?.toLowerCase();
        
        // Determine language from file extension
        let language = 'javascript';
        switch (extension) {
          case 'py': language = 'python'; break;
          case 'java': language = 'java'; break;
          case 'cpp': case 'cc': case 'cxx': language = 'cpp'; break;
          case 'go': language = 'go'; break;
          case 'ts': language = 'typescript'; break;
          case 'html': language = 'html'; break;
          case 'css': language = 'css'; break;
          case 'json': language = 'json'; break;
          default: language = 'javascript';
        }

        const newTabId = createNewTab(language);
        updateTabContent(newTabId, content);
      };
      reader.readAsText(file);
    }
    // Reset input
    event.target.value = '';
  }, [createNewTab, updateTabContent]);

  const handleUndo = useCallback(() => {
    // Monaco editor handles undo internally with Ctrl+Z
    console.log('Undo triggered');
  }, []);

  const handleRedo = useCallback(() => {
    // Monaco editor handles redo internally with Ctrl+Y
    console.log('Redo triggered');
  }, []);

  const handleFind = useCallback(() => {
    // Monaco editor handles find internally with Ctrl+F
    console.log('Find triggered');
  }, []);

  const handleReplace = useCallback(() => {
    // Monaco editor handles replace internally with Ctrl+H
    console.log('Replace triggered');
  }, []);

  const handleFormat = useCallback(() => {
    // Trigger format via global function set by MonacoEditor
    if ((window as any).formatCode) {
      (window as any).formatCode();
    }
  }, []);

  const handleThemeToggle = useCallback(() => {
    updateSettings({ theme: settings.theme === 'vs-dark' ? 'light' : 'vs-dark' });
  }, [settings.theme, updateSettings]);

  const handleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleExecutionToggle = useCallback(() => {
    setShowExecutionPanel(!showExecutionPanel);
  }, [showExecutionPanel]);

  if (!currentTab) {
    return <div>Loading...</div>;
  }

  const totalLines = currentTab.content.split('\n').length;
  const characters = currentTab.content.length;

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'} bg-dark-primary text-white flex flex-col`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".js,.ts,.py,.java,.cpp,.go,.html,.css,.json,.txt"
        onChange={handleFileUpload}
      />

      {/* Editor Toolbar */}
      <EditorToolbar
        onSave={handleSave}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onUpload={handleUpload}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onFind={handleFind}
        onReplace={handleReplace}
        onFormat={handleFormat}
        onSettings={() => setShowSettings(true)}
        onFullscreen={handleFullscreen}
        onThemeToggle={handleThemeToggle}
        theme={settings.theme}
        isFullscreen={isFullscreen}
        onExecutionToggle={handleExecutionToggle}
        showExecutionPanel={showExecutionPanel}
      />

      {/* Editor Tabs */}
      <EditorTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={setActiveTabId}
        onTabClose={closeTab}
        onNewTab={() => createNewTab()}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 border-r border-border-dark flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-border-dark">
              <h3 className="text-white font-medium">Languages</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(false)}
                className="h-6 w-6 p-0"
              >
                <PanelLeftClose className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 p-3">
              <LanguageSelector
                selectedLanguage={currentTab.language}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          </div>
        )}

        {/* Sidebar Toggle (when hidden) */}
        {!showSidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(true)}
            className="absolute top-16 left-2 z-10 h-8 w-8 p-0 bg-dark-secondary border border-border-dark"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </Button>
        )}

        {/* Editor */}
        <div className={`flex-1 flex ${showExecutionPanel ? 'flex-col' : ''}`}>
          <div className={`${showExecutionPanel ? 'flex-1' : 'w-full'} flex flex-col`}>
            <MonacoEditor
              language={currentTab.language}
              theme={settings.theme}
              fontSize={settings.fontSize}
              value={currentTab.content}
              onChange={handleEditorChange}
              onCursorPositionChange={updateCursorPosition}
            />
          </div>

          {/* Execution Panel */}
          {showExecutionPanel && (
            <div className="h-80 border-t border-border-dark relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExecutionPanel(false)}
                className="absolute top-2 right-2 z-10 h-6 w-6 p-0 bg-dark-secondary border border-border-dark"
              >
                <PanelRightClose className="w-3 h-3" />
              </Button>
              <ExecutionPanel
                language={currentTab.language}
                code={currentTab.content}
                isVisible={showExecutionPanel}
              />
            </div>
          )}
        </div>

        {/* Execution Panel Toggle (when hidden) */}
        {!showExecutionPanel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExecutionPanel(true)}
            className="absolute bottom-16 right-2 z-10 h-8 w-8 p-0 bg-dark-secondary border border-border-dark"
          >
            <PanelRightOpen className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Status Bar */}
      <EditorStatusBar
        language={currentTab.language}
        cursorLine={cursorPosition.line}
        cursorColumn={cursorPosition.column}
        totalLines={totalLines}
        characters={characters}
        theme={settings.theme}
        fontSize={settings.fontSize}
      />

      {/* Settings Modal */}
      <EditorSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={updateSettings}
      />
    </div>
  );
};
