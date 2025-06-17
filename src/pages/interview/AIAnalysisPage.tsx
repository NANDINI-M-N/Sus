import React, { useState, useEffect, useRef } from 'react';
import { AIAnalysisPanel, AIAnalysisPanelRef } from '@/components/interview/AIAnalysisPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw, Loader2, FileText, Fingerprint, MessageSquare } from 'lucide-react';
import { useInterview } from '@/contexts/InterviewContext';
import CandidateSummaryReport from '@/components/interview/CandidateSummaryReport';
import PlagiarismAnalysis from '@/components/interview/PlagiarismAnalysis';
import FeedbackGenerator from '@/components/interview/FeedbackGenerator';

const AIAnalysisPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('code-quality');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { code, language, isAnalyzing: contextIsAnalyzing, setIsAnalyzing: setContextIsAnalyzing, lastAnalysisTime, setLastAnalysisTime } = useInterview();
  
  const aiAnalysisPanelRef = useRef<AIAnalysisPanelRef>(null);
  
  useEffect(() => {
    // Update the AI Analysis panel with the code from context
    if (aiAnalysisPanelRef.current) {
      aiAnalysisPanelRef.current.handleCodeUpdate(code, language);
    }
  }, [code, language]);
  
  const handleRefresh = () => {
    setIsAnalyzing(true);
    setContextIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setContextIsAnalyzing(false);
      const now = new Date();
      setLastAnalysisTime(now);
    }, 1000);
    
    // Update the AI Analysis panel with the code
    if (aiAnalysisPanelRef.current) {
      aiAnalysisPanelRef.current.handleCodeUpdate(code, language);
    }
  };

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="w-6 h-6 text-tech-green mr-3" />
          <h1 className="text-2xl font-semibold text-white">AI Analysis</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {lastAnalysisTime && (
            <span className="text-text-secondary text-sm">
              Last updated: {lastAnalysisTime.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isAnalyzing || contextIsAnalyzing}
            className="border-tech-green text-tech-green hover:bg-tech-green/10"
          >
            {isAnalyzing || contextIsAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Analysis
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="bg-dark-secondary border-border-dark h-[calc(100%-4rem)]">
        <CardContent className="p-0 h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="bg-dark-primary px-4 py-2 border-b border-border-dark justify-start">
              <TabsTrigger value="code-quality" className="text-white data-[state=active]:bg-dark-secondary">
                <Brain className="w-4 h-4 mr-2" />
                Code Quality
              </TabsTrigger>
              <TabsTrigger value="plagiarism" className="text-white data-[state=active]:bg-dark-secondary">
                <Fingerprint className="w-4 h-4 mr-2" />
                Plagiarism Check
              </TabsTrigger>
              <TabsTrigger value="candidate-report" className="text-white data-[state=active]:bg-dark-secondary">
                <FileText className="w-4 h-4 mr-2" />
                Candidate Report
              </TabsTrigger>
              <TabsTrigger value="feedback" className="text-white data-[state=active]:bg-dark-secondary">
                <MessageSquare className="w-4 h-4 mr-2" />
                Feedback
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="code-quality" className="h-[calc(100%-45px)] p-0 m-0">
              <AIAnalysisPanel 
                ref={aiAnalysisPanelRef}
                initialCode={code}
                initialLanguage={language}
              />
            </TabsContent>
            
            <TabsContent value="plagiarism" className="h-[calc(100%-45px)] p-0 m-0">
              <PlagiarismAnalysis 
                code={code}
                language={language}
                problemStatement={useInterview().problemStatement}
              />
            </TabsContent>
            
            <TabsContent value="candidate-report" className="h-[calc(100%-45px)] p-0 m-0">
              <CandidateSummaryReport />
            </TabsContent>
            
            <TabsContent value="feedback" className="h-[calc(100%-45px)] p-0 m-0">
              <FeedbackGenerator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnalysisPage; 