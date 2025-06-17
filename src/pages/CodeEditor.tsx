
import React from 'react';
import { AdvancedCodeEditor } from '@/components/editor/AdvancedCodeEditor';
import BackButton from '@/components/ui/back-button';

const CodeEditor = () => {
  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="p-4 border-b border-border-dark">
        <div className="flex items-center gap-4">
          <BackButton to="/recruiter-dashboard" />
          <h1 className="text-2xl font-bold text-white">Advanced Code Editor</h1>
        </div>
      </div>
      
      <div className="h-[calc(100vh-80px)]">
        <AdvancedCodeEditor />
      </div>
    </div>
  );
};

export default CodeEditor;
