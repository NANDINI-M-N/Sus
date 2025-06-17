
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SUPPORTED_LANGUAGES } from './LanguageSelector';

interface EditorStatusBarProps {
  language: string;
  cursorLine: number;
  cursorColumn: number;
  totalLines: number;
  characters: number;
  theme: 'vs-dark' | 'light';
  fontSize: number;
}

export const EditorStatusBar: React.FC<EditorStatusBarProps> = ({
  language,
  cursorLine,
  cursorColumn,
  totalLines,
  characters,
  theme,
  fontSize
}) => {
  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.id === language);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-dark-primary border-t border-border-dark text-text-secondary text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {currentLanguage?.icon}
          <span>{currentLanguage?.name || 'Plain Text'}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <span>Ln {cursorLine}, Col {cursorColumn}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span>{totalLines} lines</span>
        <span>{characters} characters</span>
        <span>{fontSize}px</span>
        <Badge variant="outline" className="text-text-secondary border-border-dark">
          {theme === 'vs-dark' ? 'Dark' : 'Light'}
        </Badge>
      </div>
    </div>
  );
};
