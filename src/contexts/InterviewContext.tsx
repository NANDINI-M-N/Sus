import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AgentAnalysisResult } from '@/integrations/openai/codeQualityAnalysis';
import { PlagiarismAnalysisResult } from '@/integrations/openai/plagiarismAnalysis';
import { FeedbackResult } from '@/integrations/openai/feedbackGenerator';

// Define the shape of our context state
interface InterviewContextState {
  // Code editor state
  code: string;
  language: string;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  
  // Problem statement state
  problemStatement: string;
  roleLevel: string;
  setProblemStatement: (statement: string) => void;
  setRoleLevel: (level: string) => void;
  
  // Analysis state
  analysisResults: {
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
  } | null;
  setAnalysisResults: (results: any) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  lastAnalysisTime: Date | null;
  setLastAnalysisTime: (time: Date | null) => void;
  
  // Plagiarism analysis state
  plagiarismResults: PlagiarismAnalysisResult | null;
  setPlagiarismResults: (results: PlagiarismAnalysisResult | null) => void;
  isPlagiarismAnalyzing: boolean;
  setIsPlagiarismAnalyzing: (isAnalyzing: boolean) => void;
  lastPlagiarismAnalysisTime: Date | null;
  setLastPlagiarismAnalysisTime: (time: Date | null) => void;
  
  // Feedback generator state
  feedbackResults: FeedbackResult | null;
  setFeedbackResults: (results: FeedbackResult | null) => void;
  isFeedbackGenerating: boolean;
  setIsFeedbackGenerating: (isGenerating: boolean) => void;
  lastFeedbackGenerationTime: Date | null;
  setLastFeedbackGenerationTime: (time: Date | null) => void;
  
  // Chat state
  messages: Array<{
    id: string;
    sender: string;
    role: string;
    content: string;
    timestamp: Date;
  }>;
  addMessage: (message: { sender: string; role: string; content: string; }) => void;
  
  // Notes state (private notes)
  notes: string;
  setNotes: (notes: string) => void;
  
  // Shared notes state
  sharedNotes: string;
  setSharedNotes: (notes: string) => void;
  lastSharedNotesUpdate: Date | null;
  setLastSharedNotesUpdate: (time: Date | null) => void;
  isEditingSharedNotes: boolean;
  setIsEditingSharedNotes: (isEditing: boolean) => void;
  
  // Transcript state
  transcript: string;
  setTranscript: (transcript: string) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  transcriptLines: Array<{
    speaker: string;
    text: string;
    timestamp: Date;
  }>;
  addTranscriptLine: (line: { speaker: string; text: string; }) => void;
}

// Create the context with a default value
const InterviewContext = createContext<InterviewContextState | undefined>(undefined);

