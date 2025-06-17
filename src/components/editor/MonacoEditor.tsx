
import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Card } from '@/components/ui/card';

interface MonacoEditorProps {
  language: string;
  theme: 'vs-dark' | 'light';
  fontSize: number;
  value: string;
  onChange: (value: string) => void;
  onCursorPositionChange: (line: number, column: number) => void;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  language,
  theme,
  fontSize,
  value,
  onChange,
  onCursorPositionChange
}) => {
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsLoading(false);

    // Set up cursor position tracking
    editor.onDidChangeCursorPosition((e) => {
      onCursorPositionChange(e.position.lineNumber, e.position.column);
    });

    // Configure editor options
    editor.updateOptions({
      automaticLayout: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      folding: true,
      foldingStrategy: 'auto',
      showFoldingControls: 'always',
      matchBrackets: 'always',
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      formatOnPaste: true,
      formatOnType: true,
      find: {
        autoFindInSelection: 'never',
        seedSearchStringFromSelection: 'always'
      },
      multiCursorModifier: 'ctrlCmd',
      selectionHighlight: true,
      occurrencesHighlight: 'singleFile'
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save functionality
      const currentValue = editor.getValue();
      localStorage.setItem(`code_${language}`, currentValue);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.getAction('actions.find')?.run();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
      editor.getAction('editor.action.startFindReplaceAction')?.run();
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  // Format code
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  // Expose format function
  useEffect(() => {
    (window as any).formatCode = formatCode;
  }, []);

  if (isLoading) {
    return (
      <Card className="h-full bg-dark-secondary border-border-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-tech-green border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-text-secondary">Loading editor...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-dark-secondary border-border-dark overflow-hidden">
      <Editor
        height="100%"
        language={language}
        theme={theme}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize,
          fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
          fontLigatures: true,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on'
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 border-2 border-tech-green border-t-transparent rounded-full"></div>
          </div>
        }
      />
    </Card>
  );
};
