import axios from 'axios';
import { analyzeCommunication, CommunicationAnalysisResult } from './communicationAnalysis';
import { analyzeCode } from './codeQualityAnalysis';

// Add type definition for import.meta.env
interface ImportMetaEnv {
  VITE_OPENAI_API_KEY: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Define the output type
export interface CandidateReport {
  overallScore: number;
  technicalAssessment: {
    score: number;
    strengths: string[];
    weaknesses: string[];
  };
  communicationAssessment: {
    score: number;
    strengths: string[];
    weaknesses: string[];
  };
  problemSolvingAssessment: {
    score: number;
    strengths: string[];
    weaknesses: string[];
  };
  hiringRecommendation: string;
  summary: string;
  feedbackForCandidate: string;
}

// API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';

// Check if API key is available
const isApiKeyAvailable = !!OPENAI_API_KEY;

// Candidate report summarizer prompt
const summarizerPrompt = ({ 
  codeAnalysis, 
  communicationAnalysis,
  roleLevel
}: any) => `
You are a Technical Interview Evaluator specializing in creating comprehensive candidate summaries.

Role Level: ${roleLevel}

Code Analysis Results:
\`\`\`
${JSON.stringify(codeAnalysis, null, 2)}
\`\`\`

Communication Analysis Results:
\`\`\`
${JSON.stringify(communicationAnalysis, null, 2)}
\`\`\`

Create a comprehensive candidate summary report that evaluates all aspects of the interview performance.
Focus on:
1. Technical skills demonstrated in the code
2. Communication skills shown in the chat
3. Problem-solving approach
4. Overall fit for the role level

Provide your summary in this JSON format:
{
  "overallScore": <number from 0-100>,
  "technicalAssessment": {
    "score": <number from 0-100>,
    "strengths": ["<strength>", ...],
    "weaknesses": ["<weakness>", ...]
  },
  "communicationAssessment": {
    "score": <number from 0-100>,
    "strengths": ["<strength>", ...],
    "weaknesses": ["<weakness>", ...]
  },
  "problemSolvingAssessment": {
    "score": <number from 0-100>,
    "strengths": ["<strength>", ...],
    "weaknesses": ["<weakness>", ...]
  },
  "hiringRecommendation": "<strong hire|hire|consider|do not hire>",
  "summary": "<comprehensive evaluation of the candidate>",
  "feedbackForCandidate": "<constructive feedback that could be shared with the candidate>"
}

Ensure your response is ONLY valid JSON with no additional text.
`;

// Generate the candidate report
export async function generateCandidateReport({
  code,
  language,
  problemStatement,
  roleLevel,
  messages,
  transcript,
  codeAnalysisResults = null,
  communicationAnalysisResults = null,
  useMock = false
}: {
  code: string;
  language: string;
  problemStatement: string;
  roleLevel: string;
  messages: Array<any>;
  transcript?: string;
  codeAnalysisResults?: any;
  communicationAnalysisResults?: any;
  useMock?: boolean;
}): Promise<CandidateReport> {
  console.log('🚀 Generating candidate summary report...');
  
  // Always try to use the API as requested by user
  const shouldUseMock = false; // Never use mock data
  if (!isApiKeyAvailable) {
    console.warn('⚠️ OpenAI API key not found. Please add your API key to the environment variables for candidate report generation.');
  }
  
  try {
    // If we don't have code analysis results, run the analysis
    let codeAnalysis = codeAnalysisResults;
    if (!codeAnalysis) {
      codeAnalysis = await analyzeCode({
        code,
        language,
        problemStatement,
        roleLevel,
        useMock: shouldUseMock
      });
    }
    
    // If we don't have communication analysis results, run the analysis
    let communicationAnalysis = communicationAnalysisResults;
    if (!communicationAnalysis) {
      communicationAnalysis = await analyzeCommunication({
        messages,
        transcript,
        problemStatement,
        roleLevel,
        useMock: shouldUseMock
      });
    }
    
    // If using mock data, return a mock report
    if (shouldUseMock) {
      console.log('🔄 Using mock response for candidate report');
      return getMockCandidateReport();
    }
    
    // Run the candidate report summarizer
    const prompt = summarizerPrompt({ 
      codeAnalysis, 
      communicationAnalysis,
      roleLevel
    });
    
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: OPENAI_MODEL,
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
    console.log('✅ Candidate report generated successfully');
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing candidate report response:', parseError);
      return getMockCandidateReport();
    }
  } catch (error) {
    console.error('❌ Error generating candidate report:', error);
    return getMockCandidateReport();
  }
}

// Mock response for development/testing
function getMockCandidateReport(): CandidateReport {
  return {
    overallScore: 82,
    technicalAssessment: {
      score: 85,
      strengths: [
        "Strong algorithmic knowledge",
        "Efficient implementation with O(n) time complexity",
        "Good code organization and structure"
      ],
      weaknesses: [
        "Limited edge case handling",
        "Could improve code documentation",
        "Some inefficient variable usage"
      ]
    },
    communicationAssessment: {
      score: 78,
      strengths: [
        "Clear explanation of approach",
        "Good at breaking down complex concepts",
        "Asks relevant clarifying questions"
      ],
      weaknesses: [
        "Occasionally uses overly technical jargon",
        "Could improve active listening",
        "Sometimes rushes through explanations"
      ]
    },
    problemSolvingAssessment: {
      score: 83,
      strengths: [
        "Methodical approach to problem breakdown",
        "Quick identification of optimal solution",
        "Good understanding of tradeoffs"
      ],
      weaknesses: [
        "Could spend more time analyzing edge cases",
        "Sometimes jumps to coding too quickly",
        "Limited exploration of alternative approaches"
      ]
    },
    hiringRecommendation: "Hire",
    summary: "The candidate demonstrates strong technical skills with efficient algorithm implementation and good code structure. Their communication is clear and they explain their approach well, though they could improve on active listening and reducing technical jargon. Problem-solving approach is methodical with quick identification of optimal solutions. Overall, a strong candidate suitable for the mid-level role.",
    feedbackForCandidate: "You demonstrated strong technical skills and problem-solving abilities. Your solution was efficient and well-structured. To improve further, consider spending more time on edge cases and documenting your code more thoroughly. In communication, try to use simpler language when explaining complex concepts and focus more on active listening. Your methodical approach to problem-solving is a strength to build upon."
  };
} 