// Provider component
export const InterviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Code editor state
  const [code, setCode] = useState<string>(`// Two Sum Problem
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`);
  const [language, setLanguage] = useState<string>('javascript');
  
  // Problem statement state
  const [problemStatement, setProblemStatement] = useState<string>(
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'
  );
  const [roleLevel, setRoleLevel] = useState<string>('mid-level');
  
  // Analysis state
  const [analysisResults, setAnalysisResults] = useState<InterviewContextState['analysisResults']>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);
  
  // Plagiarism analysis state
  const [plagiarismResults, setPlagiarismResults] = useState<PlagiarismAnalysisResult | null>(null);
  const [isPlagiarismAnalyzing, setIsPlagiarismAnalyzing] = useState<boolean>(false);
  const [lastPlagiarismAnalysisTime, setLastPlagiarismAnalysisTime] = useState<Date | null>(null);
  
  // Feedback generator state
  const [feedbackResults, setFeedbackResults] = useState<FeedbackResult | null>(null);
  const [isFeedbackGenerating, setIsFeedbackGenerating] = useState<boolean>(false);
  const [lastFeedbackGenerationTime, setLastFeedbackGenerationTime] = useState<Date | null>(null);
  
  // Wrap state setters with console logs
  const wrappedSetFeedbackResults = (results: FeedbackResult | null) => {
    console.log('📊 Setting feedback results:', results ? {
      subject: results.subject.substring(0, 30) + '...',
      bodyLength: results.body.length,
      hasFollowUp: !!results.followUpSuggestion
    } : 'null');
    setFeedbackResults(results);
  };
  
  const wrappedSetIsFeedbackGenerating = (isGenerating: boolean) => {
    console.log(`🔄 Setting feedback generating state: ${isGenerating}`);
    setIsFeedbackGenerating(isGenerating);
  };
  
  const wrappedSetLastFeedbackGenerationTime = (time: Date | null) => {
    console.log(`⏱️ Setting last feedback generation time: ${time?.toISOString() || 'null'}`);
    setLastFeedbackGenerationTime(time);
  };
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'John Doe',
      role: 'Interviewer',
      content: 'Welcome to the interview! Please feel free to ask any questions during our session.',
      timestamp: new Date()
    },
    {
      id: '2',
      sender: 'Sarah Chen',
      role: 'Candidate',
      content: 'Thank you! I\'m excited to get started. Should I begin with the coding challenge?',
      timestamp: new Date()
    }
  ]);
  
  const addMessage = (message: { sender: string; role: string; content: string; }) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        ...message,
        timestamp: new Date()
      }
    ]);
  };
  
  // Private notes state
  const [notes, setNotes] = useState<string>(
    `Candidate shows strong understanding of JavaScript fundamentals.
    
- Quickly identified the optimal approach for the Two Sum problem
- Used appropriate data structure (HashMap/Map) for O(n) solution
- Good communication skills while explaining the solution
- Asked clarifying questions about edge cases
                    
Areas for improvement:
- Could add more comments to explain the code
- Consider discussing time and space complexity earlier`
  );
  
  // Shared notes state
  const [sharedNotes, setSharedNotes] = useState<string>('');
  const [lastSharedNotesUpdate, setLastSharedNotesUpdate] = useState<Date | null>(null);
  const [isEditingSharedNotes, setIsEditingSharedNotes] = useState<boolean>(false);
  
  // Update lastSharedNotesUpdate whenever sharedNotes changes
  useEffect(() => {
    if (!isEditingSharedNotes && sharedNotes) {
      setLastSharedNotesUpdate(new Date());
    }
  }, [sharedNotes, isEditingSharedNotes]);
  
  // Transcript state
  const [transcript, setTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcriptLines, setTranscriptLines] = useState<Array<{
    speaker: string;
    text: string;
    timestamp: Date;
  }>>([]);
  
  const addTranscriptLine = (line: { speaker: string; text: string; }) => {
    const newLine = {
      ...line,
      timestamp: new Date()
    };
    
    setTranscriptLines(prev => [...prev, newLine]);
    
    // Also update the full transcript
    setTranscript(prev => {
      const newEntry = `[${newLine.timestamp.toLocaleTimeString()}] ${newLine.speaker}: ${newLine.text}\n`;
      return prev + newEntry;
    });
    
    // Optionally add to messages as well
    addMessage({
      sender: line.speaker,
      role: line.speaker === 'Interviewer' ? 'Interviewer' : 'Candidate',
      content: line.text
    });
  };
  
  // Create the context value object
  const contextValue: InterviewContextState = {
    code,
    language,
    setCode,
    setLanguage,
    problemStatement,
    roleLevel,
    setProblemStatement,
    setRoleLevel,
    analysisResults,
    setAnalysisResults,
    isAnalyzing,
    setIsAnalyzing,
    lastAnalysisTime,
    setLastAnalysisTime,
    plagiarismResults,
    setPlagiarismResults,
    isPlagiarismAnalyzing,
    setIsPlagiarismAnalyzing,
    lastPlagiarismAnalysisTime,
    setLastPlagiarismAnalysisTime,
    feedbackResults,
    setFeedbackResults: wrappedSetFeedbackResults,
    isFeedbackGenerating,
    setIsFeedbackGenerating: wrappedSetIsFeedbackGenerating,
    lastFeedbackGenerationTime,
    setLastFeedbackGenerationTime: wrappedSetLastFeedbackGenerationTime,
    messages,
    addMessage,
    notes,
    setNotes,
    sharedNotes,
    setSharedNotes,
    lastSharedNotesUpdate,
    setLastSharedNotesUpdate,
    isEditingSharedNotes,
    setIsEditingSharedNotes,
    transcript,
    setTranscript,
    isRecording,
    setIsRecording,
    transcriptLines,
    addTranscriptLine
  };
  
  return (
    <InterviewContext.Provider value={contextValue}>
      {children}
    </InterviewContext.Provider>
  );
};

// Custom hook for using the context
export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}; 