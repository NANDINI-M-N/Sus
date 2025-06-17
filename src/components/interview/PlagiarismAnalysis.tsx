import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  RefreshCw, 
  AlertTriangle, 
  FileSearch,
  Fingerprint,
  Loader2
} from 'lucide-react';
import { analyzePlagiarism, PlagiarismIssue } from '@/integrations/openai/plagiarismAnalysis';
import { useInterview } from '@/contexts/InterviewContext';

interface PlagiarismAnalysisProps {
  code: string;
  language: string;
  problemStatement?: string;
  onAnalysisComplete?: (score: number, summary: string) => void;
}

const PlagiarismAnalysis: React.FC<PlagiarismAnalysisProps> = ({
  code,
  language,
  problemStatement = '',
  onAnalysisComplete
}) => {
  // Use context for state management
  const { 
    plagiarismResults, 
    setPlagiarismResults,
    isPlagiarismAnalyzing, 
    setIsPlagiarismAnalyzing,
    lastPlagiarismAnalysisTime, 
    setLastPlagiarismAnalysisTime
  } = useInterview();
  
  // Local state as fallback and for UI purposes
  const [localIsAnalyzing, setLocalIsAnalyzing] = useState(false);

  // Function to run plagiarism analysis
  const runAnalysis = async () => {
    console.log('🚀 Starting plagiarism analysis...');
    setIsPlagiarismAnalyzing(true);
    setLocalIsAnalyzing(true);
    
    try {
      // Use mock response for development, set to false for production
      const useMock = false;
      console.log(`🔄 Using ${useMock ? 'mock' : 'real'} responses for plagiarism analysis`);
      
      const result = await analyzePlagiarism({
        code,
        language,
        problemStatement,
        useMock
      });
      
      console.log('✅ Plagiarism analysis complete, updating UI with results');
      
      // Update context with results
      setPlagiarismResults(result);
      
      setIsPlagiarismAnalyzing(false);
      setLocalIsAnalyzing(false);
      setLastPlagiarismAnalysisTime(new Date());
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result.score, result.summary);
      }
      
    } catch (error) {
      console.error('❌ Error during plagiarism analysis:', error);
      setIsPlagiarismAnalyzing(false);
      setLocalIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-tech-green';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-tech-green/20';
    if (score >= 60) return 'bg-yellow-400/20';
    return 'bg-red-400/20';
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'major': return 'text-orange-400';
      case 'minor': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="outline" className="border-red-400 text-red-400">Critical</Badge>;
      case 'major':
        return <Badge variant="outline" className="border-orange-400 text-orange-400">Major</Badge>;
      case 'minor':
        return <Badge variant="outline" className="border-yellow-400 text-yellow-400">Minor</Badge>;
      case 'info':
        return <Badge variant="outline" className="border-blue-400 text-blue-400">Info</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-400 text-gray-400">Unknown</Badge>;
    }
  };

  return (
    <div className="h-full flex flex-col" data-plagiarism-analysis>
      <div className="bg-dark-secondary border-b border-border-dark p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Fingerprint className="w-5 h-5 text-purple-400 mr-2" />
          <h2 className="text-white text-base font-medium">Plagiarism Analysis</h2>
        </div>
        <div className="flex items-center space-x-2">
          {lastPlagiarismAnalysisTime && (
            <span className="text-text-secondary text-xs mr-2">
              Last updated: {lastPlagiarismAnalysisTime.toLocaleTimeString()}
            </span>
          )}
          <Button 
            variant="default" 
            size="sm" 
            onClick={runAnalysis}
            disabled={isPlagiarismAnalyzing || localIsAnalyzing}
            className="bg-purple-500 hover:bg-purple-600 text-white"
            data-analyze-button
          >
            {isPlagiarismAnalyzing || localIsAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-1" />
                Check Originality
              </>
            )}
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-6">
          {isPlagiarismAnalyzing || localIsAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
              <p className="text-text-secondary">Analyzing code for plagiarism...</p>
            </div>
          ) : lastPlagiarismAnalysisTime && plagiarismResults ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-xl font-semibold">Originality Score</h3>
                <div className="flex items-center">
                  <span className={`text-3xl font-bold ${getScoreColor(plagiarismResults.score)}`}>
                    {plagiarismResults.score}/100
                  </span>
                </div>
              </div>
              
              <div className="bg-dark-primary p-4 rounded-md">
                <h4 className="text-white font-medium mb-2">Summary</h4>
                <p className="text-text-secondary">{plagiarismResults.summary}</p>
              </div>
              
              {plagiarismResults.issues && plagiarismResults.issues.length > 0 && (
                                  <div>
                    <h4 className="text-white font-medium mb-3">Potential Similarity Issues</h4>
                    <div className="space-y-3">
                      {plagiarismResults.issues.map((issue, i) => (
                        <div key={i} className="bg-dark-primary p-3 rounded-md">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Copy className={`w-4 h-4 mr-2 ${getSeverityColor(issue.severity)}`} />
                              <span className="text-white">
                                {issue.line ? `Lines ${issue.line}-${issue.endLine || issue.line}` : 'General issue'}
                              </span>
                            </div>
                            {issue.severity && getSeverityBadge(issue.severity)}
                          </div>
                          <p className="text-text-secondary mt-2">{issue.description}</p>
                          {issue.possibleSource && (
                            <div className="mt-2 flex items-center">
                              <FileSearch className="w-4 h-4 text-blue-400 mr-1" />
                              <span className="text-blue-400 text-sm">Similar to: {issue.possibleSource}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {plagiarismResults.recommendations && plagiarismResults.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {plagiarismResults.recommendations.map((recommendation, i) => (
                        <li key={i} className="text-text-secondary">
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Fingerprint className="w-12 h-12 text-text-secondary" />
              <p className="text-text-secondary">Click "Check Originality" to analyze code for plagiarism</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlagiarismAnalysis; 