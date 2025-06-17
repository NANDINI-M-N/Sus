import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Settings, 
  Copy, 
  RotateCcw, 
  Save, 
  Maximize, 
  Sun, 
  Moon,
  Plus,
  Minus,
  Users,
  History,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  GripHorizontal
} from 'lucide-react';
import { CodeExecutor, ExecutionResult } from '@/components/editor/execution/CodeExecutor';
import { OutputPanel } from '@/components/editor/execution/OutputPanel';
import { useToast } from '@/hooks/use-toast';
import { useInterview } from '@/contexts/InterviewContext';

interface CodeEditorPanelProps {
  onCodeChange?: (code: string, language: string) => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({ onCodeChange }) => {
  const { code: contextCode, language: contextLanguage, setCode: setContextCode, setLanguage: setContextLanguage } = useInterview();
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showOutput, setShowOutput] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  // Suppress Recharts ResponsiveContainer warnings
  useEffect(() => {
    const originalConsoleWarn = console.warn;
    console.warn = function(msg) {
      if (msg && typeof msg === 'string' && msg.includes('ResponsiveContainer')) {
        // Suppress the warning about fixed width/height
        return;
      }
      originalConsoleWarn.apply(console, arguments);
    };
    
    return () => {
      console.warn = originalConsoleWarn;
    };
  }, []);

