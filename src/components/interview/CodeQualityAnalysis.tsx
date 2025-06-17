import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Code2, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Cpu, 
  Shield, 
  Eye, 
  Zap,
  FileCode,
  Layers,
  Loader2
} from 'lucide-react';
import { analyzeCode, AgentAnalysisResult as AgentResult } from '@/integrations/openai/codeQualityAnalysis';

// Define types for our analysis results
interface AnalysisIssue {
  line?: number;
  description: string;
  severity?: 'critical' | 'major' | 'minor' | 'info';
}

interface AgentAnalysisResult {
  score: number;
  loading: boolean;
  issues: AnalysisIssue[];
  summary: string;
  recommendations?: string[];
}

interface CodeQualityAnalysisProps {
  code: string;
  language: string;
  problemStatement?: string;
  roleLevel?: string;
  onAnalysisComplete?: (overallScore: number, summary: string) => void;
}

const CodeQualityAnalysis: React.FC<CodeQualityAnalysisProps> = ({
  code,
  language,
  problemStatement = '',
  roleLevel = 'mid-level',
  onAnalysisComplete
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);
  
  // Analysis results for each agent
  const [correctnessAnalysis, setCorrectnessAnalysis] = useState<AgentAnalysisResult>({
    score: 0,
    loading: false,
    issues: [],
    summary: ''
  });
  
  const [complexityAnalysis, setComplexityAnalysis] = useState<AgentAnalysisResult>({
    score: 0,
    loading: false,
    issues: [],
    summary: ''
  });
  
  const [edgeCaseAnalysis, setEdgeCaseAnalysis] = useState<AgentAnalysisResult>({
    score: 0,
    loading: false,
    issues: [],
    summary: ''
  });
  
  const [performanceAnalysis, setPerformanceAnalysis] = useState<AgentAnalysisResult>({
    score: 0,
    loading: false,
    issues: [],
    summary: ''
  });
  
  const [securityAnalysis, setSecurityAnalysis] = useState<AgentAnalysisResult>({
    score: 0,
    loading: false,
    issues: [],
    summary: ''
  });
  
  const [styleAnalysis, setStyleAnalysis] = useState<AgentAnalysisResult>({
    score: 0,
    loading: false,
    issues: [],
    summary: ''
  });
  
  const [overallSummary, setOverallSummary] = useState({
    score: 0,
    strengths: [] as string[],
    weaknesses: [] as string[],
    hiringRecommendation: '',
    summary: ''
  });

  // Function to run analysis using our agent-based service
  const runAnalysis = async () => {
    console.log('🚀 Starting code quality analysis...');
    setIsAnalyzing(true);
    
    // Reset all analysis states
    setCorrectnessAnalysis({ score: 0, loading: true, issues: [], summary: '' });
    setComplexityAnalysis({ score: 0, loading: true, issues: [], summary: '' });
    setEdgeCaseAnalysis({ score: 0, loading: true, issues: [], summary: '' });
    setPerformanceAnalysis({ score: 0, loading: true, issues: [], summary: '' });
    setSecurityAnalysis({ score: 0, loading: true, issues: [], summary: '' });
    setStyleAnalysis({ score: 0, loading: true, issues: [], summary: '' });
    
    try {
      // Always use real API calls
      const useMock = false;
      console.log(`🔄 Using ${useMock ? 'mock' : 'real'} responses for analysis`);
      
      const result = await analyzeCode({
        code,
        language,
        problemStatement,
        roleLevel,
        useMock
      });
      
      console.log('✅ Analysis complete, updating UI with results');
      
      // Update states with results
      setCorrectnessAnalysis({
        score: result.correctness.score,
        loading: false,
        issues: result.correctness.issues,
        summary: result.correctness.summary,
        recommendations: result.correctness.recommendations
      });
      
      setComplexityAnalysis({
        score: result.complexity.score,
        loading: false,
        issues: result.complexity.issues,
        summary: result.complexity.summary,
        recommendations: result.complexity.recommendations
      });
      
      setEdgeCaseAnalysis({
        score: result.edgeCases.score,
        loading: false,
        issues: result.edgeCases.issues,
        summary: result.edgeCases.summary,
        recommendations: result.edgeCases.recommendations
      });
      
      setPerformanceAnalysis({
        score: result.performance.score,
        loading: false,
        issues: result.performance.issues,
        summary: result.performance.summary,
        recommendations: result.performance.recommendations
      });
      
      setSecurityAnalysis({
        score: result.security.score,
        loading: false,
        issues: result.security.issues,
        summary: result.security.summary,
        recommendations: result.security.recommendations
      });
      
      setStyleAnalysis({
        score: result.style.score,
        loading: false,
        issues: result.style.issues,
        summary: result.style.summary,
        recommendations: result.style.recommendations
      });
      
      setOverallSummary({
        score: result.overallSummary.score,
        strengths: result.overallSummary.strengths || [],
        weaknesses: result.overallSummary.weaknesses || [],
        hiringRecommendation: result.overallSummary.hiringRecommendation || '',
        summary: result.overallSummary.summary || ''
      });
      
      setIsAnalyzing(false);
      setLastAnalysisTime(new Date());
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result.overallSummary.score, result.overallSummary.summary);
      }
      
    } catch (error) {
      console.error('❌ Error during code analysis:', error);
      setIsAnalyzing(false);
      
      // Reset loading states on error
      setCorrectnessAnalysis(prev => ({ ...prev, loading: false }));
      setComplexityAnalysis(prev => ({ ...prev, loading: false }));
      setEdgeCaseAnalysis(prev => ({ ...prev, loading: false }));
      setPerformanceAnalysis(prev => ({ ...prev, loading: false }));
      setSecurityAnalysis(prev => ({ ...prev, loading: false }));
      setStyleAnalysis(prev => ({ ...prev, loading: false }));
    }
  };

  // Utility functions for UI display
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-tech-green';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-tech-green';
    if (score >= 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };
  
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'major': return 'text-orange-400';
      case 'minor': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-white';
    }
  };
  
  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'major':
        return <Badge variant="destructive" className="bg-orange-600">Major</Badge>;
      case 'minor':
        return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Minor</Badge>;
      case 'info':
        return <Badge variant="outline" className="text-blue-400 border-blue-400">Info</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-tech-green" />
          <h2 className="text-lg font-medium text-white">Code Quality Analysis</h2>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={runAnalysis}
          disabled={isAnalyzing || !code}
          className="flex items-center space-x-1"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-1" />
              Analyze Code
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border">
          <TabsList className="h-12 bg-transparent p-0 w-full flex justify-start">
            <TabsTrigger value="summary" className="h-12 px-4 data-[state=active]:text-tech-green">
              Summary
            </TabsTrigger>
            <TabsTrigger value="correctness" className="h-12 px-4 data-[state=active]:text-tech-green">
              Correctness
            </TabsTrigger>
            <TabsTrigger value="complexity" className="h-12 px-4 data-[state=active]:text-tech-green">
              Complexity
            </TabsTrigger>
            <TabsTrigger value="edge-cases" className="h-12 px-4 data-[state=active]:text-tech-green">
              Edge Cases
            </TabsTrigger>
            <TabsTrigger value="performance" className="h-12 px-4 data-[state=active]:text-tech-green">
              Performance
            </TabsTrigger>
            <TabsTrigger value="security" className="h-12 px-4 data-[state=active]:text-tech-green">
              Security
            </TabsTrigger>
            <TabsTrigger value="style" className="h-12 px-4 data-[state=active]:text-tech-green">
              Style
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="summary" className="m-0 p-0 h-full">
          <ScrollArea className="h-full">
            <div className="p-6">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="w-12 h-12 text-tech-green animate-spin" />
                  <p className="text-text-secondary">Analyzing code quality...</p>
                </div>
              ) : overallSummary.score > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl font-semibold">Overall Score</h3>
                    <div className="flex items-center">
                      <span className={`text-3xl font-bold ${getScoreColor(overallSummary.score)}`}>
                        {overallSummary.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-dark-primary p-4 rounded-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-tech-green" />
                        <h4 className="text-white font-medium">Correctness</h4>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-2xl font-bold ${getScoreColor(correctnessAnalysis.score)}`}>
                          {correctnessAnalysis.score}
                        </span>
                        <span className="text-text-secondary text-sm ml-1">/100</span>
                      </div>
                      <Progress 
                        value={correctnessAnalysis.score} 
                        className={`h-2 ${getScoreBackground(correctnessAnalysis.score)}`} 
                      />
                    </div>
                    
                    <div className="bg-dark-primary p-4 rounded-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <Layers className="w-4 h-4 text-blue-400" />
                        <h4 className="text-white font-medium">Complexity</h4>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-2xl font-bold ${getScoreColor(complexityAnalysis.score)}`}>
                          {complexityAnalysis.score}
                        </span>
                        <span className="text-text-secondary text-sm ml-1">/100</span>
                      </div>
                      <Progress 
                        value={complexityAnalysis.score} 
                        className={`h-2 ${getScoreBackground(complexityAnalysis.score)}`} 
                      />
                    </div>
                    
                    <div className="bg-dark-primary p-4 rounded-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <h4 className="text-white font-medium">Edge Cases</h4>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-2xl font-bold ${getScoreColor(edgeCaseAnalysis.score)}`}>
                          {edgeCaseAnalysis.score}
                        </span>
                        <span className="text-text-secondary text-sm ml-1">/100</span>
                      </div>
                      <Progress 
                        value={edgeCaseAnalysis.score} 
                        className={`h-2 ${getScoreBackground(edgeCaseAnalysis.score)}`} 
                      />
                    </div>
                    
                    <div className="bg-dark-primary p-4 rounded-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <h4 className="text-white font-medium">Performance</h4>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-2xl font-bold ${getScoreColor(performanceAnalysis.score)}`}>
                          {performanceAnalysis.score}
                        </span>
                        <span className="text-text-secondary text-sm ml-1">/100</span>
                      </div>
                      <Progress 
                        value={performanceAnalysis.score} 
                        className={`h-2 ${getScoreBackground(performanceAnalysis.score)}`} 
                      />
                    </div>
                    
                    <div className="bg-dark-primary p-4 rounded-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-4 h-4 text-red-400" />
                        <h4 className="text-white font-medium">Security</h4>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-2xl font-bold ${getScoreColor(securityAnalysis.score)}`}>
                          {securityAnalysis.score}
                        </span>
                        <span className="text-text-secondary text-sm ml-1">/100</span>
                      </div>
                      <Progress 
                        value={securityAnalysis.score} 
                        className={`h-2 ${getScoreBackground(securityAnalysis.score)}`} 
                      />
                    </div>
                    
                    <div className="bg-dark-primary p-4 rounded-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <Eye className="w-4 h-4 text-orange-400" />
                        <h4 className="text-white font-medium">Style</h4>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-2xl font-bold ${getScoreColor(styleAnalysis.score)}`}>
                          {styleAnalysis.score}
                        </span>
                        <span className="text-text-secondary text-sm ml-1">/100</span>
                      </div>
                      <Progress 
                        value={styleAnalysis.score} 
                        className={`h-2 ${getScoreBackground(styleAnalysis.score)}`} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <div>
                      <h3 className="text-white font-medium mb-2">Key Strengths</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {overallSummary.strengths && overallSummary.strengths.length > 0 ? (
                          overallSummary.strengths.map((strength, i) => (
                            <li key={i} className="text-tech-green text-sm">
                              <span className="text-white">{strength}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-text-secondary">No strengths identified yet</li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium mb-2">Areas for Improvement</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {overallSummary.weaknesses && overallSummary.weaknesses.length > 0 ? (
                          overallSummary.weaknesses.map((weakness, i) => (
                            <li key={i} className="text-red-400 text-sm">
                              <span className="text-white">{weakness}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-text-secondary">No areas for improvement identified yet</li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium mb-2">Summary</h3>
                      <p className="text-text-secondary">{overallSummary.summary || 'No summary available'}</p>
                    </div>
                    
                    <div className="bg-dark-primary p-4 rounded-md">
                      <h3 className="text-white font-medium mb-2">Hiring Recommendation</h3>
                      <p className="text-tech-green font-medium">{overallSummary.hiringRecommendation || 'No recommendation available'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <FileCode className="w-12 h-12 text-text-secondary" />
                  <p className="text-text-secondary">Click "Analyze Code" to start code quality analysis</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="correctness" className="m-0 p-0 h-full">
          <ScrollArea className="h-full">
            <div className="p-6">
              {correctnessAnalysis.loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="w-12 h-12 text-tech-green animate-spin" />
                  <p className="text-text-secondary">Analyzing code correctness...</p>
                </div>
              ) : correctnessAnalysis.score > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl font-semibold">Correctness Score</h3>
                    <div className="flex items-center">
                      <span className={`text-3xl font-bold ${getScoreColor(correctnessAnalysis.score)}`}>
                        {correctnessAnalysis.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-3">Summary</h4>
                    <p className="text-text-secondary">{correctnessAnalysis.summary}</p>
                  </div>
                  
                  {correctnessAnalysis.issues.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Issues Found</h4>
                      <div className="space-y-3">
                        {correctnessAnalysis.issues.map((issue, i) => (
                          <div key={i} className="bg-dark-primary p-3 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`${getSeverityColor(issue.severity)}`}>
                                  {issue.line ? `Line ${issue.line}:` : ''}
                                </span>
                                <span className="text-white">{issue.description}</span>
                              </div>
                              {getSeverityBadge(issue.severity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {correctnessAnalysis.recommendations && correctnessAnalysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {correctnessAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-tech-green text-sm">
                            <span className="text-white">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <CheckCircle className="w-12 h-12 text-text-secondary" />
                  <p className="text-text-secondary">No correctness analysis available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="complexity" className="m-0 p-0 h-full">
          <ScrollArea className="h-full">
            <div className="p-6">
              {complexityAnalysis.loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="w-12 h-12 text-tech-green animate-spin" />
                  <p className="text-text-secondary">Analyzing code complexity...</p>
                </div>
              ) : complexityAnalysis.score > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl font-semibold">Complexity Score</h3>
                    <div className="flex items-center">
                      <span className={`text-3xl font-bold ${getScoreColor(complexityAnalysis.score)}`}>
                        {complexityAnalysis.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-3">Summary</h4>
                    <p className="text-text-secondary">{complexityAnalysis.summary}</p>
                  </div>
                  
                  {complexityAnalysis.issues.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Issues Found</h4>
                      <div className="space-y-3">
                        {complexityAnalysis.issues.map((issue, i) => (
                          <div key={i} className="bg-dark-primary p-3 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`${getSeverityColor(issue.severity)}`}>
                                  {issue.line ? `Line ${issue.line}:` : ''}
                                </span>
                                <span className="text-white">{issue.description}</span>
                              </div>
                              {getSeverityBadge(issue.severity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {complexityAnalysis.recommendations && complexityAnalysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {complexityAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-tech-green text-sm">
                            <span className="text-white">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Layers className="w-12 h-12 text-text-secondary" />
                  <p className="text-text-secondary">No complexity analysis available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="edge-cases" className="m-0 p-0 h-full">
          <ScrollArea className="h-full">
            <div className="p-6">
              {edgeCaseAnalysis.loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="w-12 h-12 text-tech-green animate-spin" />
                  <p className="text-text-secondary">Analyzing edge cases...</p>
                </div>
              ) : edgeCaseAnalysis.score > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl font-semibold">Edge Case Handling Score</h3>
                    <div className="flex items-center">
                      <span className={`text-3xl font-bold ${getScoreColor(edgeCaseAnalysis.score)}`}>
                        {edgeCaseAnalysis.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-3">Summary</h4>
                    <p className="text-text-secondary">{edgeCaseAnalysis.summary}</p>
                  </div>
                  
                  {edgeCaseAnalysis.issues.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Issues Found</h4>
                      <div className="space-y-3">
                        {edgeCaseAnalysis.issues.map((issue, i) => (
                          <div key={i} className="bg-dark-primary p-3 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-white">{issue.description}</span>
                              </div>
                              {getSeverityBadge(issue.severity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {edgeCaseAnalysis.recommendations && edgeCaseAnalysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {edgeCaseAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-tech-green text-sm">
                            <span className="text-white">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <AlertTriangle className="w-12 h-12 text-text-secondary" />
                  <p className="text-text-secondary">No edge case analysis available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="performance" className="m-0 p-0 h-full">
          <ScrollArea className="h-full">
            <div className="p-6">
              {performanceAnalysis.loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="w-12 h-12 text-tech-green animate-spin" />
                  <p className="text-text-secondary">Analyzing code performance...</p>
                </div>
              ) : performanceAnalysis.score > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl font-semibold">Performance Score</h3>
                    <div className="flex items-center">
                      <span className={`text-3xl font-bold ${getScoreColor(performanceAnalysis.score)}`}>
                        {performanceAnalysis.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-3">Summary</h4>
                    <p className="text-text-secondary">{performanceAnalysis.summary}</p>
                  </div>
                  
                  {performanceAnalysis.issues.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Issues Found</h4>
                      <div className="space-y-3">
                        {performanceAnalysis.issues.map((issue, i) => (
                          <div key={i} className="bg-dark-primary p-3 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`${getSeverityColor(issue.severity)}`}>
                                  {issue.line ? `Line ${issue.line}:` : ''}
                                </span>
                                <span className="text-white">{issue.description}</span>
                              </div>
                              {getSeverityBadge(issue.severity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {performanceAnalysis.recommendations && performanceAnalysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {performanceAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-tech-green text-sm">
                            <span className="text-white">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Zap className="w-12 h-12 text-text-secondary" />
                  <p className="text-text-secondary">No performance analysis available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="security" className="m-0 p-0 h-full">
          <ScrollArea className="h-full">
            <div className="p-6">
              {securityAnalysis.loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="w-12 h-12 text-tech-green animate-spin" />
                  <p className="text-text-secondary">Analyzing code security...</p>
                </div>
              ) : securityAnalysis.score > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl font-semibold">Security Score</h3>
                    <div className="flex items-center">
                      <span className={`text-3xl font-bold ${getScoreColor(securityAnalysis.score)}`}>
                        {securityAnalysis.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-3">Summary</h4>
                    <p className="text-text-secondary">{securityAnalysis.summary}</p>
                  </div>
                  
                  {securityAnalysis.issues.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Issues Found</h4>
                      <div className="space-y-3">
                        {securityAnalysis.issues.map((issue, i) => (
                          <div key={i} className="bg-dark-primary p-3 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`${getSeverityColor(issue.severity)}`}>
                                  {issue.line ? `Line ${issue.line}:` : ''}
                                </span>
                                <span className="text-white">{issue.description}</span>
                              </div>
                              {getSeverityBadge(issue.severity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {securityAnalysis.recommendations && securityAnalysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {securityAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-tech-green text-sm">
                            <span className="text-white">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Shield className="w-12 h-12 text-text-secondary" />
                  <p className="text-text-secondary">No security analysis available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="style" className="m-0 p-0 h-full">
          <ScrollArea className="h-full">
            <div className="p-6">
              {styleAnalysis.loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="w-12 h-12 text-tech-green animate-spin" />
                  <p className="text-text-secondary">Analyzing code style...</p>
                </div>
              ) : styleAnalysis.score > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl font-semibold">Style & Readability Score</h3>
                    <div className="flex items-center">
                      <span className={`text-3xl font-bold ${getScoreColor(styleAnalysis.score)}`}>
                        {styleAnalysis.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-3">Summary</h4>
                    <p className="text-text-secondary">{styleAnalysis.summary}</p>
                  </div>
                  
                  {styleAnalysis.issues.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Issues Found</h4>
                      <div className="space-y-3">
                        {styleAnalysis.issues.map((issue, i) => (
                          <div key={i} className="bg-dark-primary p-3 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`${getSeverityColor(issue.severity)}`}>
                                  {issue.line ? `Line ${issue.line}:` : ''}
                                </span>
                                <span className="text-white">{issue.description}</span>
                              </div>
                              {getSeverityBadge(issue.severity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {styleAnalysis.recommendations && styleAnalysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {styleAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-tech-green text-sm">
                            <span className="text-white">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Eye className="w-12 h-12 text-text-secondary" />
                  <p className="text-text-secondary">No style analysis available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeQualityAnalysis;