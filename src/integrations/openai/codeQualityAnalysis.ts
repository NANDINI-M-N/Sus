import axios from 'axios';

// Add type definition for import.meta.env
interface ImportMetaEnv {
  VITE_OPENAI_API_KEY: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Types for agent responses
export interface AgentAnalysisResult {
  score: number;
  issues: Array<{
    line?: number;
    description: string;
    severity?: 'critical' | 'major' | 'minor' | 'info';
  }>;
  summary: string;
  recommendations?: string[];
}

export interface AnalysisResponse {
  correctness: AgentAnalysisResult;
  complexity: AgentAnalysisResult;
  edgeCases: AgentAnalysisResult;
  performance: AgentAnalysisResult;
  security: AgentAnalysisResult;
  style: AgentAnalysisResult;
  overallSummary: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    hiringRecommendation: string;
    summary: string;
  };
}

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// === Core Shared Input ===
function createCommonInput({ code, language, problemStatement, roleLevel }: { 
  code: string; 
  language: string; 
  problemStatement?: string; 
  roleLevel: string;
}) {
  return {
    code,
    language,
    problemStatement: problemStatement || 'No problem statement provided.',
    roleLevel,
  };
}

// === Agent Prompts ===
const agentPrompts = {
  correctness: ({ code, language, problemStatement }: any) => `
You are a Correctness Analyzer Agent specializing in identifying logical errors and functional correctness.

Problem Statement: ${problemStatement}
Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Analyze this code for correctness. Focus on:
1. Logic errors and edge cases
2. Function behavior correctness
3. Algorithm implementation accuracy
4. Potential runtime errors
5. Incorrect assumptions in the code

Provide your analysis in this JSON format:
{
  "score": <number from 0-100>,
  "issues": [
    {"line": <line number or null>, "description": "<issue description>", "severity": "<critical|major|minor|info>"}
  ],
  "summary": "<overall assessment of correctness>",
  "recommendations": ["<suggestion to improve correctness>"]
}

Ensure your response is ONLY valid JSON with no additional text.
`,

  complexity: ({ code, language, roleLevel }: any) => `
You are a Complexity Analyzer Agent specializing in assessing code complexity and maintainability.

Role Level: ${roleLevel}
Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Analyze this code for complexity. Focus on:
1. Cyclomatic complexity
2. Cognitive complexity
3. Function/method length
4. Nesting depth
5. Abstraction levels

Provide your analysis in this JSON format:
{
  "score": <number from 0-100, higher is better/less complex>,
  "issues": [
    {"line": <line number or null>, "description": "<complexity issue>", "severity": "<critical|major|minor|info>"}
  ],
  "summary": "<overall assessment of complexity>",
  "recommendations": ["<suggestion to reduce complexity>"]
}

Ensure your response is ONLY valid JSON with no additional text.
`,

  edgeCases: ({ code, problemStatement, language }: any) => `
You are an Edge-Case Hunter Agent specializing in identifying potential edge cases and boundary conditions.

Problem Statement: ${problemStatement}
Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Analyze this code for edge case handling. Focus on:
1. Boundary conditions
2. Input validation gaps
3. Error handling omissions
4. Unexpected input scenarios
5. Race conditions and concurrency issues

Provide your analysis in this JSON format:
{
  "score": <number from 0-100>,
  "issues": [
    {"description": "<edge case description>", "severity": "<critical|major|minor|info>"}
  ],
  "summary": "<overall assessment of edge case handling>",
  "recommendations": ["<suggestion to improve edge case handling>"]
}

Ensure your response is ONLY valid JSON with no additional text.
`,

  performance: ({ code, language, roleLevel }: any) => `
You are a Performance Analyzer Agent specializing in identifying performance bottlenecks and optimization opportunities.

Role Level: ${roleLevel}
Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Analyze this code for performance. Focus on:
1. Time complexity analysis
2. Space complexity analysis
3. Inefficient algorithms or data structures
4. Resource utilization
5. Optimization opportunities

Provide your analysis in this JSON format:
{
  "score": <number from 0-100>,
  "issues": [
    {"line": <line number or null>, "description": "<performance issue>", "severity": "<critical|major|minor|info>"}
  ],
  "summary": "<overall assessment of performance>",
  "recommendations": ["<suggestion to improve performance>"]
}

Ensure your response is ONLY valid JSON with no additional text.
`,

  security: ({ code, language }: any) => `
You are a Security Analyzer Agent specializing in identifying security vulnerabilities and risks.

Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Analyze this code for security issues. Focus on:
1. Input validation vulnerabilities
2. Injection vulnerabilities
3. Authentication/authorization issues
4. Sensitive data exposure
5. Security best practices

Provide your analysis in this JSON format:
{
  "score": <number from 0-100>,
  "issues": [
    {"line": <line number or null>, "description": "<security issue>", "severity": "<critical|major|minor|info>"}
  ],
  "summary": "<overall assessment of security>",
  "recommendations": ["<suggestion to improve security>"]
}

Ensure your response is ONLY valid JSON with no additional text.
`,

  style: ({ code, language, roleLevel }: any) => `
You are a Style & Readability Analyzer Agent specializing in assessing code clarity and adherence to best practices.

Role Level: ${roleLevel}
Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Analyze this code for style and readability. Focus on:
1. Naming conventions
2. Code organization
3. Documentation quality
4. Consistency
5. Adherence to language-specific style guides

Provide your analysis in this JSON format:
{
  "score": <number from 0-100>,
  "issues": [
    {"line": <line number or null>, "description": "<style issue>", "severity": "<critical|major|minor|info>"}
  ],
  "summary": "<overall assessment of style and readability>",
  "recommendations": ["<suggestion to improve style and readability>"]
}

Ensure your response is ONLY valid JSON with no additional text.
`,

  summarizer: ({ agentResponses, roleLevel, problemStatement }: any) => `
You are a Code Analysis Summarizer specializing in synthesizing insights from multiple specialized code analysis agents.

Role Level: ${roleLevel}
Problem Statement: ${problemStatement}

Agent Reports:
${JSON.stringify(agentResponses)}

Based on these analyses, create a comprehensive summary in this JSON format:
{
  "score": <overall score from 0-100>,
  "strengths": ["<key strength>", "<key strength>", ...],
  "weaknesses": ["<key weakness>", "<key weakness>", ...],
  "hiringRecommendation": "<strong hire|hire|borderline|do not hire>",
  "summary": "<comprehensive evaluation summary>"
}

Consider the candidate's role level (${roleLevel}) when making your assessment.
Ensure your response is ONLY valid JSON with no additional text.
`,
};

