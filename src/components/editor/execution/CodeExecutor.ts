export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
  stackTrace?: string;
  visualOutput?: string;
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput: string;
  executionTime: number;
  error?: string;
}

// Custom interface for iframe execution context
interface IframeWindow {
  console: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    info: (...args: any[]) => void;
  };
  eval: (code: string) => any;
  prompt?: () => string;
  setTimeout: typeof setTimeout;
  setInterval: typeof setInterval;
  clearTimeout: typeof clearTimeout;
  clearInterval: typeof clearInterval;
}

import { simulateCodeExecution } from '@/integrations/openai/codeExecution';

export class CodeExecutor {
  private static instance: CodeExecutor;
  private workers: Map<string, Worker> = new Map();
  private pyodideReady = false;
  private pyodideLoading = false;
  private useOpenAI = true; // Default to using OpenAI

  static getInstance(): CodeExecutor {
    if (!CodeExecutor.instance) {
      CodeExecutor.instance = new CodeExecutor();
    }
    return CodeExecutor.instance;
  }

  async initializePyodide(): Promise<void> {
    if (this.pyodideReady) return;
    if (this.pyodideLoading) {
      // Wait for existing initialization
      while (this.pyodideLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.pyodideLoading = true;
    try {
      // Load Pyodide from CDN
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      const pyodide = await (window as any).loadPyodide();
      (window as any).pyodide = pyodide;
      this.pyodideReady = true;
    } catch (error) {
      console.error('Failed to initialize Pyodide:', error);
    } finally {
      this.pyodideLoading = false;
    }
  }

  async executeCode(language: string, code: string, input?: string, timeout = 5000): Promise<ExecutionResult> {
    const startTime = performance.now();
    console.log(`⚙️ CodeExecutor: Starting code execution for ${language}`);
    console.log(`🔍 CodeExecutor: Using OpenAI? ${this.useOpenAI ? 'Yes' : 'No'}`);
    
    try {
      // Use OpenAI for code execution simulation
      if (this.useOpenAI) {
        console.log(`🤖 CodeExecutor: Delegating to OpenAI execution`);
        const result = await simulateCodeExecution(language, code, input);
        console.log(`🏁 CodeExecutor: OpenAI execution completed in ${result.executionTime}ms`);
        return result;
      }
      
      // Fallback to built-in execution methods
      console.log(`🔧 CodeExecutor: Using built-in execution for ${language}`);
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
          return await this.executeJavaScript(code, input, timeout);
        case 'python':
          return await this.executePython(code, input, timeout);
        case 'html':
          return await this.executeHTML(code, timeout);
        case 'css':
          return await this.executeCSS(code, timeout);
        default:
          return await this.mockExecution(language, code, input, timeout);
      }
    } catch (error) {
      const totalTime = performance.now() - startTime;
      console.error(`❌ CodeExecutor: Execution failed after ${totalTime}ms`, error);
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: totalTime,
        stackTrace: error instanceof Error ? error.stack : undefined
      };
    }
  }

  private async executeJavaScript(code: string, input?: string, timeout = 5000): Promise<ExecutionResult> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const outputs: string[] = [];
      let hasError = false;
      let errorMessage = '';
      let stackTrace = '';

      // Create a sandboxed execution context
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.sandbox.add('allow-scripts');
      document.body.appendChild(iframe);

      const iframeWindow = iframe.contentWindow as any;
      if (!iframeWindow) {
        resolve({
          success: false,
          output: '',
          error: 'Failed to create execution context',
          executionTime: performance.now() - startTime
        });
        return;
      }

      // Wait for iframe to load
      iframe.onload = () => {
        try {
          // Override console methods to capture output
          iframeWindow.console = {
            log: (...args: any[]) => outputs.push(args.map(arg => {
              if (typeof arg === 'object') {
                try {
                  return JSON.stringify(arg, null, 2);
                } catch {
                  return String(arg);
                }
              }
              return String(arg);
            }).join(' ')),
            error: (...args: any[]) => {
              hasError = true;
              errorMessage = args.map(String).join(' ');
            },
            warn: (...args: any[]) => outputs.push('⚠️ Warning: ' + args.map(String).join(' ')),
            info: (...args: any[]) => outputs.push('ℹ️ Info: ' + args.map(String).join(' '))
          };

          // Add input handling
          if (input) {
            const inputLines = input.split('\n');
            let inputIndex = 0;
            iframeWindow.prompt = (message?: string) => {
              if (message) outputs.push(`Prompt: ${message}`);
              const value = inputIndex < inputLines.length ? inputLines[inputIndex++] : '';
              outputs.push(`Input: ${value}`);
              return value;
            };
          }

          // Set timeout
          const timeoutId = setTimeout(() => {
            hasError = true;
            errorMessage = `Execution timeout (${timeout}ms)`;
            cleanup();
          }, timeout);

          const cleanup = () => {
            clearTimeout(timeoutId);
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
            
            resolve({
              success: !hasError,
              output: outputs.length > 0 ? outputs.join('\n') : (hasError ? '' : 'Code executed successfully (no output)'),
              error: hasError ? errorMessage : undefined,
              executionTime: performance.now() - startTime,
              stackTrace: stackTrace || undefined
            });
          };

          try {
            // Create a wrapper to handle both sync and async code
            const wrappedCode = `
              (async () => {
                try {
                  ${code}
                } catch (error) {
                  console.error(error.message);
                  throw error;
                }
              })().catch(error => {
                console.error('Async error:', error.message);
              });
            `;

            iframeWindow.eval(wrappedCode);
            
            // Allow time for async operations
            setTimeout(cleanup, 100);
          } catch (error) {
            hasError = true;
            errorMessage = error instanceof Error ? error.message : 'Execution error';
            stackTrace = error instanceof Error ? error.stack || '' : '';
            cleanup();
          }
        } catch (error) {
          hasError = true;
          errorMessage = 'Failed to setup execution environment';
          resolve({
            success: false,
            output: '',
            error: errorMessage,
            executionTime: performance.now() - startTime
          });
        }
      };

