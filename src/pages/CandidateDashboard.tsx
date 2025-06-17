import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Clock, TrendingUp, Award, User, FileText, Target, 
  Bell, ChevronRight, Code, Briefcase, BookOpen, CheckCircle
} from 'lucide-react';
import WelcomeHeader from '@/components/candidate/WelcomeHeader';
import UpcomingInterviews from '@/components/candidate/UpcomingInterviews';
import InterviewHistory from '@/components/candidate/InterviewHistory';
import PerformanceAnalytics from '@/components/candidate/PerformanceAnalytics';
import CandidateNavbar from '@/components/candidate/CandidateNavbar';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useInterviews } from '@/hooks/useInterviews';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { interviews } = useInterviews();

  const handleCompleteProfile = () => {
    navigate('/profile');
  };

  const handleUploadResume = () => {
    navigate('/profile?section=resume');
  };

  const handleTakeAssessment = () => {
    navigate('/assessments');
  };

  // Filter upcoming interviews
  const upcomingInterviews = interviews.filter(interview => 
    (interview.status === 'scheduled' || interview.status === 'in_progress')
  ).slice(0, 3); // Get only the first 3 for the calendar view

  return (
    <div className="min-h-screen bg-gray-900">
      <CandidateNavbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Header with Stats */}
        <div className="mb-8">
          <Card className="bg-gray-800 border-none shadow-md overflow-hidden rounded-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-green/5 rounded-full -mr-20 -mt-20 z-0"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-green/5 rounded-full -ml-10 -mb-10 z-0"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-green to-emerald-green/80 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Welcome back, {profile?.first_name || 'Candidate'}!</h1>
                    <p className="text-gray-300 mt-1 text-lg">Ready for your next coding challenge?</p>
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <div className="flex items-center gap-2 bg-emerald-green/20 px-3 py-1.5 rounded-full">
                        <TrendingUp className="h-4 w-4 text-emerald-green" />
                        <span className="text-sm font-medium text-gray-300">Performance Score: 85/100</span>
                      </div>
                      <div className="flex gap-2">
                        {[
                          { name: 'Problem Solver', color: 'bg-emerald-green' },
                          { name: 'Code Quality', color: 'bg-blue-500' },
                          { name: 'Fast Learner', color: 'bg-purple-500' }
                        ].map((achievement, index) => (
                          <Badge key={index} className={`${achievement.color} text-white text-xs py-1`}>
                            {achievement.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-emerald-green text-emerald-green hover:bg-emerald-green hover:text-white"
                    onClick={handleCompleteProfile}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-emerald-green text-emerald-green hover:bg-emerald-green hover:text-white"
                    onClick={handleUploadResume}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                  <Button 
                    className="bg-emerald-green hover:bg-emerald-green/90 text-white"
                    size="sm"
                    onClick={handleTakeAssessment}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Practice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Skills Progress */}
          <div className="space-y-8">
            <Card className="bg-gray-800 border-none shadow-md rounded-xl overflow-hidden">
              <CardHeader className="border-b border-gray-700 bg-gray-800/80">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-green" />
                  Skill Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Skill Progress Bars */}
                  {['Problem Solving', 'Code Quality', 'Communication', 'Technical'].map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-300">{skill}</span>
                        <span className="text-sm font-medium text-emerald-green">{index * 10 + 70}%</span>
                      </div>
                      <Progress value={index * 10 + 70} className="h-2 bg-gray-700 [&>div]:bg-emerald-green" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Performance Analytics Card */}
            <PerformanceAnalytics />
          </div>
          
          {/* Middle Column - Upcoming Interviews */}
          <div className="space-y-8">
            <Card className="bg-gray-800 border-none shadow-md rounded-xl overflow-hidden">
              <CardHeader className="border-b border-gray-700 bg-gray-800/80">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-green" />
                    Interview Schedule
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-emerald-green text-emerald-green hover:bg-emerald-green/20"
                    onClick={() => navigate('/interviews')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <UpcomingInterviews />
              </CardContent>
            </Card>
            
            {/* Recent Interview History */}
            <Card className="bg-gray-800 border-none shadow-md rounded-xl overflow-hidden">
              <CardHeader className="border-b border-gray-700 bg-gray-800/80">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-green" />
                  Recent Interviews
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <InterviewHistory />
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Quick Actions & Notifications */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4">
              <Card 
                className="bg-gray-800 border-none shadow-md rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden relative"
                onClick={handleCompleteProfile}
              >
                <div className="absolute inset-0 bg-emerald-green opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-green/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-emerald-green" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Complete Profile</h3>
                      <p className="text-sm text-gray-300">Update your skills and experience</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-emerald-green transition-colors" />
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="bg-gray-800 border-none shadow-md rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden relative"
                onClick={handleUploadResume}
              >
                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Upload Resume</h3>
                      <p className="text-sm text-gray-300">Add or update your resume</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-blue-500 transition-colors" />
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="bg-gray-800 border-none shadow-md rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden relative"
                onClick={handleTakeAssessment}
              >
                <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Target className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Take Assessment</h3>
                      <p className="text-sm text-gray-300">Practice with coding challenges</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-purple-500 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Notifications Center */}
            <Card className="bg-gray-800 border-none shadow-md rounded-xl overflow-hidden">
              <CardHeader className="border-b border-gray-700 bg-gray-800/80">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-emerald-green" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-700">
                  {[
                    { title: 'Interview Confirmed', desc: 'Your upcoming interview has been confirmed', time: '2h ago', icon: CheckCircle, color: 'text-emerald-green' },
                    { title: 'New Resource Available', desc: 'Check out the new algorithm practice problems', time: '1d ago', icon: BookOpen, color: 'text-blue-500' },
                    { title: 'Feedback Received', desc: 'You received feedback on your last interview', time: '2d ago', icon: FileText, color: 'text-purple-500' }
                  ].map((notification, index) => (
                    <div key={index} className="p-4 hover:bg-gray-700 cursor-pointer transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-full bg-gray-700 ${notification.color}`}>
                          <notification.icon className="h-3 w-3" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-white">{notification.title}</h4>
                            <span className="text-xs text-gray-400">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{notification.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
