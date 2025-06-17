
import { useState, useCallback, useEffect } from 'react';
import { EditorTab } from '@/components/editor/EditorTabs';
import { SUPPORTED_LANGUAGES } from '@/components/editor/LanguageSelector';

interface EditorSettings {
  theme: 'vs-dark' | 'light';
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  autoSave: boolean;
}

const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: 'Monaco',
  tabSize: 2,
  wordWrap: true,
  minimap: true,
  lineNumbers: true,
  autoSave: true
};

export const useEditorStore = () => {
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Initialize with a default tab
  useEffect(() => {
    const savedTabs = localStorage.getItem('editor_tabs');
    const savedActiveTab = localStorage.getItem('editor_active_tab');
    const savedSettings = localStorage.getItem('editor_settings');

    if (savedSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
    }

    if (savedTabs) {
      const parsedTabs = JSON.parse(savedTabs);
      setTabs(parsedTabs);
      if (savedActiveTab && parsedTabs.find((tab: EditorTab) => tab.id === savedActiveTab)) {
        setActiveTabId(savedActiveTab);
      } else if (parsedTabs.length > 0) {
        setActiveTabId(parsedTabs[0].id);
      }
    } else {
      // Create initial tab
      const initialTab: EditorTab = {
        id: 'tab_1',
        name: 'main.js',
        language: 'javascript',
        content: SUPPORTED_LANGUAGES.find(lang => lang.id === 'javascript')?.defaultContent || '',
        isModified: false
      };
      setTabs([initialTab]);
      setActiveTabId(initialTab.id);
    }
  }, []);

  // Save to localStorage when tabs or settings change
  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem('editor_tabs', JSON.stringify(tabs));
    }
  }, [tabs]);

  useEffect(() => {
    if (activeTabId) {
      localStorage.setItem('editor_active_tab', activeTabId);
    }
  }, [activeTabId]);

  useEffect(() => {
    localStorage.setItem('editor_settings', JSON.stringify(settings));
  }, [settings]);

  const createNewTab = useCallback((language: string = 'javascript') => {
    const languageInfo = SUPPORTED_LANGUAGES.find(lang => lang.id === language) || SUPPORTED_LANGUAGES[0];
    const newTab: EditorTab = {
      id: `tab_${Date.now()}`,
      name: `untitled${languageInfo.extension}`,
      language,
      content: languageInfo.defaultContent,
      isModified: false
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    return newTab.id;
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (newTabs.length === 0) {
        // Create a new default tab if all tabs are closed
        const defaultTab: EditorTab = {
          id: 'tab_default',
          name: 'main.js',
          language: 'javascript',
          content: SUPPORTED_LANGUAGES[0].defaultContent,
          isModified: false
        };
        setActiveTabId(defaultTab.id);
        return [defaultTab];
      }
      
      // If closing active tab, switch to another tab
      if (tabId === activeTabId) {
        const currentIndex = prev.findIndex(tab => tab.id === tabId);
        const newActiveIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        setActiveTabId(newTabs[newActiveIndex].id);
      }
      
      return newTabs;
    });
  }, [activeTabId]);

  const updateTabContent = useCallback((tabId: string, content: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, content, isModified: true }
        : tab
    ));
  }, []);

  const updateTabLanguage = useCallback((tabId: string, language: string) => {
    setTabs(prev => prev.map(tab => {
      if (tab.id === tabId) {
        const languageInfo = SUPPORTED_LANGUAGES.find(lang => lang.id === language);
        const extension = languageInfo?.extension || '.txt';
        const newName = tab.name.replace(/\.[^/.]+$/, '') + extension;
        
        return {
          ...tab,
          language,
          name: newName,
          isModified: true
        };
      }
      return tab;
    }));
  }, []);

  const saveTab = useCallback((tabId: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, isModified: false }
        : tab
    ));
    
    // Save content to localStorage with language-specific key
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      localStorage.setItem(`code_${tab.language}`, tab.content);
    }
  }, [tabs]);

  const getCurrentTab = useCallback(() => {
    return tabs.find(tab => tab.id === activeTabId);
  }, [tabs, activeTabId]);

  const updateSettings = useCallback((newSettings: Partial<EditorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const updateCursorPosition = useCallback((line: number, column: number) => {
    setCursorPosition({ line, column });
  }, []);

  return {
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
  };
};