  // Notify parent component when code or language changes
  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(contextCode, contextLanguage);
    }
  }, [contextCode, contextLanguage, onCodeChange]);

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚡' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
    { value: 'go', label: 'Go', icon: '🐹' }
  ];

  useEffect(() => {
    console.log('🔍 CodeEditorPanel: State changed', { 
      showOutput, 
      isExecuting,
      hasExecutionResult: !!executionResult,
      executionSuccess: executionResult?.success,
      outputLength: executionResult?.output?.length || 0
    });
  }, [showOutput, isExecuting, executionResult]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleRunCode = async () => {
    if (isExecuting) return;
    
    console.log(`🎮 CodeEditorPanel: Run code button clicked for ${contextLanguage}`);
    console.log(`📊 CodeEditorPanel: Code length: ${contextCode.length} characters`);
    
    console.log('📝 CodeEditorPanel: Before state changes', { 
      showOutput, 
      isExecuting, 
      hasExecutionResult: !!executionResult 
    });
    
    // Set initial states
    setIsExecuting(true);
    
    // Make sure output panel is visible
    if (!showOutput) {
      setShowOutput(true);
    }
    
    setExecutionResult(null);
    
    console.log('📝 CodeEditorPanel: After state changes', { 
      showOutput: true, 
      isExecuting: true, 
      hasExecutionResult: false 
    });
    
    try {
      console.log(`🔄 CodeEditorPanel: Getting executor instance`);
      const executor = CodeExecutor.getInstance();
      
      console.log(`⏱️ CodeEditorPanel: Starting code execution at ${new Date().toISOString()}`);
      const executionStartTime = performance.now();
      const result = await executor.executeCode(contextLanguage, contextCode);
      const executionTotalTime = performance.now() - executionStartTime;
      
      console.log(`✅ CodeEditorPanel: Execution completed in ${executionTotalTime.toFixed(2)}ms`);
      console.log(`📋 CodeEditorPanel: Execution result:`, {
        success: result.success,
        outputLength: result.output?.length || 0,
        output: result.output,
        error: result.error,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage,
        hasStackTrace: !!result.stackTrace,
        hasVisualOutput: !!result.visualOutput
      });
      
      // Set execution result first
      console.log('⏳ CodeEditorPanel: Setting execution result');
      setExecutionResult(result);
      console.log('✅ CodeEditorPanel: Result set in state');
      
      // Only after result is set, update isExecuting with a delay
      setTimeout(() => {
        console.log('⌛ CodeEditorPanel: Setting isExecuting to false');
        setIsExecuting(false);
        console.log('✅ CodeEditorPanel: isExecuting set to false');
      }, 300);
      
      toast({
        title: result.success ? "Code Executed Successfully" : "Execution Error",
        description: result.success 
          ? `Completed in ${result.executionTime.toFixed(2)}ms` 
          : result.error || "Unknown error occurred",
        variant: result.success ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error(`❌ CodeEditorPanel: Execution error:`, error);
      
      // Set error result immediately
      console.log('⏳ CodeEditorPanel: Setting error result');
      setExecutionResult({
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: 0
      });
      console.log('✅ CodeEditorPanel: Error result set in state');
      
      // Update isExecuting with a delay
      setTimeout(() => {
        console.log('⌛ CodeEditorPanel: Setting isExecuting to false after error');
        setIsExecuting(false);
        console.log('✅ CodeEditorPanel: isExecuting set to false after error');
      }, 300);
      
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      console.log(`🏁 CodeEditorPanel: Execution flow completed at ${new Date().toISOString()}`);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(contextCode);
    toast({
      title: "Code Copied",
      description: "Code has been copied to clipboard",
    });
  };

  const handleCopyOutput = () => {
    if (executionResult?.output) {
      navigator.clipboard.writeText(executionResult.output);
      toast({
        title: "Output Copied",
        description: "Execution output has been copied to clipboard",
      });
    }
  };

  const handleResetCode = () => {
    const templates = {
      javascript: `// Your solution here
function twoSum(nums, target) {
    // Write your code here
}`,
      python: `# Your solution here
def twoSum(nums, target):
    // Write your code here
    pass`,
      java: `// Your solution here
public int[] twoSum(int[] nums, int target) {
    // Write your code here
}`,
      cpp: `// Your solution here
vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
}`
    };
    setContextCode(templates[contextLanguage as keyof typeof templates] || templates.javascript);
  };

  return (
    <Card className="h-full bg-dark-secondary border-border-dark flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-dark">
        <div className="flex items-center space-x-4">
          <h3 className="text-white font-medium">Code Editor</h3>
          {isCollaborative && (
            <Badge variant="outline" className="text-tech-green border-tech-green">
              <Users className="w-3 h-3 mr-1" />
              Collaborative
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-text-secondary hover:text-white h-8 w-8"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-text-secondary hover:text-white h-8 w-8"
            onClick={() => setIsCollaborative(!isCollaborative)}
          >
            <Users className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-text-secondary hover:text-white h-8 w-8">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border-dark bg-dark-primary">
        <div className="flex items-center space-x-3">
          <Select 
            value={contextLanguage} 
            onValueChange={setContextLanguage}
          >
            <SelectTrigger className="w-[180px] bg-dark-primary border-border-dark">
              <SelectValue placeholder="Select Language" className="text-white" />
            </SelectTrigger>
            <SelectContent className="bg-dark-primary border-border-dark">
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  <div className="flex items-center">
                    <span className="mr-2">{lang.icon}</span>
                    {lang.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Separator orientation="vertical" className="h-6 bg-border-dark" />

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-text-secondary hover:text-white"
              onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
            >
              {theme === 'vs-dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-text-secondary hover:text-white"
              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-text-secondary text-sm px-2">{fontSize}px</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-text-secondary hover:text-white"
              onClick={() => setFontSize(Math.min(20, fontSize + 1))}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border-dark text-text-secondary hover:text-white h-8"
            onClick={handleResetCode}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border-dark text-text-secondary hover:text-white h-8"
            onClick={handleCopyCode}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border-dark text-text-secondary hover:text-white h-8"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            size="sm"
            className="bg-tech-green hover:bg-tech-green/80 text-dark-primary h-8"
            onClick={handleRunCode}
            disabled={isExecuting}
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Code
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!showOutput ? (
          // When output is hidden, show only the editor
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={contextLanguage}
              defaultValue={contextCode}
              theme={theme}
              onChange={(value) => value !== undefined && setContextCode(value)}
              onMount={handleEditorDidMount}
              options={{
                fontSize,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                }
              }}
            />
          </div>
        ) : (
          // When output is shown, use resizable panels
          <ResizablePanelGroup
            direction="vertical"
            className="h-full"
          >
            {/* Code Editor Panel */}
            <ResizablePanel defaultSize={60} minSize={20}>
              <Editor
                height="100%"
                defaultLanguage={contextLanguage}
                defaultValue={contextCode}
                theme={theme}
                onChange={(value) => value !== undefined && setContextCode(value)}
                onMount={handleEditorDidMount}
                options={{
                  fontSize,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto',
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                  }
                }}
              />
            </ResizablePanel>
            
            {/* Resizable Handle */}
            <ResizableHandle 
              withHandle 
              className="bg-border-dark hover:bg-tech-green/20" 
              id="output-resize-handle"
            />
            
            {/* Output Panel */}
            <ResizablePanel defaultSize={40} minSize={20}>
              <OutputPanel
                isExecuting={isExecuting}
                executionResult={executionResult}
                onClose={() => {
                  console.log('🔴 CodeEditorPanel: Output panel close button clicked');
                  setShowOutput(false);
                }}
                onCopyOutput={handleCopyOutput}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </Card>
  );
};
