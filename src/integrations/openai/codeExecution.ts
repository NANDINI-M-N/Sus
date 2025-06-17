import axios from 'axios';
import { ExecutionResult } from '@/components/editor/execution/CodeExecutor';

// Add type definition for import.meta.env
interface ImportMetaEnv {
  VITE_OPENAI_API_KEY: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  response_format: { type: string };
}

interface OpenAIResponse {
  success: boolean;
  output: string;
  error?: string | null;
  executionTime: number;
  memoryUsage: number;
  lineByLineExecution?: Array<{
    line: number;
    state: any;
    output: string;
  }>;
  visualOutput?: string | null;
}

export async function simulateCodeExecution(
  language: string,
  code: string,
  input?: string
): Promise<ExecutionResult> {
  console.log(`🚀 Starting OpenAI code execution simulation for ${language}`);
  console.log(`📝 Code to execute:\n${code}`);
  if (input) {
    console.log(`📥 Input provided:\n${input}`);
  }
  
  const startTime = performance.now();
  
  try {
    // Create the user content with code and optional input
    let userContent = `Language: ${language}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\n`;
    
    if (input) {
      userContent += `Input Values:\n\`\`\`\n${input}\n\`\`\`\n\n`;
    }

    userContent += `Execute this code exactly as a ${language} interpreter would and provide complete execution results in the required JSON format. Make sure to include the actual output of the code in the output field. If there is console.log output, include it in the output field.`;

    console.log(`🔄 Preparing OpenAI request with prompt length: ${userContent.length} characters`);
    
    const systemPrompt = `You are a precise code execution simulator that runs code in various programming languages. Your task is to execute the provided code snippet exactly as a native compiler or interpreter would, and return detailed execution results in a structured JSON format.

Follow these specific instructions:

1. Execute the code with complete accuracy according to the language's standard behavior and semantics
2. Handle edge cases, runtime errors, syntax errors, and exceptions properly
3. For interactive programs, use any provided input values in the exact order they appear
4. For compilation errors, include line numbers and detailed error messages
5. Estimate reasonable execution time and memory usage based on code complexity
6. For iterative or recursive algorithms, track and report performance metrics
7. Include any console output, return values, or visual results (for UI code)
8. Format all output exactly as it would appear in a real terminal/console
9. If code contains infinite loops or would timeout, detect this and report it
10. For data structures, render their final state after execution
11. IMPORTANT: Always include console.log output in the output field, not just return values
12. IMPORTANT: For JavaScript/TypeScript, capture and include all console.log outputs in the output field

JAVASCRIPT SPECIFIC INSTRUCTIONS:
- For JavaScript, make sure to capture ALL console.log outputs and include them in the output field
- If the code has a return value but no console.log, include the return value in the output field
- If the code has both console.log and return values, include both in the output field
- Format the output exactly as it would appear in a browser console or Node.js terminal

Your response MUST be valid JSON with this exact structure:
{
  "success": boolean, // whether execution completed without errors
  "output": string, // all console output and return values
  "error": string | null, // detailed error message if any
  "executionTime": number, // estimated execution time in milliseconds
  "memoryUsage": number, // estimated memory usage in KB
  "lineByLineExecution": [ // optional step-by-step execution trace
    {"line": number, "state": object, "output": string}
  ],
  "visualOutput": string | null // for HTML/CSS or graphical output
}`;

    const requestModels = ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];
    let response;
    let modelError;
    
    // Try each model in sequence until one works
    for (const model of requestModels) {
      try {
        const request: OpenAIRequest = {
          model: model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userContent
            }
          ],
          temperature: 0.1,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0,
          response_format: { type: 'json_object' }
        };

        console.log(`📡 Sending request to OpenAI API using model ${model} at ${new Date().toISOString()}`);
        
        response = await axios.post(OPENAI_API_URL, request, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        });
        
        console.log(`✅ Received response from OpenAI API after ${((performance.now() - startTime) / 1000).toFixed(2)}s using model ${model}`);
        break; // If successful, exit the loop
      } catch (error) {
        console.log(`⚠️ Failed to use model ${model}: ${error.message}`);
        modelError = error;
        // Continue to next model
      }
    }
    
    // If all models failed, throw the last error
    if (!response) {
      throw modelError || new Error('All OpenAI models failed');
    }

    const result = response.data.choices[0].message.content;
    console.log(`📊 Raw response from OpenAI:\n${result}`);
    
    try {
      const parsedResult: OpenAIResponse = JSON.parse(result);
      console.log(`📋 Parsed execution result:`, {
        success: parsedResult.success,
        executionTime: parsedResult.executionTime,
        memoryUsage: parsedResult.memoryUsage,
        hasError: !!parsedResult.error,
        hasLineByLineExecution: !!parsedResult.lineByLineExecution,
        hasVisualOutput: !!parsedResult.visualOutput,
        outputLength: parsedResult.output?.length || 0
      });
      
      // Log the actual output content for debugging
      console.log('🔍 Output content:', {
        output: parsedResult.output,
        error: parsedResult.error
      });

      // Ensure all fields are properly formatted
      const formattedResult = {
        success: Boolean(parsedResult.success),
        output: parsedResult.output || '',
        error: parsedResult.error || undefined,
        executionTime: Number(parsedResult.executionTime) || 0,
        memoryUsage: Number(parsedResult.memoryUsage) || 0,
        stackTrace: parsedResult.lineByLineExecution ? 
          JSON.stringify(parsedResult.lineByLineExecution, null, 2) : 
          undefined,
        visualOutput: parsedResult.visualOutput || undefined
      };
      
      console.log('✅ Returning formatted result:', formattedResult);
      return formattedResult;
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw response:', result);
      
      // Return a formatted error if JSON parsing fails
      return {
        success: false,
        output: 'Failed to parse execution result',
        error: 'Invalid response format from code execution service',
        executionTime: performance.now() - startTime,
        stackTrace: result // Include the raw response for debugging
      };
    }
  } catch (error) {
    const totalTime = performance.now() - startTime;
    console.error(`❌ OpenAI API error after ${(totalTime / 1000).toFixed(2)}s:`, error);
    
    let errorMessage = 'Failed to simulate code execution';
    
    if (axios.isAxiosError(error)) {
      console.error('API Response:', error.response?.data);
      console.error('API Status:', error.response?.status);
      console.error('API Headers:', error.response?.headers);
      
      // Provide more specific error messages based on response
      if (error.response?.status === 404) {
        errorMessage = 'Model not found: The specified OpenAI model is invalid or unavailable';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication error: Invalid API key or insufficient permissions';
      } else if (error.response?.status === 429) {
        errorMessage = 'Rate limit exceeded: Too many requests to the OpenAI API';
      } else if (error.response?.data?.error?.message) {
        errorMessage = `OpenAI API error: ${error.response.data.error.message}`;
      }
    }
    
    return {
      success: false,
      output: '',
      error: errorMessage,
      executionTime: totalTime
    };
  }
} 