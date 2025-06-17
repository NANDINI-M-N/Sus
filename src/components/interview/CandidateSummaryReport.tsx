import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Loader2, 
  User, 
  Code, 
  MessageSquare,
  BrainCircuit,
  CheckCircle,
  XCircle,
  Download,
  Lightbulb,
  BarChart3,
  Code2
} from 'lucide-react';
import { generateCandidateReport, CandidateReport } from '@/integrations/openai/candidateReportSummarizer';
import { useInterview } from '@/contexts/InterviewContext';
import { useToast } from '@/hooks/use-toast';

export const CandidateSummaryReport: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overall');
  const [candidateReport, setCandidateReport] = useState<CandidateReport | null>(null);
  const { toast } = useToast();
  
  const { 
    code, 
    language, 
    problemStatement,
    roleLevel,
    messages,
    transcript,
    analysisResults
  } = useInterview();
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      const report = await generateCandidateReport({
        code,
        language,
        problemStatement,
        roleLevel,
        messages,
        transcript,
        codeAnalysisResults: analysisResults,
        useMock: true // Set to false in production
      });
      
      setCandidateReport(report);
      toast({
        title: "Report Generated",
        description: "Candidate summary report has been generated successfully",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate candidate summary report",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
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
  
  const getHiringRecommendationBadge = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'strong hire':
        return <Badge className="bg-tech-green text-black">Strong Hire</Badge>;
      case 'hire':
        return <Badge className="bg-green-500 text-black">Hire</Badge>;
      case 'consider':
        return <Badge className="bg-yellow-400 text-black">Consider</Badge>;
      case 'do not hire':
        return <Badge className="bg-red-500 text-white">Do Not Hire</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };
  
  return (
    <Card className="bg-dark-secondary border-border-dark h-full flex flex-col">
      <CardHeader className="py-3 px-4 border-b border-border-dark">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-base flex items-center">
            <FileText className="w-4 h-4 text-tech-green mr-2" />
            Candidate Summary Report
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateReport}
            disabled={isGenerating || !code}
            className="border-tech-green text-tech-green hover:bg-tech-green/10"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden">
        {candidateReport ? (
          <div className="h-full flex flex-col">
            <Tabs defaultValue="overall" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="bg-dark-primary px-4 py-2 border-b border-border-dark justify-start">
                <TabsTrigger value="overall" className="text-white data-[state=active]:bg-dark-secondary">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overall
                </TabsTrigger>
                <TabsTrigger value="technical" className="text-white data-[state=active]:bg-dark-secondary">
                  <Code2 className="w-4 h-4 mr-2" />
                  Technical
                </TabsTrigger>
                <TabsTrigger value="communication" className="text-white data-[state=active]:bg-dark-secondary">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Communication
                </TabsTrigger>
                <TabsTrigger value="feedback" className="text-white data-[state=active]:bg-dark-secondary">
                  <FileText className="w-4 h-4 mr-2" />
                  Feedback
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overall" className="flex-1 p-6 m-0 overflow-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Overall Assessment</h2>
                    <p className="text-text-secondary">Comprehensive evaluation of the candidate's performance</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(candidateReport.overallScore)}`}>
                        {candidateReport.overallScore}
                      </div>
                      <div className="text-text-secondary text-sm">Score</div>
                    </div>
                    {getHiringRecommendationBadge(candidateReport.hiringRecommendation)}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-dark-primary rounded-lg p-4">
                    <h3 className="text-white font-medium mb-2">Summary</h3>
                    <p className="text-text-secondary">{candidateReport.summary}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-dark-primary border-border-dark">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-white text-sm flex items-center">
                          <Code className="w-4 h-4 mr-2 text-tech-green" />
                          Technical
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-3 px-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-text-secondary">Score</span>
                          <span className={getScoreColor(candidateReport.technicalAssessment.score)}>
                            {candidateReport.technicalAssessment.score}/100
                          </span>
                        </div>
                        <div className="h-1.5 mb-4 bg-dark-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getScoreBackground(candidateReport.technicalAssessment.score)}`}
                            style={{ width: `${candidateReport.technicalAssessment.score}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-dark-primary border-border-dark">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-white text-sm flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2 text-tech-green" />
                          Communication
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-3 px-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-text-secondary">Score</span>
                          <span className={getScoreColor(candidateReport.communicationAssessment.score)}>
                            {candidateReport.communicationAssessment.score}/100
                          </span>
                        </div>
                        <div className="h-1.5 mb-4 bg-dark-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getScoreBackground(candidateReport.communicationAssessment.score)}`}
                            style={{ width: `${candidateReport.communicationAssessment.score}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-dark-primary border-border-dark">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-white text-sm flex items-center">
                          <BrainCircuit className="w-4 h-4 mr-2 text-tech-green" />
                          Problem Solving
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-3 px-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-text-secondary">Score</span>
                          <span className={getScoreColor(candidateReport.problemSolvingAssessment.score)}>
                            {candidateReport.problemSolvingAssessment.score}/100
                          </span>
                        </div>
                        <div className="h-1.5 mb-4 bg-dark-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getScoreBackground(candidateReport.problemSolvingAssessment.score)}`}
                            style={{ width: `${candidateReport.problemSolvingAssessment.score}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="technical" className="flex-1 p-6 m-0 overflow-auto">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">Technical Assessment</h2>
                  <div className="flex items-center mb-4">
                    <div className={`text-2xl font-bold ${getScoreColor(candidateReport.technicalAssessment.score)} mr-2`}>
                      {candidateReport.technicalAssessment.score}
                    </div>
                    <div className="h-2 flex-1 bg-dark-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreBackground(candidateReport.technicalAssessment.score)}`}
                        style={{ width: `${candidateReport.technicalAssessment.score}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-dark-primary border-border-dark">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-white text-sm flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-tech-green" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 px-4">
                      <ul className="space-y-2">
                        {candidateReport.technicalAssessment.strengths.map((strength, index) => (
                          <li key={index} className="text-text-secondary flex items-start">
                            <span className="text-tech-green mr-2">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-dark-primary border-border-dark">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-white text-sm flex items-center">
                        <XCircle className="w-4 h-4 mr-2 text-red-400" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 px-4">
                      <ul className="space-y-2">
                        {candidateReport.technicalAssessment.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-text-secondary flex items-start">
                            <span className="text-red-400 mr-2">•</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="communication" className="flex-1 p-6 m-0 overflow-auto">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">Communication Assessment</h2>
                  <div className="flex items-center mb-4">
                    <div className={`text-2xl font-bold ${getScoreColor(candidateReport.communicationAssessment.score)} mr-2`}>
                      {candidateReport.communicationAssessment.score}
                    </div>
                    <div className="h-2 flex-1 bg-dark-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreBackground(candidateReport.communicationAssessment.score)}`}
                        style={{ width: `${candidateReport.communicationAssessment.score}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-dark-primary border-border-dark">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-white text-sm flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-tech-green" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 px-4">
                      <ul className="space-y-2">
                        {candidateReport.communicationAssessment.strengths.map((strength, index) => (
                          <li key={index} className="text-text-secondary flex items-start">
                            <span className="text-tech-green mr-2">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-dark-primary border-border-dark">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-white text-sm flex items-center">
                        <XCircle className="w-4 h-4 mr-2 text-red-400" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 px-4">
                      <ul className="space-y-2">
                        {candidateReport.communicationAssessment.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-text-secondary flex items-start">
                            <span className="text-red-400 mr-2">•</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="feedback" className="flex-1 p-6 m-0 overflow-auto">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white">Candidate Feedback</h2>
                  <p className="text-text-secondary">Constructive feedback that could be shared with the candidate</p>
                </div>
                
                <Card className="bg-dark-primary border-border-dark">
                  <CardContent className="p-4">
                    <p className="text-text-secondary whitespace-pre-line">
                      {candidateReport.feedbackForCandidate}
                    </p>
                  </CardContent>
                </Card>
                
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" size="sm" className="border-tech-green text-tech-green hover:bg-tech-green/10">
                    <Download className="w-4 h-4 mr-2" />
                    Export Feedback
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <FileText className="w-16 h-16 text-text-secondary mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">No Report Generated Yet</h3>
            <p className="text-text-secondary mb-6 max-w-md">
              Generate a comprehensive candidate summary report to evaluate the candidate's performance across multiple dimensions.
            </p>
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating || !code}
              className="bg-tech-green text-black hover:bg-tech-green/90"
            >
              <BrainCircuit className="w-5 h-5 mr-2" />
              Generate Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CandidateSummaryReport; 