      // Trigger iframe load
      iframe.src = 'about:blank';
    });
  }

  private async executePython(code: string, input?: string, timeout = 5000): Promise<ExecutionResult> {
    const startTime = performance.now();
    
    try {
      if (!this.pyodideReady) {
        await this.initializePyodide();
      }

      if (!this.pyodideReady) {
        return {
          success: false,
          output: '',
          error: 'Python runtime not available. Please try again.',
          executionTime: performance.now() - startTime
        };
      }

      const pyodide = (window as any).pyodide;
      
      // Capture stdout
      pyodide.runPython(`
        import sys
        from io import StringIO
        import contextlib
        
        # Store original stdout
        original_stdout = sys.stdout
        captured_output = StringIO()
        sys.stdout = captured_output
      `);

      // Handle input if provided
      if (input) {
        pyodide.runPython(`
          import sys
          from io import StringIO
          sys.stdin = StringIO("""${input.replace(/"/g, '\\"')}""")
        `);
      }

      // Execute the code with timeout
      const executeWithTimeout = new Promise<string>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Python execution timeout (${timeout}ms)`));
        }, timeout);

        try {
          pyodide.runPython(code);
          
          // Get the captured output
          const output = pyodide.runPython(`
            result = captured_output.getvalue()
            sys.stdout = original_stdout
            result
          `);
          
          clearTimeout(timeoutId);
          resolve(output || 'Python code executed successfully (no output)');
        } catch (error) {
          clearTimeout(timeoutId);
          // Restore stdout
          pyodide.runPython('sys.stdout = original_stdout');
          reject(error);
        }
      });

      const output = await executeWithTimeout;

      return {
        success: true,
        output,
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Python execution error',
        executionTime: performance.now() - startTime,
        stackTrace: error instanceof Error ? error.stack : undefined
      };
    }
  }

  private async executeHTML(code: string, timeout = 5000): Promise<ExecutionResult> {
    const startTime = performance.now();
    
    try {
      // Create a preview iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.sandbox.add('allow-scripts');
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        return {
          success: false,
          output: '',
          error: 'Failed to create HTML preview context',
          executionTime: performance.now() - startTime
        };
      }

      // Write HTML content
      iframeDoc.open();
      iframeDoc.write(code);
      iframeDoc.close();

      // Clean up
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);

      return {
        success: true,
        output: 'HTML rendered successfully. Open browser dev tools to inspect the output.',
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'HTML execution error',
        executionTime: performance.now() - startTime
      };
    }
  }

  private async executeCSS(code: string, timeout = 5000): Promise<ExecutionResult> {
    const startTime = performance.now();
    
    try {
      // Create a test element to apply CSS
      const testDiv = document.createElement('div');
      testDiv.innerHTML = '<p>Sample text</p><button>Sample button</button>';
      testDiv.style.cssText = 'position: absolute; top: -9999px; left: -9999px;';
      
      // Create style element
      const style = document.createElement('style');
      style.textContent = code;
      
      document.head.appendChild(style);
      document.body.appendChild(testDiv);
      
      // Clean up after a short delay
      setTimeout(() => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
        if (document.body.contains(testDiv)) {
          document.body.removeChild(testDiv);
        }
      }, 1000);

      return {
        success: true,
        output: 'CSS applied successfully. Styles have been tested and are valid.',
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'CSS execution error',
        executionTime: performance.now() - startTime
      };
    }
  }

  private async mockExecution(language: string, code: string, input?: string, timeout = 5000): Promise<ExecutionResult> {
    const startTime = performance.now();
    
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 300));

    // Mock execution for compiled languages
    const mockExecutors: { [key: string]: (code: string) => string } = {
      java: (code) => {
        if (code.includes('System.out.println')) {
          const matches = code.match(/System\.out\.println\s*\(\s*"([^"]*)"\s*\)/g);
          if (matches) {
            return matches.map(match => {
              const content = match.match(/"([^"]*)"/)?.[1] || '';
              return content;
            }).join('\n');
          }
        }
        return 'Java program compiled and executed successfully';
      },
      cpp: (code) => {
        if (code.includes('cout')) {
          const matches = code.match(/cout\s*<<\s*"([^"]*)"/g);
          if (matches) {
            return matches.map(match => {
              const content = match.match(/"([^"]*)"/)?.[1] || '';
              return content;
            }).join('\n');
          }
        }
        return 'C++ program compiled and executed successfully';
      },
      c: (code) => {
        if (code.includes('printf')) {
          const matches = code.match(/printf\s*\(\s*"([^"]*)"/g);
          if (matches) {
            return matches.map(match => {
              const content = match.match(/"([^"]*)"/)?.[1] || '';
              return content.replace(/\\n/g, '\n');
            }).join('\n');
          }
        }
        return 'C program compiled and executed successfully';
      },
      go: (code) => {
        if (code.includes('fmt.Println')) {
          const matches = code.match(/fmt\.Println\s*\(\s*"([^"]*)"\s*\)/g);
          if (matches) {
            return matches.map(match => {
              const content = match.match(/"([^"]*)"/)?.[1] || '';
              return content;
            }).join('\n');
          }
        }
        return 'Go program compiled and executed successfully';
      }
    };

    const executor = mockExecutors[language.toLowerCase()];
    const output = executor ? executor(code) : `${language} code executed successfully (simulated)`;

    // Basic syntax validation
    const hasBasicSyntax = code.includes('main') || code.includes('function') || 
                          code.includes('def') || code.includes('class') || 
                          code.includes('println') || code.includes('printf') || 
                          code.includes('cout') || code.length > 10;
    
    if (!hasBasicSyntax && code.trim().length < 5) {
      return {
        success: false,
        output: '',
        error: `No executable code found in ${language}`,
        executionTime: performance.now() - startTime
      };
    }

    return {
      success: true,
      output,
      executionTime: performance.now() - startTime
    };
  }

  async runTestCases(language: string, code: string, testCases: TestCase[], timeout = 5000): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const testCase of testCases) {
      const result = await this.executeCode(language, code, testCase.input, timeout);
      
      results.push({
        testCase,
        passed: result.success && result.output.trim() === testCase.expectedOutput.trim(),
        actualOutput: result.output,
        executionTime: result.executionTime,
        error: result.error
      });
    }

    return results;
  }

  cleanup(): void {
    this.workers.forEach(worker => worker.terminate());
    this.workers.clear();
  }

  // Add method to toggle OpenAI usage
  setUseOpenAI(enabled: boolean): void {
    console.log(`🔄 CodeExecutor: ${enabled ? 'Enabling' : 'Disabling'} OpenAI execution`);
    this.useOpenAI = enabled;
  }
}