// === Run Single Agent ===
async function runAgent(agentName: string, input: any): Promise<any> {
  console.log(`🤖 Running ${agentName} agent analysis...`);
  
  try {
    const prompt = agentPrompts[agentName](input);
    
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    const content = response.data.choices[0].message.content;
    console.log(`✅ ${agentName} agent completed`);
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error(`Error parsing ${agentName} response:`, parseError);
      console.error('Raw response:', content);
      return {
        score: 0,
        issues: [],
        summary: `Error parsing ${agentName} analysis`,
        recommendations: [`The ${agentName} agent encountered an error`]
      };
    }
  } catch (error) {
    console.error(`Error running ${agentName} agent:`, error);
    return {
      score: 0,
      issues: [],
      summary: `Error running ${agentName} analysis`,
      recommendations: [`The ${agentName} agent encountered an error`]
    };
  }
}

// === Mock Agent for Development ===
function getMockResponse(agentName: string): any {
  console.log(`🔄 Using mock response for ${agentName} agent`);
  
  const mockResponses: Record<string, any> = {
    correctness: {
      score: 82,
      issues: [
        { line: 5, description: "Potential null reference not handled", severity: "major" },
        { line: 12, description: "Logic error in edge case handling", severity: "critical" }
      ],
      summary: "The solution correctly handles the main algorithm but has issues with edge cases.",
      recommendations: [
        "Add null checks before accessing array elements",
        "Test with empty arrays and boundary conditions"
      ]
    },
    complexity: {
      score: 78,
      issues: [
        { line: 8, description: "Nested loops increase complexity", severity: "minor" },
        { line: 15, description: "Function is too long (25 lines)", severity: "minor" }
      ],
      summary: "The code has moderate complexity with some areas that could be simplified.",
      recommendations: [
        "Extract helper functions to reduce nesting",
        "Consider using more descriptive variable names"
      ]
    },
    edgeCases: {
      score: 65,
      issues: [
        { description: "Empty array not handled", severity: "major" },
        { description: "Boundary condition missed", severity: "major" }
      ],
      summary: "Several important edge cases are not properly handled.",
      recommendations: [
        "Add checks for empty arrays",
        "Consider extreme values at boundaries"
      ]
    },
    performance: {
      score: 85,
      issues: [
        { line: 12, description: "Inefficient string concatenation in loop", severity: "minor" }
      ],
      summary: "Overall good performance with O(n) time complexity.",
      recommendations: [
        "Use string builder pattern for concatenation in loops",
        "Consider memoization for repeated calculations"
      ]
    },
    security: {
      score: 90,
      issues: [],
      summary: "No significant security issues detected for this algorithm.",
      recommendations: []
    },
    style: {
      score: 75,
      issues: [
        { line: 3, description: "Variable name 'x' is not descriptive", severity: "minor" },
        { line: 18, description: "Missing function documentation", severity: "minor" }
      ],
      summary: "Code follows basic style conventions but lacks comprehensive documentation.",
      recommendations: [
        "Add JSDoc comments for functions",
        "Use more descriptive variable names"
      ]
    },
    summarizer: {
      score: 79,
      strengths: [
        "Efficient algorithm implementation with O(n) complexity",
        "Good security practices",
        "Clean code structure"
      ],
      weaknesses: [
        "Inadequate edge case handling",
        "Limited documentation",
        "Some variable naming issues"
      ],
      hiringRecommendation: "hire",
      summary: "The candidate demonstrates good algorithmic skills and produces efficient code, but needs improvement in edge case handling and documentation."
    }
  };
  
  return mockResponses[agentName];
}

