import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Clock, Cpu, XCircle, CheckCircle } from 'lucide-react';
import { ExecutionResult } from './CodeExecutor';

interface OutputPanelProps {
  isExecuting: boolean;
  executionResult: ExecutionResult | null;
  onClose: () => void;
  onCopyOutput: () => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  isExecuting,
  executionResult,
  onClose,
  onCopyOutput
}) => {
  // Log when component renders or props change
  useEffect(() => {
    console.log('🔵 OutputPanel: Component mounted or props changed', {
      isExecuting,
      hasExecutionResult: !!executionResult,
      executionSuccess: executionResult?.success,
      outputLength: executionResult?.output?.length || 0
    });
    
    if (executionResult) {
      console.log('📄 OutputPanel: Execution result details', {
        output: executionResult.output,
        error: executionResult.error,
        executionTime: executionResult.executionTime,
        hasStackTrace: !!executionResult.stackTrace,
        hasVisualOutput: !!executionResult.visualOutput
      });
    }
    
    return () => {
      console.log('🔴 OutputPanel: Component unmounting');
    };
  }, [isExecuting, executionResult]);

  // Function to format code output with syntax highlighting
  const formatOutput = (output: string) => {
    console.log('🔤 OutputPanel: Formatting output', { 
      outputLength: output?.length || 0,
      output: output?.substring(0, 100) + (output?.length > 100 ? '...' : '')
    });
    
    // If output is empty, return a message
    if (!output || output.trim() === '') {
      return <span className="italic text-text-secondary">No output</span>;
    }

    // Return the formatted output
    return <pre className="text-white whitespace-pre-wrap">{output}</pre>;
  };

  // Function to format error messages
  const formatError = (error: string) => {
    console.log('❌ OutputPanel: Formatting error', { 
      errorLength: error?.length || 0,
      error: error?.substring(0, 100) + (error?.length > 100 ? '...' : '')
    });
    
    // Check if this is a model-related error and format it nicely
    if (error.includes('Model not found') || error.includes('OpenAI API error')) {
      return (
        <div className="bg-red-950/30 p-3 rounded border border-red-600/50">
          <h5 className="text-red-400 font-medium mb-2">AI Execution Error</h5>
          <p className="text-red-300 mb-2">{error}</p>
          <p className="text-xs text-red-400/70">
            The AI code execution engine encountered an error. Please try again in a few moments or contact support if the issue persists.
          </p>
        </div>
      );
    }
    
    return <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>;
  };

  // Function to format execution trace
  const formatStackTrace = (trace: string) => {
    console.log('🔍 OutputPanel: Formatting stack trace', { 
      traceLength: trace?.length || 0
    });
    
    try {
      // Try to parse the trace as JSON for better formatting
      const traceData = JSON.parse(trace);
      return (
        <div className="space-y-2">
          {traceData.map((item: any, index: number) => (
            <div key={index} className="p-2 border border-border-dark rounded">
              <div className="flex justify-between mb-1">
                <span className="text-tech-green">Line {item.line}</span>
                {item.output && <span className="text-yellow-400">Output: {item.output}</span>}
              </div>
              <pre className="text-xs text-text-secondary overflow-auto">
                {JSON.stringify(item.state, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      );
    } catch (e) {
      // If parsing fails, just display as text
      console.log('⚠️ OutputPanel: Failed to parse stack trace as JSON', e);
      return <pre className="text-yellow-400 whitespace-pre-wrap text-xs">{trace}</pre>;
    }
  };

  console.log('🖥️ OutputPanel: Rendering component', { 
    isExecuting, 
    hasExecutionResult: !!executionResult 
  });

  return (
    <div className="h-full border-t border-border-dark bg-dark-primary flex flex-col relative">
      {/* Close button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-text-secondary hover:text-white absolute top-2 right-2 z-10"
        onClick={() => {
          console.log('🔴 OutputPanel: Close button clicked');
          onClose();
        }}
        title="Hide Output Panel"
      >
        ✕
      </Button>
      
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-border-dark">
        <div className="flex items-center space-x-3">
          <h3 className="text-white text-sm font-medium">Output</h3>
          {executionResult && (
            <Badge 
              variant={executionResult.success ? "outline" : "destructive"}
              className={executionResult.success ? "text-tech-green border-tech-green" : ""}
            >
              {executionResult.success ? (
                <><CheckCircle className="w-3 h-3 mr-1" /> Success</>
              ) : (
                <><XCircle className="w-3 h-3 mr-1" /> Error</>
              )}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {executionResult && (
            <>
              <div className="flex items-center space-x-1 text-text-secondary text-xs">
                <Clock className="w-3 h-3" />
                <span>{executionResult.executionTime.toFixed(2)}ms</span>
              </div>
              
              {executionResult.memoryUsage && (
                <div className="flex items-center space-x-1 text-text-secondary text-xs">
                  <Cpu className="w-3 h-3" />
                  <span>{executionResult.memoryUsage.toFixed(2)} KB</span>
                </div>
              )}
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-white h-7"
            onClick={() => {
              console.log('📋 OutputPanel: Copy button clicked');
              onCopyOutput();
            }}
            disabled={!executionResult?.output}
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
        </div>
      </div>
      
      {/* Content - improved layout for resizable panels */}
      <div className="flex-1 overflow-auto p-3">
        {isExecuting ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-tech-green border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-text-secondary">Executing code with AI...</p>
          </div>
        ) : executionResult ? (
          <div className="font-mono text-sm">
            {/* Output section */}
            <div className="mb-4">
              <h4 className="text-text-secondary text-xs uppercase mb-2">Program Output:</h4>
              {executionResult.success 
                ? formatOutput(executionResult.output) 
                : formatError(executionResult.error || 'Unknown error')}
            </div>
            
            {/* Execution trace section */}
            {executionResult.stackTrace && (
              <div className="mt-4 p-3 border border-border-dark rounded bg-dark-secondary">
                <h4 className="text-white text-sm mb-2">Execution Trace:</h4>
                {formatStackTrace(executionResult.stackTrace)}
              </div>
            )}
            
            {/* Visual output section */}
            {executionResult.visualOutput && (
              <div className="mt-4 p-3 border border-border-dark rounded bg-dark-secondary">
                <h4 className="text-white text-sm mb-2">Visual Output:</h4>
                <div dangerouslySetInnerHTML={{ __html: executionResult.visualOutput }} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-text-secondary text-sm italic flex items-center justify-center h-full">
            Run code to see output
          </div>
        )}
      </div>
    </div>
  );
}; 