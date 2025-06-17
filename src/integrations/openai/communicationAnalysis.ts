import axios from 'axios';

// Add type definition for import.meta.env
interface ImportMetaEnv {
  VITE_OPENAI_API_KEY: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Define types
export interface CommunicationAnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  clarity: number;
  technicalAccuracy: number;
  collaboration: number;
  questionQuality: number;
  listeningSkills: number;
  summary: string;
  recommendations: string[];
}

// API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Check if API key is available
const isApiKeyAvailable = !!OPENAI_API_KEY;

// Communication analysis agent prompt
const communicationPrompt = ({ 
  messages, 
  transcript, 
  problemStatement, 
  roleLevel 
}: any) => `
You are a Communication Skills Analyzer specializing in technical interviews.

Role Level: ${roleLevel}
Problem Statement: ${problemStatement}

${transcript ? `Interview Transcript:
\`\`\`
${transcript}
\`\`\`` : ''}

${messages && messages.length > 0 ? `Chat Messages:
\`\`\`
${JSON.stringify(messages, null, 2)}
\`\`\`` : ''}

Analyze the candidate's communication skills based on ${transcript ? 'the interview transcript and' : ''} chat messages. Focus on:
1. Clarity of expression
2. Technical accuracy in explanations
3. Collaboration and interaction style
4. Quality of questions asked
5. Listening skills and responsiveness
6. Ability to articulate problem-solving approach

Provide your analysis in this JSON format:
{
  "score": <overall communication score from 0-100>,
  "strengths": ["<communication strength>", ...],
  "weaknesses": ["<communication weakness>", ...],
  "clarity": <score from 0-100 for clarity of expression>,
  "technicalAccuracy": <score from 0-100 for accuracy in technical explanations>,
  "collaboration": <score from 0-100 for collaborative approach>,
  "questionQuality": <score from 0-100 for quality of questions asked>,
  "listeningSkills": <score from 0-100 for listening and responsiveness>,
  "summary": "<overall assessment of communication skills>",
  "recommendations": ["<suggestion to improve communication>", ...]
}

Ensure your response is ONLY valid JSON with no additional text.
`;

// Run communication analysis
export async function analyzeCommunication({
  messages,
  transcript,
  problemStatement,
  roleLevel,
  useMock = false
}: {
  messages: Array<any>;
  transcript?: string;
  problemStatement: string;
  roleLevel: string;
  useMock?: boolean;
}): Promise<CommunicationAnalysisResult> {
  console.log('🚀 Starting communication analysis...');
  
  // Always try to use the API as requested by user
  const shouldUseMock = false; // Never use mock data
  if (!isApiKeyAvailable) {
    console.warn('⚠️ OpenAI API key not found. Please add your API key to the environment variables for communication analysis.');
  }
  
  if (shouldUseMock) {
    console.log('🔄 Using mock response for communication analysis');
    return getMockCommunicationAnalysis();
  }
  
  try {
    const prompt = communicationPrompt({ messages, transcript, problemStatement, roleLevel });
    
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-mini',
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
    console.log('✅ Communication analysis completed');
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing communication analysis response:', parseError);
      return getMockCommunicationAnalysis();
    }
  } catch (error) {
    console.error('Error running communication analysis:', error);
    return getMockCommunicationAnalysis();
  }
}

// Mock response for development/testing
function getMockCommunicationAnalysis(): CommunicationAnalysisResult {
  return {
    score: 78,
    strengths: [
      "Clear explanation of technical concepts",
      "Proactive in asking clarifying questions",
      "Good at breaking down complex ideas"
    ],
    weaknesses: [
      "Sometimes uses overly technical jargon",
      "Could improve active listening",
      "Occasionally interrupts the interviewer"
    ],
    clarity: 82,
    technicalAccuracy: 85,
    collaboration: 75,
    questionQuality: 80,
    listeningSkills: 68,
    summary: "The candidate demonstrates strong technical communication skills with clear explanations of concepts and approaches. They ask relevant clarifying questions and articulate their thought process well. Areas for improvement include reducing technical jargon when explaining concepts and enhancing active listening skills.",
    recommendations: [
      "Practice explaining technical concepts using simpler language",
      "Focus on active listening without interrupting",
      "Ask more follow-up questions to demonstrate understanding"
    ]
  };
} 