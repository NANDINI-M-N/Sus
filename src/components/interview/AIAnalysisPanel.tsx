import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield, 
  Eye,
  Brain,
  Target,
  Download,
  RefreshCw,
  Users,
  FileText,
  BarChart3,
  PieChart,
  Code2,
  Loader2,
  FileSearch,
  Briefcase
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

import ProblemStatementInput from './ProblemStatementInput';
import CodeQualityAnalysis from './CodeQualityAnalysis';
import { useInterview } from '@/contexts/InterviewContext';
import RecruiterFriendlyReport from './RecruiterFriendlyReport';

interface CodeQualityMetric {
  name: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  details: string;
  severity: 'high' | 'medium' | 'low';
}

interface PerformanceIndicator {
  category: string;
  score: number;
  description: string;
  timestamp: string;
}

interface PlagiarismResult {
  similarity: number;
  confidence: 'high' | 'medium' | 'low';
  flaggedSections: Array<{
    startLine: number;
    endLine: number;
    reason: string;
    similarTo: string;
  }>;
}

interface BehaviorInsight {
  timestamp: string;
  action: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface AIAnalysisPanelProps {
  initialCode?: string;
  initialLanguage?: string;
}

export type AIAnalysisPanelRef = {
  handleCodeUpdate: (code: string, language: string) => void;
};

export const AIAnalysisPanel = forwardRef<AIAnalysisPanelRef, AIAnalysisPanelProps>(
  ({ initialCode = '', initialLanguage = 'javascript' }, ref) => {
    const [activeTab, setActiveTab] = useState('code-quality');
    const { 
      code: contextCode, 
      language: contextLanguage, 
      problemStatement: contextProblemStatement,
      setProblemStatement: setContextProblemStatement,
      roleLevel: contextRoleLevel,
      setRoleLevel: setContextRoleLevel,
      analysisResults,
      setAnalysisResults,
      isAnalyzing,
      setIsAnalyzing,
      lastAnalysisTime,
      setLastAnalysisTime
    } = useInterview();
    
    // Local state for UI purposes
    const [localIsAnalyzing, setLocalIsAnalyzing] = useState(false);
    const [localLastUpdate, setLocalLastUpdate] = useState(new Date());
    
    // Use context values but fallback to props for backward compatibility
    const [codeToAnalyze, setCodeToAnalyze] = useState(contextCode || initialCode);
    const [codeLanguage, setCodeLanguage] = useState(contextLanguage || initialLanguage);
    const [analysisScore, setAnalysisScore] = useState(0);
    const [analysisSummary, setAnalysisSummary] = useState('');

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      handleCodeUpdate: (code: string, language: string) => {
        console.log(`🔄 AIAnalysisPanel: Code updated - ${code.length} chars, language: ${language}`);
        setCodeToAnalyze(code);
        setCodeLanguage(language);
        setLocalLastUpdate(new Date());
      }
    }));

    // Update state when context changes
    useEffect(() => {
      setCodeToAnalyze(contextCode);
      setCodeLanguage(contextLanguage);
    }, [contextCode, contextLanguage]);
    
    // Update state when props change (for backward compatibility)
    useEffect(() => {
      if (!contextCode) {
        setCodeToAnalyze(initialCode);
      }
      if (!contextLanguage) {
        setCodeLanguage(initialLanguage);
      }
    }, [initialCode, initialLanguage, contextCode, contextLanguage]);

    // Mock data for comprehensive analysis
    const overallMetrics = {
      overallScore: 78,
      technicalSkills: 85,
      communication: 72,
      problemSolving: 80,
      codeQuality: 75,
      timeManagement: 68,
      stressHandling: 83
    };

    const codeQualityMetrics: CodeQualityMetric[] = [
      { name: 'Code Complexity', score: 82, trend: 'up', details: 'Cyclomatic complexity: 3.2/10', severity: 'low' },
      { name: 'Best Practices', score: 88, trend: 'up', details: '9/10 practices followed', severity: 'low' },
      { name: 'Performance', score: 76, trend: 'stable', details: 'O(n log n) complexity achieved', severity: 'medium' },
      { name: 'Security', score: 92, trend: 'up', details: 'No vulnerabilities detected', severity: 'low' },
      { name: 'Readability', score: 79, trend: 'down', details: 'Good naming conventions', severity: 'medium' },
      { name: 'Test Coverage', score: 65, trend: 'down', details: '65% code coverage', severity: 'high' }
    ];

    const performanceData = [
      { time: '10:00', score: 45, codeQuality: 50, communication: 40 },
      { time: '10:15', score: 62, codeQuality: 65, communication: 58 },
      { time: '10:30', score: 74, codeQuality: 78, communication: 70 },
      { time: '10:45', score: 78, codeQuality: 82, communication: 72 },
      { time: '11:00', score: 78, codeQuality: 75, communication: 72 }
    ];

    const radarData = [
      { subject: 'Technical Skills', A: 85, fullMark: 100 },
      { subject: 'Problem Solving', A: 80, fullMark: 100 },
      { subject: 'Communication', A: 72, fullMark: 100 },
      { subject: 'Code Quality', A: 75, fullMark: 100 },
      { subject: 'Time Management', A: 68, fullMark: 100 },
      { subject: 'Stress Handling', A: 83, fullMark: 100 }
    ];
    
    const strengthsWeaknesses = {
      strengths: [
        'Strong algorithmic thinking',
        'Efficient use of data structures',
        'Good code organization',
        'Clear variable naming',
        'Quick to identify optimal solutions'
      ],
      weaknesses: [
        'Limited error handling',
        'Could improve test coverage',
        'Some edge cases not considered',
        'Limited consideration of scalability'
      ],
      recommendations: [
        'Practice writing unit tests for better coverage',
        'Spend more time on edge case analysis',
        'Consider scalability implications early',
        'Add more detailed code comments'
      ]
    };

    const plagiarismResult: PlagiarismResult = {
      similarity: 23,
      confidence: 'low',
      flaggedSections: [
        {
          startLine: 15,
          endLine: 18,
          reason: 'Similar algorithm structure',
          similarTo: 'LeetCode Solution #1247'
        },
        {
          startLine: 34,
          endLine: 36,
          reason: 'Common helper function pattern',
          similarTo: 'GeeksforGeeks Template'
        }
      ]
    };

    const behaviorInsights: BehaviorInsight[] = [
      {
        timestamp: '10:32',
        action: 'Started coding immediately',
        impact: 'positive',
        description: 'Shows confidence and understanding of the problem'
      },
      {
        timestamp: '10:38',
        action: 'Explained approach clearly',
        impact: 'positive',
        description: 'Good communication skills demonstrated'
      },
      {
        timestamp: '10:45',
        action: 'Struggled with edge cases',
        impact: 'negative',
        description: 'Took 7 minutes to identify boundary conditions'
      },
      {
        timestamp: '10:52',
        action: 'Asked clarifying questions',
        impact: 'positive',
        description: 'Shows attention to detail and thoroughness'
      }
    ];

    // Using the first strengthsWeaknesses definition from above

    const pieData = [
      { name: 'Correct Solutions', value: 78, color: '#39d353' },
      { name: 'Partial Solutions', value: 15, color: '#ffa500' },
      { name: 'Incorrect', value: 7, color: '#ff4444' }
    ];

    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-tech-green';
      if (score >= 60) return 'text-yellow-400';
      return 'text-red-400';
    };

    const getScoreBgColor = (score: number) => {
      if (score >= 80) return 'bg-tech-green/20';
      if (score >= 60) return 'bg-yellow-400/20';
      return 'bg-red-400/20';
    };

    const getTrendIcon = (trend: string) => {
      switch (trend) {
        case 'up': return <TrendingUp className="w-3 h-3 text-tech-green" />;
        case 'down': return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />;
        default: return <div className="w-3 h-3 bg-yellow-400 rounded-full" />;
      }
    };

    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'high': return 'border-red-400 bg-red-400/10';
        case 'medium': return 'border-yellow-400 bg-yellow-400/10';
        default: return 'border-tech-green bg-tech-green/10';
      }
    };

    const refreshAnalysis = () => {
      setLocalIsAnalyzing(true);
      setIsAnalyzing(true);
      
      // Simulate analysis delay
      setTimeout(() => {
        // Generate mock analysis results
        const mockAnalysisResults = {
          correctness: {
            score: 92,
            analysis: "The solution correctly handles the two sum problem using a hash map approach. It has O(n) time complexity and O(n) space complexity, which is optimal for this problem.",
            suggestions: ["Consider adding input validation", "Add comments to explain the algorithm"],
          },
          complexity: {
            score: 85,
            analysis: "The solution has O(n) time complexity, which is optimal for this problem. The space complexity is also O(n) due to the hash map.",
            suggestions: ["The approach is optimal in terms of time complexity"],
          },
          edgeCases: {
            score: 78,
            analysis: "The solution handles most edge cases well, but could be improved for empty arrays or arrays with insufficient elements.",
            suggestions: ["Add checks for array length < 2", "Consider handling duplicate values more explicitly"],
          },
          performance: {
            score: 90,
            analysis: "The performance is excellent with O(n) time complexity. The solution avoids nested loops which would result in O(n²).",
            suggestions: ["Consider using a more memory-efficient approach for very large inputs"],
          },
          security: {
            score: 95,
            analysis: "No security issues identified. The solution doesn't involve any risky operations or potential vulnerabilities.",
            suggestions: ["No significant security concerns for this algorithm"],
          },
          style: {
            score: 88,
            analysis: "The code is clean and readable with good variable naming. It follows common JavaScript conventions.",
            suggestions: ["Add comments to explain the algorithm", "Consider using more descriptive variable names for 'i' and 'map'"],
          },
          overallSummary: {
            score: 88,
            strengths: [
              "Optimal time complexity O(n)",
              "Clean implementation using appropriate data structure",
              "Good variable naming",
              "Correct solution that handles the problem requirements"
            ],
            weaknesses: [
              "Limited edge case handling",
              "Could use more comments",
              "No input validation"
            ],
            hiringRecommendation: "Strong Hire",
            summary: "The candidate demonstrates strong understanding of algorithms and data structures. The solution is optimal in terms of time complexity and shows good coding practices. With some minor improvements in edge case handling and documentation, this would be excellent code."
          }
        };
        
        // Update the context with the analysis results
        setAnalysisResults(mockAnalysisResults);
        
        // Update local state
        setAnalysisScore(mockAnalysisResults.overallSummary.score);
        setAnalysisSummary(mockAnalysisResults.overallSummary.summary);
        
        // Reset loading states
        setLocalIsAnalyzing(false);
        setIsAnalyzing(false);
        
        // Update timestamps
        const now = new Date();
        setLocalLastUpdate(now);
        setLastAnalysisTime(now);
      }, 2000);
    };

    const handleProblemStatementChange = (statement: string) => {
      setContextProblemStatement(statement);
    };

    const handleRoleLevelChange = (level: string) => {
      setContextRoleLevel(level);
    };

    const handleAnalysisComplete = (score: number, summary: string) => {
      setAnalysisScore(score);
      setAnalysisSummary(summary);
    };

    return (
      <Card className="h-full bg-dark-secondary border-border-dark flex flex-col">
        <CardHeader className="py-3 px-4 border-b border-border-dark">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base flex items-center">
              <Brain className="w-4 h-4 text-tech-green mr-2" />
              AI Analysis
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 px-2 text-text-secondary hover:text-white"
              onClick={refreshAnalysis}
              disabled={localIsAnalyzing}
            >
              {localIsAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-1" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="code-quality" className="flex-1 flex flex-col">
            <TabsList className="bg-dark-primary px-4 py-2 border-b border-border-dark justify-start">
              <TabsTrigger value="code-quality" className="text-white data-[state=active]:bg-dark-secondary">
                <Code2 className="w-4 h-4 mr-1" />
                Code Quality
              </TabsTrigger>
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-dark-secondary">
                <BarChart3 className="w-4 h-4 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="plagiarism" className="text-white data-[state=active]:bg-dark-secondary">
                <FileSearch className="w-4 h-4 mr-1" />
                Plagiarism
              </TabsTrigger>
              <TabsTrigger value="recruiter" className="text-white data-[state=active]:bg-dark-secondary">
                <Briefcase className="w-4 h-4 mr-1" />
                Recruiter
              </TabsTrigger>
              <TabsTrigger value="behavior" className="text-white data-[state=active]:bg-dark-secondary">
                <Users className="w-4 h-4 mr-1" />
                Behavior
              </TabsTrigger>
            </TabsList>

            {/* Code Quality Tab */}
            <TabsContent value="code-quality" className="flex-1 overflow-hidden p-0 m-0">
              <div className="flex flex-col h-full">
                <ProblemStatementInput 
                  onProblemStatementChange={handleProblemStatementChange}
                  onRoleLevelChange={handleRoleLevelChange}
                  initialProblemStatement={contextProblemStatement}
                  initialRoleLevel={contextRoleLevel}
                />
                <div className="flex-1 overflow-hidden">
                  <CodeQualityAnalysis 
                    code={codeToAnalyze}
                    language={codeLanguage}
                    problemStatement={contextProblemStatement}
                    roleLevel={contextRoleLevel}
                    onAnalysisComplete={handleAnalysisComplete}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 overflow-hidden p-0 m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  <div className="bg-dark-primary p-4 rounded-md">
                    <h2 className="text-white text-lg font-semibold mb-4">Candidate Performance Overview</h2>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-dark-secondary p-3 rounded-md">
                        <div className="text-text-secondary text-sm">Overall Score</div>
                        <div className={`text-2xl font-bold ${getScoreColor(analysisScore)}`}>{analysisScore}/100</div>
                      </div>
                      <div className="bg-dark-secondary p-3 rounded-md">
                        <div className="text-text-secondary text-sm">Technical Skills</div>
                        <div className="text-2xl font-bold text-tech-green">85/100</div>
                      </div>
                      <div className="bg-dark-secondary p-3 rounded-md">
                        <div className="text-text-secondary text-sm">Problem Solving</div>
                        <div className="text-2xl font-bold text-tech-green">80/100</div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-white font-medium mb-2">Performance Metrics</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <RadarChart outerRadius={90} data={radarData}>
                          <PolarGrid stroke="#2d3748" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#a0aec0' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#a0aec0' }} />
                          <Radar name="Candidate" dataKey="A" stroke="#39d353" fill="#39d353" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-2">Summary</h3>
                      <p className="text-text-secondary">{analysisSummary}</p>
                    </div>
                  </div>
                  
                  <div className="bg-dark-primary p-4 rounded-md">
                    <h2 className="text-white text-lg font-semibold mb-4">Strengths & Weaknesses</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-white font-medium mb-2">Key Strengths</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {strengthsWeaknesses.strengths.map((strength, i) => (
                            <li key={i} className="text-tech-green text-sm">
                              <span className="text-white">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-2">Areas for Improvement</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {strengthsWeaknesses.weaknesses.map((weakness, i) => (
                            <li key={i} className="text-red-400 text-sm">
                              <span className="text-white">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-primary p-4 rounded-md">
                    <h2 className="text-white text-lg font-semibold mb-4">Performance Trend</h2>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={performanceData}>
                        <XAxis dataKey="time" stroke="#a0aec0" />
                        <YAxis domain={[0, 100]} stroke="#a0aec0" />
                        <Line type="monotone" dataKey="score" stroke="#39d353" strokeWidth={2} />
                        <Line type="monotone" dataKey="codeQuality" stroke="#3182ce" strokeWidth={2} />
                        <Line type="monotone" dataKey="communication" stroke="#e53e3e" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Plagiarism Tab */}
            <TabsContent value="plagiarism" className="flex-1 overflow-hidden p-0 m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  <div className="bg-dark-primary p-4 rounded-md">
                    <h2 className="text-white text-lg font-semibold mb-4">Plagiarism Detection</h2>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-24 h-24 rounded-full bg-dark-secondary flex items-center justify-center">
                          <div className="text-2xl font-bold text-tech-green">{plagiarismResult.similarity}%</div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-white font-medium">Similarity Score</h3>
                          <p className="text-text-secondary text-sm">
                            {plagiarismResult.similarity < 30 ? 'Low similarity detected' : 
                             plagiarismResult.similarity < 60 ? 'Moderate similarity detected' : 
                             'High similarity detected'}
                          </p>
                          <div className="mt-1 flex items-center">
                            <Badge variant={plagiarismResult.similarity < 30 ? 'outline' : 'destructive'} className="mt-1">
                              {plagiarismResult.confidence} confidence
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <PieChart width={150} height={150}>
                          <RechartsPieChart>
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </RechartsPieChart>
                        </PieChart>
                      </div>
                    </div>

                    <h3 className="text-white font-medium mb-2">Flagged Sections</h3>
                    {plagiarismResult.flaggedSections.length === 0 ? (
                      <p className="text-text-secondary">No code sections were flagged for plagiarism.</p>
                    ) : (
                      <div className="space-y-3">
                        {plagiarismResult.flaggedSections.map((section, i) => (
                          <div key={i} className="bg-dark-secondary p-3 rounded-md">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-white font-medium">Lines {section.startLine}-{section.endLine}</span>
                                <p className="text-text-secondary text-sm mt-1">{section.reason}</p>
                              </div>
                              <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                                Similar to: {section.similarTo}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Recruiter Tab */}
            <TabsContent value="recruiter" className="flex-1 overflow-hidden p-0 m-0">
              <RecruiterFriendlyReport 
                candidateName="Jane Smith"
                position="Full Stack Developer"
              />
            </TabsContent>

            {/* Behavior Tab */}
            <TabsContent value="behavior" className="flex-1 overflow-hidden p-0 m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  <div className="bg-dark-primary p-4 rounded-md">
                    <h2 className="text-white text-lg font-semibold mb-4">Behavioral Insights</h2>
                    <div className="space-y-4">
                      <div className="mb-4">
                        <h3 className="text-white font-medium mb-2">Key Observations</h3>
                        <div className="space-y-2">
                          {behaviorInsights.map((insight, i) => (
                            <div key={i} className="bg-dark-secondary p-3 rounded-md">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Badge variant="outline" className="mr-2">
                                    {insight.timestamp}
                                  </Badge>
                                  <span className="text-white">{insight.action}</span>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    insight.impact === 'positive' ? 'border-tech-green text-tech-green' :
                                    insight.impact === 'negative' ? 'border-red-400 text-red-400' : 
                                    'border-yellow-400 text-yellow-400'
                                  }
                                >
                                  {insight.impact}
                                </Badge>
                              </div>
                              <p className="text-text-secondary text-sm mt-1">{insight.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-white font-medium mb-2">Recommendations</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {strengthsWeaknesses.recommendations.map((rec, i) => (
                            <li key={i} className="text-blue-400 text-sm">
                              <span className="text-white">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    );
  }
);

// Add display name for React DevTools
AIAnalysisPanel.displayName = "AIAnalysisPanel";
