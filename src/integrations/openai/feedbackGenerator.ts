import axios from 'axios';

// Add type definition for import.meta.env
interface ImportMetaEnv {
  VITE_OPENAI_API_KEY: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Define types for feedback generation
export interface FeedbackGeneratorInput {
  candidateName: string;
  position: string;
  technicalScore: number;
  communicationScore: number;
  codeQualityScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  hiringDecision: 'offer' | 'reject' | 'continue';
  feedbackTone: 'encouraging' | 'direct' | 'constructive';
  includeSpecifics: boolean;
}

export interface FeedbackResult {
  subject: string;
  body: string;
  followUpSuggestion?: string;
}

// API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Core input function
function createFeedbackInput({ 
  candidateName, 
  position,
  technicalScore,
  communicationScore,
  codeQualityScore,
  problemSolvingScore,
  strengths,
  weaknesses,
  hiringDecision,
  feedbackTone,
  includeSpecifics
}: FeedbackGeneratorInput) {
  return {
    candidateName,
    position,
    technicalScore,
    communicationScore,
    codeQualityScore,
    problemSolvingScore,
    strengths,
    weaknesses,
    hiringDecision,
    feedbackTone,
    includeSpecifics
  };
}

// Feedback generator prompt
const feedbackPrompt = ({
  candidateName,
  position,
  technicalScore,
  communicationScore,
  codeQualityScore,
  problemSolvingScore,
  strengths,
  weaknesses,
  hiringDecision,
  feedbackTone,
  includeSpecifics
}: FeedbackGeneratorInput) => `
You are a Professional Feedback Generator specializing in technical interview feedback.

Candidate: ${candidateName}
Position: ${position}
Hiring Decision: ${hiringDecision}
Feedback Tone: ${feedbackTone}

Assessment Scores:
- Technical Knowledge: ${technicalScore}/100
- Communication Skills: ${communicationScore}/100
- Code Quality: ${codeQualityScore}/100
- Problem Solving: ${problemSolvingScore}/100

Strengths:
${strengths.map(s => `- ${s}`).join('\n')}

Areas for Improvement:
${weaknesses.map(w => `- ${w}`).join('\n')}

Generate a professional feedback email that a hiring manager can send to this candidate. The email should:
1. Be written in a ${feedbackTone} tone
2. ${hiringDecision === 'offer' ? 'Convey enthusiasm about extending an offer' : 
    hiringDecision === 'reject' ? 'Respectfully communicate the decision not to proceed' : 
    'Express interest in continuing the interview process'}
3. Highlight the candidate's strengths
4. ${includeSpecifics ? 'Include specific examples from their performance' : 'Keep feedback general'}
5. ${hiringDecision !== 'reject' ? '' : 'Provide constructive feedback on areas for improvement'}
6. Be concise but thorough (200-300 words)
7. End with appropriate next steps

Provide your response in this JSON format:
{
  "subject": "<email subject line>",
  "body": "<email body with appropriate paragraphs and formatting>",
  "followUpSuggestion": "<optional suggestion for follow-up actions>"
}

Ensure your response is ONLY valid JSON with no additional text.
`;

// Run feedback generation
async function runFeedbackGenerator(input: FeedbackGeneratorInput): Promise<FeedbackResult> {
  console.log(`🔍 Running feedback generation...`);
  console.log(`📋 Input parameters: ${JSON.stringify({
    candidateName: input.candidateName,
    position: input.position,
    hiringDecision: input.hiringDecision,
    feedbackTone: input.feedbackTone
  })}`);
  
  try {
    const prompt = feedbackPrompt(input);
    console.log(`📝 Prompt created (${prompt.length} characters)`);
    
    console.log(`🌐 Making API request to OpenAI...`);
    const requestStartTime = performance.now();
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7, // Slightly higher for more natural language variation
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    const requestDuration = performance.now() - requestStartTime;
    console.log(`✅ API request completed in ${(requestDuration / 1000).toFixed(2)}s`);
    
    const content = response.data.choices[0].message.content;
    console.log(`📄 Received response of ${content.length} characters`);
    
    try {
      const parsedResult = JSON.parse(content);
      console.log(`✅ Successfully parsed JSON response`);
      console.log(`📊 Response stats: Subject (${parsedResult.subject.length} chars), Body (${parsedResult.body.length} chars), Follow-up: ${parsedResult.followUpSuggestion ? 'Yes' : 'No'}`);
      return parsedResult;
    } catch (parseError) {
      console.error(`❌ Error parsing feedback generation response:`, parseError);
      console.error('Raw response:', content);
      return {
        subject: "Error Generating Feedback",
        body: "There was an error generating the feedback. Please try again.",
        followUpSuggestion: "Check API connection and try again"
      };
    }
  } catch (error) {
    console.error(`❌ Error running feedback generation:`, error);
    if (axios.isAxiosError(error)) {
      console.error(`Status: ${error.response?.status}, Message: ${error.message}`);
      console.error(`Response data:`, error.response?.data);
    }
    return {
      subject: "Error Generating Feedback",
      body: "There was an error generating the feedback. Please try again.",
      followUpSuggestion: "Check API connection and try again"
    };
  }
}

// Mock data for development
function getMockFeedbackResponse(input: FeedbackGeneratorInput): FeedbackResult {
  console.log(`🔄 Using mock response for feedback generation`);
  
  const { candidateName, position, hiringDecision } = input;
  
  if (hiringDecision === 'offer') {
    return {
      subject: `Exciting News Regarding Your Application for ${position}`,
      body: `Dear ${candidateName},

I'm pleased to inform you that we were impressed by your performance during the technical interview for the ${position} role. Your strong problem-solving skills and technical knowledge stood out, and we believe you would be a valuable addition to our team.

We would like to extend an offer to you and discuss next steps. Our HR team will be in touch shortly with the formal offer details.

Congratulations, and we look forward to potentially welcoming you to the team!

Best regards,
Hiring Manager`,
      followUpSuggestion: "Schedule a call to discuss compensation and start date"
    };
  } else if (hiringDecision === 'reject') {
    return {
      subject: `Update on Your Application for ${position}`,
      body: `Dear ${candidateName},

Thank you for taking the time to interview for the ${position} position. We appreciate your interest in joining our team.

After careful consideration, we have decided to proceed with other candidates whose skills and experience more closely align with our current needs. Your technical knowledge was impressive, but we're looking for someone with more experience in specific areas relevant to this role.

We encourage you to continue developing your skills and would be happy to consider you for future opportunities that may be a better match.

Best regards,
Hiring Manager`,
      followUpSuggestion: "Keep candidate's resume on file for future positions"
    };
  } else {
    return {
      subject: `Next Steps in Your Interview Process for ${position}`,
      body: `Dear ${candidateName},

Thank you for your participation in the recent technical interview for the ${position} role. We were impressed with your approach to problem-solving and your communication skills.

We would like to invite you to the next stage of our interview process, which will involve a more in-depth technical discussion with our senior team members.

Our recruiting coordinator will reach out shortly to schedule this follow-up interview. In the meantime, please don't hesitate to ask if you have any questions.

Looking forward to continuing the conversation.

Best regards,
Hiring Manager`,
      followUpSuggestion: "Schedule follow-up interview within the next 7-10 days"
    };
  }
}

// Main export function
export async function generateFeedback({
  candidateName,
  position,
  technicalScore,
  communicationScore,
  codeQualityScore,
  problemSolvingScore,
  strengths,
  weaknesses,
  hiringDecision,
  feedbackTone,
  includeSpecifics,
  useMock = false
}: FeedbackGeneratorInput & { useMock?: boolean }): Promise<FeedbackResult> {
  console.log(`🚀 Generating feedback for ${candidateName} for position ${position}`);
  console.log(`📊 Scores - Technical: ${technicalScore}, Communication: ${communicationScore}, Code Quality: ${codeQualityScore}, Problem Solving: ${problemSolvingScore}`);
  console.log(`📝 Hiring decision: ${hiringDecision}, Tone: ${feedbackTone}, Include specifics: ${includeSpecifics}`);
  console.log(`💪 Strengths: ${strengths.length}, Weaknesses: ${weaknesses.length}`);
  console.log(`🔄 Using ${useMock ? 'mock data' : 'OpenAI API'}`);
  
  const startTime = performance.now();
  const input = createFeedbackInput({ 
    candidateName, 
    position,
    technicalScore,
    communicationScore,
    codeQualityScore,
    problemSolvingScore,
    strengths,
    weaknesses,
    hiringDecision,
    feedbackTone,
    includeSpecifics
  });

  try {
    console.log(`⏳ Starting feedback generation process...`);
    const result = useMock ? 
      getMockFeedbackResponse(input) : 
      await runFeedbackGenerator(input);
    
    const duration = performance.now() - startTime;
    console.log(`✅ Feedback generation complete in ${(duration / 1000).toFixed(2)}s`);
    console.log(`📈 Result stats: Subject (${result.subject.length} chars), Body (${result.body.length} chars)`);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`❌ Error in feedback generation after ${(duration / 1000).toFixed(2)}s:`, error);
    throw new Error('Failed to generate feedback');
  }
} 