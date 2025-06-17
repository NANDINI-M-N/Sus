import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Loader2, 
  User, 
  MessageSquare,
  BrainCircuit,
  CheckCircle,
  XCircle,
  Download,
  Briefcase,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { generateRecruiterReport, RecruiterReport } from '@/integrations/openai/recruiterReportGenerator';
import { useInterview } from '@/contexts/InterviewContext';
import { useToast } from '@/hooks/use-toast';

interface RecruiterFriendlyReportProps {
  candidateName?: string;
  position?: string;
  interviewDate?: string;
}

export const RecruiterFriendlyReport: React.FC<RecruiterFriendlyReportProps> = ({
  candidateName = "Jane Smith",
  position = "Full Stack Developer",
  interviewDate = new Date().toLocaleDateString()
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recruiterReport, setRecruiterReport] = useState<RecruiterReport | null>(null);
  const { toast } = useToast();
  
  const { 
    code, 
    analysisResults,
    plagiarismResults
  } = useInterview();

  // Auto-generate report when candidate summary is available
  useEffect(() => {
    if (analysisResults && !recruiterReport && !isGenerating) {
      handleGenerateReport();
    }
  }, [analysisResults]);
  
  const handleGenerateReport = async () => {
    if (!analysisResults) {
      toast({
        title: "Missing Information",
        description: "Please generate a candidate summary report first",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const report = await generateRecruiterReport({
        candidateReport: {
          overallScore: analysisResults.overallSummary.score,
          technicalAssessment: {
            score: analysisResults.correctness.score,
            strengths: analysisResults.overallSummary.strengths,
            weaknesses: analysisResults.overallSummary.weaknesses
          },
          communicationAssessment: {
            score: 75, // Placeholder, would come from communication analysis
            strengths: ["Clear explanation of approach", "Good at breaking down complex concepts"],
            weaknesses: ["Could improve active listening", "Sometimes uses overly technical jargon"]
          },
          problemSolvingAssessment: {
            score: analysisResults.overallSummary.score,
            strengths: ["Methodical approach to problem breakdown"],
            weaknesses: ["Limited exploration of alternative approaches"]
          },
          hiringRecommendation: analysisResults.overallSummary.hiringRecommendation,
          summary: analysisResults.overallSummary.summary,
          feedbackForCandidate: "Constructive feedback would go here"
        },
        candidateName,
        position,
        interviewDate,
        useMock: true // Set to false in production
      });
      
      setRecruiterReport(report);
      toast({
        title: "Report Generated",
        description: "Recruiter-friendly report has been generated successfully",
      });
    } catch (error) {
      console.error("Error generating recruiter report:", error);
      toast({
        title: "Error",
        description: "Failed to generate recruiter-friendly report",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const getHiringRecommendationBadge = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('strong hire')) {
      return <Badge className="bg-tech-green text-black">Strong Hire</Badge>;
    } else if (recommendation.toLowerCase().includes('hire')) {
      return <Badge className="bg-green-500 text-black">Hire</Badge>;
    } else if (recommendation.toLowerCase().includes('consider')) {
      return <Badge className="bg-yellow-400 text-black">Consider</Badge>;
    } else if (recommendation.toLowerCase().includes('do not hire')) {
      return <Badge className="bg-red-500 text-white">Do Not Hire</Badge>;
    } else {
      return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };
  
  return (
    <Card className="bg-dark-secondary border-border-dark h-full flex flex-col">
      <CardHeader className="py-3 px-4 border-b border-border-dark">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-base flex items-center">
            <FileText className="w-4 h-4 text-blue-400 mr-2" />
            Recruiter-Friendly Report
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateReport}
            disabled={isGenerating || !analysisResults}
            className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : recruiterReport ? (
              <>
                <BrainCircuit className="w-4 h-4 mr-2" />
                Refresh Report
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
        <ScrollArea className="h-full">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 p-6">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
              <p className="text-text-secondary">Generating recruiter-friendly report...</p>
            </div>
          ) : recruiterReport ? (
            <div className="p-6 space-y-6">
              {/* Header Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">{recruiterReport.candidateName}</h2>
                  {getHiringRecommendationBadge(recruiterReport.hiringRecommendation)}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-text-secondary">
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-blue-400/70" />
                    <span>{recruiterReport.position}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-400/70" />
                    <span>Interviewed on {recruiterReport.interviewDate}</span>
                  </div>
                </div>
              </div>
              
              {/* Overall Assessment */}
              <div className="bg-dark-primary rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Overall Assessment</h3>
                <p className="text-text-secondary whitespace-pre-line">{recruiterReport.overallAssessment}</p>
              </div>
              
              {/* Skills Summaries */}
              <div className="space-y-4">
                <div className="bg-dark-primary rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Technical Skills</h3>
                  <p className="text-text-secondary">{recruiterReport.technicalSkillsSummary}</p>
                </div>
                
                <div className="bg-dark-primary rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Communication Skills</h3>
                  <p className="text-text-secondary">{recruiterReport.communicationSkillsSummary}</p>
                </div>
                
                <div className="bg-dark-primary rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Problem Solving Ability</h3>
                  <p className="text-text-secondary">{recruiterReport.problemSolvingAbility}</p>
                </div>
                
                <div className="bg-dark-primary rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Cultural Fit</h3>
                  <p className="text-text-secondary">{recruiterReport.culturalFitNotes}</p>
                </div>
              </div>
              
              {/* Strengths and Areas for Improvement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-primary rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-tech-green" />
                    Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {recruiterReport.strengthsHighlights.map((strength, index) => (
                      <li key={index} className="text-text-secondary flex items-start">
                        <span className="text-tech-green mr-2">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-dark-primary rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <XCircle className="w-4 h-4 mr-2 text-yellow-400" />
                    Areas for Development
                  </h3>
                  <ul className="space-y-2">
                    {recruiterReport.areasForImprovement.map((area, index) => (
                      <li key={index} className="text-text-secondary flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Recommendation and Next Steps */}
              <div className="space-y-4">
                <div className="bg-dark-primary rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Hiring Recommendation</h3>
                  <p className="text-text-secondary">{recruiterReport.hiringRecommendation}</p>
                </div>
                
                <div className="bg-dark-primary rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Suggested Next Steps</h3>
                  <ul className="space-y-2">
                    {recruiterReport.nextSteps.map((step, index) => (
                      <li key={index} className="text-text-secondary flex items-start">
                        <ArrowRight className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {recruiterReport.additionalNotes && (
                  <div className="bg-dark-primary rounded-lg p-4">
                    <h3 className="text-white font-medium mb-2">Additional Notes</h3>
                    <p className="text-text-secondary">{recruiterReport.additionalNotes}</p>
                  </div>
                )}
              </div>
              
              {/* Export Button */}
              <div className="flex justify-end">
                <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
              <FileText className="w-16 h-16 text-text-secondary mb-4" />
              <h3 className="text-white text-lg font-medium mb-2">No Recruiter Report Yet</h3>
              <p className="text-text-secondary mb-6 max-w-md">
                Generate a recruiter-friendly report that translates technical assessment results into clear, actionable insights for the hiring team.
              </p>
              <Button
                onClick={handleGenerateReport}
                disabled={!analysisResults}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <BrainCircuit className="w-5 h-5 mr-2" />
                Generate Recruiter Report
              </Button>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecruiterFriendlyReport;