// === Orchestrator ===
export async function analyzeCode({ 
  code, 
  language, 
  problemStatement, 
  roleLevel,
  useMock = false // Changed default to false to use real API calls
}: { 
  code: string; 
  language: string; 
  problemStatement?: string; 
  roleLevel: string;
  useMock?: boolean;
}): Promise<AnalysisResponse> {
  console.log(`🚀 Starting code quality analysis for ${language} code`);
  console.log(`📝 Problem statement: ${problemStatement || 'None provided'}`);
  console.log(`👤 Role level: ${roleLevel}`);
  
  const startTime = performance.now();
  const input = createCommonInput({ code, language, problemStatement, roleLevel });

  // Run all agents in parallel
  const agentNames = ['correctness', 'complexity', 'edgeCases', 'performance', 'security', 'style'];
  
  const agentPromises = agentNames.map(agent => {
    return useMock ? 
      Promise.resolve({ agent, output: getMockResponse(agent) }) : 
      runAgent(agent, input).then(output => ({ agent, output }));
  });

  try {
    console.log(`⏳ Waiting for all agents to complete...`);
    const agentResults = await Promise.all(agentPromises);
    console.log(`✅ All agents completed in ${((performance.now() - startTime) / 1000).toFixed(2)}s`);
    
    // Organize results by agent
    const agentOutputs: Record<string, any> = {};
    agentResults.forEach(result => {
      agentOutputs[result.agent] = result.output;
    });
    
    // Get summary from summarizer agent
    console.log(`🔄 Running summarizer agent...`);
    const summaryInput = {
      agentResponses: agentOutputs,
      roleLevel,
      problemStatement: problemStatement || 'No problem statement provided',
    };
    
    const overallSummary = useMock ? 
      getMockResponse('summarizer') : 
      await runAgent('summarizer', summaryInput);
    
    console.log(`✅ Analysis complete in ${((performance.now() - startTime) / 1000).toFixed(2)}s`);
    
    return {
      correctness: agentOutputs.correctness,
      complexity: agentOutputs.complexity,
      edgeCases: agentOutputs.edgeCases,
      performance: agentOutputs.performance,
      security: agentOutputs.security,
      style: agentOutputs.style,
      overallSummary
    };
  } catch (error) {
    console.error('Error in code quality analysis:', error);
    throw new Error('Failed to complete code quality analysis');
  }
}