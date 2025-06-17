import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  RefreshCw, 
  Loader2, 
  Copy, 
  Check,
  Send,
  Edit
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { useInterview } from '@/contexts/InterviewContext';
import { generateFeedback, FeedbackResult } from '@/integrations/openai/feedbackGenerator';

interface FeedbackGeneratorProps {
  candidateName?: string;
  position?: string;
  onFeedbackGenerated?: (feedback: FeedbackResult) => void;
}

const FeedbackGenerator: React.FC<FeedbackGeneratorProps> = ({
  candidateName = '',
  position = 'Software Developer',
  onFeedbackGenerated
}) => {
  const { toast } = useToast();
  const { 
    analysisResults, 
    plagiarismResults,
    feedbackResults,
    setFeedbackResults,
    isFeedbackGenerating,
    setIsFeedbackGenerating,
    lastFeedbackGenerationTime,
    setLastFeedbackGenerationTime
  } = useInterview();
  
  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Form state
  const [name, setName] = useState(candidateName);
  const [jobPosition, setJobPosition] = useState(position);
  const [hiringDecision, setHiringDecision] = useState<'offer' | 'reject' | 'continue'>('continue');
  const [feedbackTone, setFeedbackTone] = useState<'encouraging' | 'direct' | 'constructive'>('constructive');
  const [includeSpecifics, setIncludeSpecifics] = useState(true);
  
  // Wrapped state setters with logging
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`📝 Candidate name changed: ${e.target.value}`);
    setName(e.target.value);
  };
  
  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`📝 Position changed: ${e.target.value}`);
    setJobPosition(e.target.value);
  };
  
  const handleHiringDecisionChange = (value: string) => {
    console.log(`📝 Hiring decision changed: ${value}`);
    setHiringDecision(value as 'offer' | 'reject' | 'continue');
  };
  
  const handleFeedbackToneChange = (value: string) => {
    console.log(`📝 Feedback tone changed: ${value}`);
    setFeedbackTone(value as 'encouraging' | 'direct' | 'constructive');
  };
  
  const handleIncludeSpecificsChange = (checked: boolean) => {
    console.log(`📝 Include specifics changed: ${checked}`);
    setIncludeSpecifics(checked);
  };
  
  const handleStartEditing = () => {
    console.log('✏️ Started editing feedback');
    setIsEditing(true);
  };
  
  const handleCancelEditing = () => {
    console.log('❌ Cancelled editing feedback');
    setIsEditing(false);
  };
  
  // Update name and position when props change
  useEffect(() => {
    setName(candidateName);
    setJobPosition(position);
  }, [candidateName, position]);
  
  // Update edited content when feedback results change
  useEffect(() => {
    if (feedbackResults) {
      setEditedSubject(feedbackResults.subject);
      setEditedBody(feedbackResults.body);
    }
  }, [feedbackResults]);
  
  // Calculate scores from analysis results
  const getTechnicalScore = () => {
    if (!analysisResults) return 75;
    return analysisResults.overallSummary.score;
  };
  
  const getCommunicationScore = () => {
    // This would ideally come from communication analysis
    return 80;
  };
  
  const getCodeQualityScore = () => {
    if (!analysisResults) return 70;
    
    // Average of correctness and style scores
    const correctnessScore = analysisResults.correctness.score;
    const styleScore = analysisResults.style.score;
    return Math.round((correctnessScore + styleScore) / 2);
  };
  
  const getProblemSolvingScore = () => {
    if (!analysisResults) return 75;
    
    // Average of complexity and edge cases scores
    const complexityScore = analysisResults.complexity.score;
    const edgeCasesScore = analysisResults.edgeCases.score;
    return Math.round((complexityScore + edgeCasesScore) / 2);
  };
  
  const getStrengths = () => {
    if (!analysisResults) return ["Strong problem-solving approach", "Good coding practices"];
    return analysisResults.overallSummary.strengths;
  };
  
  const getWeaknesses = () => {
    if (!analysisResults) return ["Could improve code documentation", "Limited test coverage"];
    return analysisResults.overallSummary.weaknesses;
  };
  
  const generateFeedbackEmail = async () => {
    console.log('Starting feedback generation process...');
    setIsFeedbackGenerating(true);
    
    try {
      console.log('Preparing feedback parameters:', {
        candidateName: name,
        position: jobPosition,
        technicalScore: getTechnicalScore(),
        communicationScore: getCommunicationScore(),
        codeQualityScore: getCodeQualityScore(),
        problemSolvingScore: getProblemSolvingScore(),
        strengths: getStrengths().length,
        weaknesses: getWeaknesses().length,
        hiringDecision,
        feedbackTone,
        includeSpecifics
      });
      
      const result = await generateFeedback({
        candidateName: name,
        position: jobPosition,
        technicalScore: getTechnicalScore(),
        communicationScore: getCommunicationScore(),
        codeQualityScore: getCodeQualityScore(),
        problemSolvingScore: getProblemSolvingScore(),
        strengths: getStrengths(),
        weaknesses: getWeaknesses(),
        hiringDecision,
        feedbackTone,
        includeSpecifics,
        useMock: false
      });
      
      console.log('Feedback generation successful:', {
        subjectLength: result.subject.length,
        bodyLength: result.body.length,
        hasFollowUp: !!result.followUpSuggestion
      });
      
      setFeedbackResults(result);
      setEditedSubject(result.subject);
      setEditedBody(result.body);
      setLastFeedbackGenerationTime(new Date());
      console.log('Feedback state updated, timestamp:', new Date().toISOString());
      
      if (onFeedbackGenerated) {
        console.log('Calling onFeedbackGenerated callback');
        onFeedbackGenerated(result);
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast({
        title: "Error",
        description: "Failed to generate feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      console.log('Feedback generation process completed');
      setIsFeedbackGenerating(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    console.log(`📋 Copying text to clipboard (${text.length} characters)`);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied!",
      description: "Feedback copied to clipboard",
      duration: 2000
    });
  };
  
  const saveEdits = () => {
    console.log('💾 Saving feedback edits');
    if (feedbackResults) {
      setFeedbackResults({
        ...feedbackResults,
        subject: editedSubject,
        body: editedBody
      });
    }
    setIsEditing(false);
    
    toast({
      title: "Saved",
      description: "Your edits have been saved",
      duration: 2000
    });
  };
  
  return (
    <div className="h-full flex flex-col" data-feedback-generator>
      <div className="bg-dark-secondary border-b border-border-dark p-4 flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="w-5 h-5 text-blue-400 mr-2" />
          <h2 className="text-white text-base font-medium">Feedback Generator</h2>
        </div>
        <div className="flex items-center space-x-2">
          {lastFeedbackGenerationTime && (
            <span className="text-text-secondary text-xs mr-2">
              Last updated: {lastFeedbackGenerationTime.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r border-border-dark p-4 overflow-y-auto">
          <h3 className="text-white font-medium mb-4">Feedback Settings</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="candidate-name">Candidate Name</Label>
              <Input 
                id="candidate-name"
                value={name}
                onChange={handleNameChange}
                className="bg-dark-primary border-border-dark text-white"
                placeholder="Enter candidate name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input 
                id="position"
                value={jobPosition}
                onChange={handlePositionChange}
                className="bg-dark-primary border-border-dark text-white"
                placeholder="Enter job position"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hiring-decision">Hiring Decision</Label>
              <Select 
                value={hiringDecision}
                onValueChange={handleHiringDecisionChange}
              >
                <SelectTrigger className="bg-dark-primary border-border-dark text-white">
                  <SelectValue placeholder="Select decision" />
                </SelectTrigger>
                <SelectContent className="bg-dark-secondary border-border-dark">
                  <SelectItem value="offer">Extend Offer</SelectItem>
                  <SelectItem value="continue">Continue Process</SelectItem>
                  <SelectItem value="reject">Reject Candidate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback-tone">Feedback Tone</Label>
              <Select 
                value={feedbackTone}
                onValueChange={handleFeedbackToneChange}
              >
                <SelectTrigger className="bg-dark-primary border-border-dark text-white">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="bg-dark-secondary border-border-dark">
                  <SelectItem value="encouraging">Encouraging</SelectItem>
                  <SelectItem value="constructive">Constructive</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="include-specifics"
                checked={includeSpecifics}
                onCheckedChange={handleIncludeSpecificsChange}
              />
              <Label htmlFor="include-specifics">Include specific examples</Label>
            </div>
            
            <Button 
              onClick={generateFeedbackEmail}
              disabled={isFeedbackGenerating || !name || !jobPosition}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isFeedbackGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Feedback
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="w-2/3 p-4 overflow-y-auto">
          {isFeedbackGenerating ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
              <p className="text-text-secondary">Generating professional feedback...</p>
            </div>
          ) : feedbackResults ? (
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input 
                      id="subject"
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      className="bg-dark-primary border-border-dark text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="body">Email Body</Label>
                    <Textarea 
                      id="body"
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
                      className="bg-dark-primary border-border-dark text-white min-h-[300px]"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEditing}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={saveEdits}
                    >
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-dark-primary p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-medium">Subject</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(feedbackResults.subject)}
                        className="h-8 px-2 text-text-secondary hover:text-white"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-text-secondary">{feedbackResults.subject}</p>
                  </div>
                  
                  <div className="bg-dark-primary p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-medium">Email Body</h3>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleStartEditing}
                          className="h-8 px-2 text-text-secondary hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(feedbackResults.body)}
                          className="h-8 px-2 text-text-secondary hover:text-white"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="text-text-secondary whitespace-pre-line">
                      {feedbackResults.body}
                    </div>
                  </div>
                  
                  {feedbackResults.followUpSuggestion && (
                    <div className="bg-dark-primary p-4 rounded-md">
                      <h3 className="text-white font-medium mb-2">Follow-up Suggestion</h3>
                      <p className="text-text-secondary">{feedbackResults.followUpSuggestion}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      onClick={() => copyToClipboard(`Subject: ${feedbackResults.subject}\n\n${feedbackResults.body}`)}
                      variant="outline"
                      className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <MessageSquare className="w-12 h-12 text-text-secondary" />
              <p className="text-text-secondary">Configure settings and click "Generate Feedback" to create a professional message</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackGenerator;
