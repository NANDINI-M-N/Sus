import axios from 'axios';

// Types for plagiarism analysis
export interface PlagiarismIssue {
  line?: number;
  endLine?: number;
  description: string;
  severity?: 'critical' | 'major' | 'minor' | 'info';
  possibleSource?: string;
}

export interface PlagiarismAnalysisResult {
  score: number;
  issues: PlagiarismIssue[];
  summary: string;
  recommendations?: string[];
}

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Core input function
function createPlagiarismInput({ 
  code, 
  language, 
  problemStatement 
}: { 
  code: string; 
  language: string; 
  problemStatement?: string; 
}) {
  return {
    code,
    language,
    problemStatement: problemStatement || 'No problem statement provided.'
  };
}

// Plagiarism agent prompt
const plagiarismPrompt = ({ code, language, problemStatement }: any) => `
You are a Plagiarism Detection Agent specializing in identifying code similarities and potential plagiarism.

Problem Statement: ${problemStatement}
Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Analyze this code for potential plagiarism. Focus on:
1. Similarities to common solutions or patterns
2. Distinctive implementation approaches vs standard solutions
3. Unique coding style indicators
4. Sections that appear directly copied from known sources
5. Algorithm implementation originality

Provide your analysis in this JSON format:
{
  "score": <number from 0-100, higher means more original/less plagiarized>,
  "issues": [
    {"line": <starting line number or null>, "endLine": <ending line number or null>, "description": "<similarity description>", "severity": "<critical|major|minor|info>", "possibleSource": "<potential source if identifiable>"}
  ],
  "summary": "<overall assessment of code originality>",
  "recommendations": ["<suggestion to improve code originality>"]
}

Ensure your response is ONLY valid JSON with no additional text.
`;

// Run plagiarism analysis
async function runPlagiarismAnalysis(input: any): Promise<PlagiarismAnalysisResult> {
  console.log(`🔍 Running plagiarism analysis...`);
  
  try {
    const prompt = plagiarismPrompt(input);
    
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
    console.log(`✅ Plagiarism analysis completed`);
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error(`Error parsing plagiarism analysis response:`, parseError);
      console.error('Raw response:', content);
      return {
        score: 0,
        issues: [],
        summary: `Error parsing plagiarism analysis`,
        recommendations: [`The plagiarism analysis encountered an error`]
      };
    }
  } catch (error) {
    console.error(`Error running plagiarism analysis:`, error);
    return {
      score: 0,
      issues: [],
      summary: `Error running plagiarism analysis`,
      recommendations: [`The plagiarism analysis encountered an error`]
    };
  }
}

// Mock data for development
function getMockPlagiarismResponse(): PlagiarismAnalysisResult {
  console.log(`🔄 Using mock response for plagiarism analysis`);
  
  return {
    score: 78,
    issues: [
      { 
        line: 15, 
        endLine: 22, 
        description: "This sorting implementation is very similar to common textbook examples", 
        severity: "minor",
        possibleSource: "Common algorithm implementations"
      },
      { 
        line: 34, 
        endLine: 42, 
        description: "This helper function closely resembles a LeetCode solution", 
        severity: "major",
        possibleSource: "LeetCode Problem #217 (Contains Duplicate)"
      }
    ],
    summary: "The code shows some similarities to common implementations but has unique elements. Overall originality is moderate.",
    recommendations: [
      "Consider implementing a more unique approach to the sorting algorithm",
      "Add comments explaining your thought process to demonstrate understanding",
      "Refactor helper functions with your own implementation style"
    ]
  };
}

// Main export function
export async function analyzePlagiarism({ 
  code, 
  language, 
  problemStatement,
  useMock = false
}: { 
  code: string; 
  language: string; 
  problemStatement?: string;
  useMock?: boolean;
}): Promise<PlagiarismAnalysisResult> {
  console.log(`🚀 Starting plagiarism analysis for ${language} code`);
  console.log(`📝 Problem statement: ${problemStatement || 'None provided'}`);
  
  const startTime = performance.now();
  const input = createPlagiarismInput({ code, language, problemStatement });

  try {
    const result = useMock ? 
      getMockPlagiarismResponse() : 
      await runPlagiarismAnalysis(input);
    
    console.log(`✅ Plagiarism analysis complete in ${((performance.now() - startTime) / 1000).toFixed(2)}s`);
    return result;
  } catch (error) {
    console.error('Error in plagiarism analysis:', error);
    throw new Error('Failed to complete plagiarism analysis');
  }
}
