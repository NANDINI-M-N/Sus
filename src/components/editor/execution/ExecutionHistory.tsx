import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Timer, CheckCircle, XCircle, Play } from 'lucide-react';
import { ExecutionResult } from './CodeExecutor';

interface ExecutionRecord {
  id: string;
  timestamp: Date;
  language: string;
  code: string;
  result: ExecutionResult;
}

export const ExecutionHistory: React.FC = () => {
  const [history, setHistory] = useState<ExecutionRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ExecutionRecord | null>(null);

  useEffect(() => {
    // Load history from localStorage
    const saved = localStorage.getItem('editor_execution_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load execution history:', error);
      }
    }
  }, []);

  const clearHistory = () => {
    setHistory([]);
    setSelectedRecord(null);
    localStorage.removeItem('editor_execution_history');
  };

  const rerunExecution = (record: ExecutionRecord) => {
    // This would integrate with the main execution system
    console.log('Re-running execution:', record);
    // For now, just show the details
    setSelectedRecord(record);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-secondary p-8">
        <Timer className="w-12 h-12 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No Execution History</h3>
        <p className="text-sm text-center">
          Your code execution history will appear here after you run some code.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* History List */}
      <div className="w-1/2 border-r border-border-dark">
        <div className="p-4 border-b border-border-dark">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Execution History</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={clearHistory}
              className="h-7 px-3 border-border-dark text-text-secondary hover:bg-dark-primary"
            >
              Clear All
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="p-2 space-y-2">
            {history.map((record) => (
              <Card
                key={record.id}
                className={`cursor-pointer transition-colors ${
                  selectedRecord?.id === record.id
                    ? 'bg-tech-green/20 border-tech-green/50'
                    : 'bg-dark-secondary border-border-dark hover:bg-dark-primary'
                }`}
                onClick={() => setSelectedRecord(record)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-border-dark text-text-secondary">
                        {record.language}
                      </Badge>
                      <Badge variant={record.result.success ? "default" : "destructive"}>
                        {record.result.success ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {record.result.success ? 'Success' : 'Error'}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        rerunExecution(record);
                      }}
                      className="h-6 w-6 p-0 text-text-secondary hover:text-white"
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="text-xs text-text-secondary mb-1">
                    {formatTimestamp(record.timestamp)}
                  </div>

                  <div className="text-xs text-gray-300">
                    Execution time: {record.result.executionTime.toFixed(2)}ms
                  </div>

                  {record.result.output && (
                    <div className="mt-2">
                      <pre className="text-xs text-gray-400 truncate">
                        {record.result.output.substring(0, 50)}
                        {record.result.output.length > 50 ? '...' : ''}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Details Panel */}
      <div className="w-1/2">
        {selectedRecord ? (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border-dark">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">Execution Details</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-border-dark text-text-secondary">
                    {selectedRecord.language}
                  </Badge>
                  <Badge variant={selectedRecord.result.success ? "default" : "destructive"}>
                    {selectedRecord.result.success ? 'Success' : 'Error'}
                  </Badge>
                </div>
              </div>
              <div className="text-xs text-text-secondary">
                {formatTimestamp(selectedRecord.timestamp)}
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Performance Metrics */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Performance</h4>
                  <div className="bg-dark-primary p-3 rounded border border-border-dark">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-text-secondary">Execution Time:</span>
                        <span className="text-white ml-2">
                          {selectedRecord.result.executionTime.toFixed(2)}ms
                        </span>
                      </div>
                      {selectedRecord.result.memoryUsage && (
                        <div>
                          <span className="text-text-secondary">Memory:</span>
                          <span className="text-white ml-2">
                            {(selectedRecord.result.memoryUsage / 1024).toFixed(2)}KB
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Code */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Code</h4>
                  <pre className="bg-dark-primary p-3 rounded text-sm text-gray-300 whitespace-pre-wrap border border-border-dark">
                    {selectedRecord.code}
                  </pre>
                </div>

                {/* Output */}
                {selectedRecord.result.output && (
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Output</h4>
                    <pre className="bg-dark-primary p-3 rounded text-sm text-gray-300 whitespace-pre-wrap border border-border-dark">
                      {selectedRecord.result.output}
                    </pre>
                  </div>
                )}

                {/* Error */}
                {selectedRecord.result.error && (
                  <div>
                    <h4 className="text-sm font-medium text-red-400 mb-2">Error</h4>
                    <pre className="bg-red-950/20 p-3 rounded text-sm text-red-300 whitespace-pre-wrap border border-red-500/20">
                      {selectedRecord.result.error}
                    </pre>
                  </div>
                )}

                {/* Stack Trace */}
                {selectedRecord.result.stackTrace && (
                  <div>
                    <h4 className="text-sm font-medium text-yellow-400 mb-2">Stack Trace</h4>
                    <pre className="bg-yellow-950/20 p-3 rounded text-xs text-yellow-300 whitespace-pre-wrap border border-yellow-500/20">
                      {selectedRecord.result.stackTrace}
                    </pre>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <div className="text-center">
              <Timer className="w-8 h-8 mb-2 mx-auto opacity-50" />
              <p className="text-sm">Select an execution from the history to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
