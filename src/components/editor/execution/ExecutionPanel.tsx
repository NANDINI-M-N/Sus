import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Play, Square, Timer, CheckCircle, XCircle, Terminal, Copy, Trash2 } from 'lucide-react';
import { CodeExecutor, ExecutionResult, TestResult } from './CodeExecutor';
import { TestCaseManager } from './TestCaseManager';
import { ExecutionHistory } from './ExecutionHistory';

interface ExecutionPanelProps {
  language: string;
  code: string;
  isVisible: boolean;
}

export const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  language,
  code,
  isVisible
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState('console');
  const [executionProgress, setExecutionProgress] = useState(0);
  const [executionHistory, setExecutionHistory] = useState<ExecutionResult[]>([]);
  const { toast } = useToast();

  const executor = CodeExecutor.getInstance();

  useEffect(() => {
    // Initialize Pyodide when component mounts if language is Python
    if (language === 'python' && isVisible) {
      executor.initializePyodide().catch(error => {
        console.error('Failed to initialize Python runtime:', error);
        toast({
          title: "Python Runtime",
          description: "Failed to initialize Python runtime. Some features may not work.",
          variant: "destructive",
        });
      });
    }
  }, [language, isVisible]);

  // Add keyboard shortcut for running code
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (!isExecuting && code.trim()) {
          handleRunCode();
        }
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, isExecuting, code]);

  const handleRunCode = async () => {
    if (isExecuting) return;

    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please write some code before running.",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    setExecutionProgress(0);
    
    // Animate progress
    const progressInterval = setInterval(() => {
      setExecutionProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      console.log(`Executing ${language} code:`, code);
      const result = await executor.executeCode(language, code);
      console.log('Execution result:', result);
      
      setExecutionResult(result);
      setActiveTab('console');
      
      // Add to history
      setExecutionHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
      
      // Save to localStorage
      const historyRecord = {
        id: Date.now().toString(),
        timestamp: new Date(),
        language,
        code,
        result
      };
      
      const savedHistory = localStorage.getItem('editor_execution_history');
      const history = savedHistory ? JSON.parse(savedHistory) : [];
      history.unshift(historyRecord);
      localStorage.setItem('editor_execution_history', JSON.stringify(history.slice(0, 50))); // Keep last 50

      toast({
        title: result.success ? "Code Executed" : "Execution Failed",
        description: result.success 
          ? `Completed in ${result.executionTime.toFixed(2)}ms`
          : result.error || "Unknown error occurred",
        variant: result.success ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Execution error:', error);
      const errorResult: ExecutionResult = {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: 0
      };
      setExecutionResult(errorResult);
      
      toast({
        title: "Execution Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setExecutionProgress(100);
      setIsExecuting(false);
      
      // Reset progress after delay
      setTimeout(() => setExecutionProgress(0), 1000);
    }
  };

  const handleRunTests = async (testCases: any[]) => {
    if (isExecuting || testCases.length === 0) return;

    setIsExecuting(true);
    setExecutionProgress(0);

    try {
      const results = await executor.runTestCases(language, code, testCases);
      setTestResults(results);
      setActiveTab('tests');

      const passedCount = results.filter(r => r.passed).length;
      toast({
        title: "Tests Completed",
        description: `${passedCount}/${results.length} tests passed`,
        variant: passedCount === results.length ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Test execution failed:', error);
      toast({
        title: "Test Execution Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
      setExecutionProgress(0);
    }
  };

  const handleStopExecution = () => {
    setIsExecuting(false);
    setExecutionProgress(0);
    toast({
      title: "Execution Stopped",
      description: "Code execution has been terminated",
    });
  };

  const handleClearOutput = () => {
    setExecutionResult(null);
    setTestResults([]);
    toast({
      title: "Output Cleared",
      description: "All execution results have been cleared",
    });
  };

  const handleCopyOutput = () => {
    if (executionResult?.output) {
      navigator.clipboard.writeText(executionResult.output);
      toast({
        title: "Output Copied",
        description: "Execution output copied to clipboard",
      });
    }
  };

  if (!isVisible) return null;

  const passedTests = testResults.filter(result => result.passed).length;
  const totalTests = testResults.length;

  return (
    <Card className="h-full bg-dark-secondary border-border-dark">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Execution Results
            <Badge variant="outline" className="text-xs border-border-dark">
              {language}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleRunCode}
              disabled={isExecuting || !code.trim()}
              className="h-7 px-3 bg-tech-green hover:bg-tech-green/80 disabled:opacity-50"
            >
              <Play className="w-3 h-3 mr-1" />
              {isExecuting ? 'Running...' : 'Run'}
            </Button>
            {isExecuting && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleStopExecution}
                className="h-7 px-3 border-red-500 text-red-500 hover:bg-red-500/10"
              >
                <Square className="w-3 h-3 mr-1" />
                Stop
              </Button>
            )}
            {executionResult && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyOutput}
                className="h-7 px-3 border-border-dark text-text-secondary hover:bg-dark-primary"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearOutput}
              className="h-7 px-3 border-border-dark text-text-secondary hover:bg-dark-primary"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        
        {isExecuting && (
          <div className="mt-2">
            <Progress value={executionProgress} className="h-1" />
            <p className="text-xs text-text-secondary mt-1">
              Executing {language} code... Press Ctrl+Enter to run code quickly.
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-dark-primary border-b border-border-dark rounded-none">
            <TabsTrigger value="console" className="text-xs">
              <Terminal className="w-3 h-3 mr-1" />
              Console
              {executionResult && (
                <Badge 
                  variant={executionResult.success ? "default" : "destructive"} 
                  className="ml-1 h-4 px-1 text-xs"
                >
                  {executionResult.success ? '✓' : '✗'}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Tests {totalTests > 0 && `(${passedTests}/${totalTests})`}
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              <Timer className="w-3 h-3 mr-1" />
              History
            </TabsTrigger>
            <TabsTrigger value="test-editor" className="text-xs">
              Edit Tests
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="console" className="h-full m-0 p-4">
              <ScrollArea className="h-full">
                {executionResult ? (
                  <div className="space-y-4">
                    {/* Execution Status */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={executionResult.success ? "default" : "destructive"}>
                        {executionResult.success ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {executionResult.success ? 'Success' : 'Error'}
                      </Badge>
                      <span className="text-text-secondary text-xs">
                        Executed in {executionResult.executionTime.toFixed(2)}ms
                      </span>
                      <Badge variant="outline" className="text-xs border-border-dark">
                        {language}
                      </Badge>
                    </div>

                    {/* Output */}
                    {executionResult.output && (
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                          Output:
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCopyOutput}
                            className="h-5 w-5 p-0 text-text-secondary hover:text-white"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </h4>
                        <pre className="bg-dark-primary p-3 rounded text-sm text-gray-300 whitespace-pre-wrap border border-border-dark font-mono">
                          {executionResult.output}
                        </pre>
                      </div>
                    )}

                    {/* Error */}
                    {executionResult.error && (
                      <div>
                        <h4 className="text-sm font-medium text-red-400 mb-2">Error:</h4>
                        <pre className="bg-red-950/20 p-3 rounded text-sm text-red-300 whitespace-pre-wrap border border-red-500/20 font-mono">
                          {executionResult.error}
                        </pre>
                      </div>
                    )}

                    {/* Stack Trace */}
                    {executionResult.stackTrace && (
                      <div>
                        <h4 className="text-sm font-medium text-yellow-400 mb-2">Stack Trace:</h4>
                        <pre className="bg-yellow-950/20 p-3 rounded text-xs text-yellow-300 whitespace-pre-wrap border border-yellow-500/20 font-mono">
                          {executionResult.stackTrace}
                        </pre>
                      </div>
                    )}

                    {/* Help Text */}
                    <div className="mt-4 p-3 bg-blue-950/20 rounded border border-blue-500/20">
                      <p className="text-blue-300 text-xs">
                        💡 <strong>Tips:</strong> 
                        Use Ctrl+Enter (Cmd+Enter on Mac) to quickly run your code. 
                        For JavaScript, use console.log() to see output. 
                        For Python, use print() statements.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-text-secondary">
                    <Terminal className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-center mb-2">Ready to execute your {language} code</p>
                    <p className="text-xs text-center opacity-75">
                      Click "Run" or press Ctrl+Enter (Cmd+Enter on Mac)
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="tests" className="h-full m-0 p-4">
              <ScrollArea className="h-full">
                {testResults.length > 0 ? (
                  <div className="space-y-4">
                    {/* Test Summary */}
                    <div className="flex items-center gap-4 p-3 bg-dark-primary rounded border border-border-dark">
                      <div className="flex items-center gap-2">
                        <Badge variant={passedTests === totalTests ? "default" : "destructive"}>
                          {passedTests}/{totalTests} Passed
                        </Badge>
                        <span className="text-text-secondary text-sm">
                          {((passedTests / totalTests) * 100).toFixed(0)}% Success Rate
                        </span>
                      </div>
                    </div>

                    {/* Individual Test Results */}
                    {testResults.map((result, index) => (
                      <div key={index} className="border border-border-dark rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-white">
                            {result.testCase.name || `Test Case ${index + 1}`}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={result.passed ? "default" : "destructive"}>
                              {result.passed ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {result.passed ? 'Pass' : 'Fail'}
                            </Badge>
                            <span className="text-text-secondary text-xs">
                              {result.executionTime.toFixed(2)}ms
                            </span>
                          </div>
                        </div>

                        {result.testCase.description && (
                          <p className="text-text-secondary text-sm mb-3">
                            {result.testCase.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <h5 className="text-white font-medium mb-1">Expected:</h5>
                            <pre className="bg-dark-primary p-2 rounded text-gray-300 whitespace-pre-wrap">
                              {result.testCase.expectedOutput}
                            </pre>
                          </div>
                          <div>
                            <h5 className="text-white font-medium mb-1">Actual:</h5>
                            <pre className={`p-2 rounded whitespace-pre-wrap ${
                              result.passed 
                                ? 'bg-green-950/20 text-green-300' 
                                : 'bg-red-950/20 text-red-300'
                            }`}>
                              {result.actualOutput}
                            </pre>
                          </div>
                        </div>

                        {result.error && (
                          <div className="mt-3">
                            <h5 className="text-red-400 font-medium mb-1 text-xs">Error:</h5>
                            <pre className="bg-red-950/20 p-2 rounded text-xs text-red-300 whitespace-pre-wrap">
                              {result.error}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-text-secondary">
                    No test results yet. Create test cases and run them.
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="history" className="h-full m-0">
              <ExecutionHistory />
            </TabsContent>

            <TabsContent value="test-editor" className="h-full m-0">
              <TestCaseManager onRunTests={handleRunTests} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
