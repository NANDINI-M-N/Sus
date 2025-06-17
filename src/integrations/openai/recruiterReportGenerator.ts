import axios from 'axios';
import { CandidateReport } from './candidateReportSummarizer';

// Define the output type for the recruiter report
export interface RecruiterReport {
  candidateName: string;
  position: string;
  interviewDate: string;
  overallAssessment: string;
  technicalSkillsSummary: string;
  communicationSkillsSummary: string;
  problemSolvingAbility: string;
  culturalFitNotes: string;
  strengthsHighlights: string[];
  areasForImprovement: string[];
  hiringRecommendation: string;
  nextSteps: string[];
  additionalNotes: string;
}

// API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Recruiter report generator prompt
const recruiterReportPrompt = ({ 
  candidateReport,
  candidateName = 'the candidate',
  position = 'the position',
  interviewDate = new Date().toLocaleDateString()
}: {
  candidateReport: CandidateReport;
  candidateName?: string;
  position?: string;
  interviewDate?: string;
}) => `
You are a Technical Recruiter Communication Specialist who translates technical interview assessments into recruiter-friendly reports.

Technical Interview Results:
\`\`\`
${JSON.stringify(candidateReport, null, 2)}
\`\`\`

Candidate Name: ${candidateName}
Position: ${position}
Interview Date: ${interviewDate}

Create a comprehensive, natural language report for recruiters that explains the candidate's performance in non-technical terms.
Focus on:
1. Translating technical jargon into accessible language
2. Providing context for technical scores and assessments
3. Highlighting relevant strengths and weaknesses for the hiring process
4. Offering clear next steps based on the candidate's performance
5. Using a professional but conversational tone appropriate for recruiters

Provide your report in this JSON format:
{
  "candidateName": "${candidateName}",
  "position": "${position}",
  "interviewDate": "${interviewDate}",
  "overallAssessment": "<2-3 paragraphs summarizing the candidate's overall performance>",
  "technicalSkillsSummary": "<1-2 paragraphs explaining technical skills in non-technical terms>",
  "communicationSkillsSummary": "<1 paragraph about communication abilities>",
  "problemSolvingAbility": "<1 paragraph about problem-solving approach>",
  "culturalFitNotes": "<brief notes about potential team/culture fit based on communication style>",
  "strengthsHighlights": ["<key strength in recruiter-friendly language>", ...],
  "areasForImprovement": ["<development area in constructive, recruiter-friendly language>", ...],
  "hiringRecommendation": "<clear recommendation with context>",
  "nextSteps": ["<suggested next step in the hiring process>", ...],
  "additionalNotes": "<any other relevant information for the recruiter>"
}

Ensure your response is ONLY valid JSON with no additional text.
`;

// Generate the recruiter-friendly report
export async function generateRecruiterReport({
  candidateReport,
  candidateName = 'the candidate',
  position = 'the position',
  interviewDate = new Date().toLocaleDateString(),
  useMock = false
}: {
  candidateReport: CandidateReport;
  candidateName?: string;
  position?: string;
  interviewDate?: string;
  useMock?: boolean;
}): Promise<RecruiterReport> {
  console.log('🚀 Generating recruiter-friendly report...');
  
  if (useMock) {
    console.log('🔄 Using mock response for recruiter report');
    return getMockRecruiterReport(candidateName, position, interviewDate);
  }
  
  try {
    const prompt = recruiterReportPrompt({ 
      candidateReport, 
      candidateName, 
      position, 
      interviewDate 
    });
    
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4, // Slightly higher temperature for more natural language
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
    console.log('✅ Recruiter report generated successfully');
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing recruiter report response:', parseError);
      return getMockRecruiterReport(candidateName, position, interviewDate);
    }
  } catch (error) {
    console.error('❌ Error generating recruiter report:', error);
    return getMockRecruiterReport(candidateName, position, interviewDate);
  }
}

// Mock response for development/testing
function getMockRecruiterReport(
  candidateName: string = 'John Doe',
  position: string = 'Full Stack Developer',
  interviewDate: string = new Date().toLocaleDateString()
): RecruiterReport {
  return {
    candidateName,
    position,
    interviewDate,
    overallAssessment: `${candidateName} demonstrated strong potential for the ${position} role, scoring 82/100 overall. The interview revealed a candidate with solid technical foundations and good problem-solving abilities. Their approach to the coding challenge was methodical and they communicated their thought process clearly throughout the interview.

The candidate showed particular strength in algorithm implementation and code structure, producing an efficient solution that would work well in production environments. While they have some areas for growth, particularly in edge case handling and documentation, these are skills that can be developed with mentorship and experience on the job.`,
    
    technicalSkillsSummary: `In terms of technical abilities, ${candidateName} showed proficiency in writing clean, efficient code. They implemented a solution that runs quickly and uses memory effectively—important qualities for our development team. Their code was well-structured and followed good practices, though it could benefit from more comprehensive documentation. The candidate demonstrated good understanding of the programming language and relevant frameworks for the position.`,
    
    communicationSkillsSummary: `${candidateName} communicated clearly throughout the interview, explaining their approach and reasoning in an understandable way. They asked relevant clarifying questions before diving into the solution and were receptive to feedback. There were a few instances where they used technical jargon that might be difficult for non-technical team members to follow, but overall their communication style was effective.`,
    
    problemSolvingAbility: `The candidate approached the problem methodically, breaking it down into manageable parts before coding. They quickly identified an optimal approach and were able to explain the trade-offs between different possible solutions. ${candidateName} could benefit from spending more time analyzing potential edge cases before implementation, but their overall problem-solving approach was sound and thorough.`,
    
    culturalFitNotes: `Based on their communication style and collaborative approach during the interview, ${candidateName} appears to be a good cultural fit for our team. They were respectful, listened actively, and demonstrated a growth mindset when receiving feedback. Their methodical approach to problem-solving aligns well with our team's development practices.`,
    
    strengthsHighlights: [
      "Writes efficient, well-structured code that performs well",
      "Communicates technical concepts clearly and logically",
      "Takes a methodical approach to breaking down complex problems",
      "Demonstrates good knowledge of programming fundamentals",
      "Shows a collaborative and receptive attitude to feedback"
    ],
    
    areasForImprovement: [
      "Could be more thorough in considering edge cases and unexpected inputs",
      "Documentation practices need improvement for team collaboration",
      "Sometimes uses overly technical language that could be simplified",
      "Would benefit from exploring multiple solution approaches before implementation"
    ],
    
    hiringRecommendation: `Recommend to hire for the ${position} role. ${candidateName} has demonstrated the core technical and communication skills needed for success, with minor development areas that can be addressed through our onboarding and mentorship program.`,
    
    nextSteps: [
      "Schedule a team fit interview to assess cultural alignment",
      "Request a portfolio or code samples to review previous work",
      "Check references with focus on teamwork and collaboration skills",
      "Prepare competitive offer based on demonstrated technical skills"
    ],
    
    additionalNotes: `${candidateName} mentioned experience with our tech stack and showed enthusiasm about our product. Their background in similar projects suggests they could ramp up quickly. Consider discussing mentorship opportunities during the offer stage to address the identified areas for growth.`
  };
}
