
import { useState } from 'react';
import { 
  ArrowLeft,
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare, 
  FileText,
  Download,
  Edit,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { Candidate } from '@/data/mockCandidates';

interface CandidateProfileProps {
  candidate: Candidate;
  onBack: () => void;
}

export const CandidateProfile = ({ candidate, onBack }: CandidateProfileProps) => {
  const [newNote, setNewNote] = useState('');

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'junior': return 'bg-blue-500 text-white';
      case 'mid': return 'bg-purple-500 text-white';
      case 'senior': return 'bg-orange-500 text-white';
      case 'lead': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-tech-green text-dark-primary';
      case 'interviewing': return 'bg-yellow-500 text-dark-primary';
      case 'unavailable': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-blue-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-tech-green';
      default: return 'bg-gray-500';
    }
  };

  const getSkillLevelWidth = (level: string) => {
    switch (level) {
      case 'beginner': return 25;
      case 'intermediate': return 50;
      case 'advanced': return 75;
      case 'expert': return 100;
      default: return 0;
    }
  };

  // Mock performance data for charts
  const performanceData = [
    { month: 'Jan', score: 85 },
    { month: 'Feb', score: 88 },
    { month: 'Mar', score: 82 },
    { month: 'Apr', score: 90 },
    { month: 'May', score: candidate.performanceMetrics.technicalSkills },
    { month: 'Jun', score: candidate.performanceMetrics.technicalSkills }
  ];

  const skillsData = [
    { skill: 'Code Quality', score: candidate.performanceMetrics.codeQuality },
    { skill: 'Communication', score: candidate.performanceMetrics.communication },
    { skill: 'Technical', score: candidate.performanceMetrics.technicalSkills },
    { skill: 'Problem Solving', score: candidate.performanceMetrics.problemSolving }
  ];

  const getInterviewStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-tech-green" />;
      case 'scheduled': return <Clock size={16} className="text-yellow-500" />;
      case 'cancelled': return <AlertCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Mock note addition
      console.log('Adding note:', newNote);
      setNewNote('');
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Header */}
      <div className="bg-dark-secondary border-b border-border-dark p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Candidates
            </Button>
            <div className="w-px h-6 bg-border-dark" />
            <h1 className="text-2xl font-bold text-text-primary">Candidate Profile</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button className="bg-tech-green hover:bg-tech-green/90 text-dark-primary">
              <Calendar size={16} className="mr-2" />
              Schedule Interview
            </Button>
            <Button variant="outline" className="border-border-dark text-text-secondary">
              <MessageSquare size={16} className="mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Profile Card */}
          <Card className="bg-dark-secondary border-border-dark">
            <CardContent className="p-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={candidate.profilePhoto} alt={candidate.name} />
                  <AvatarFallback className="bg-tech-green/20 text-tech-green text-xl">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-bold text-text-primary mb-2">{candidate.name}</h2>
                
                <div className="flex justify-center space-x-2 mb-4">
                  <Badge className={getExperienceColor(candidate.experienceLevel)}>
                    {candidate.experienceLevel}
                  </Badge>
                  <Badge className={getAvailabilityColor(candidate.availability)}>
                    {candidate.availability}
                  </Badge>
                </div>

                <div className="flex items-center justify-center space-x-1 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(candidate.overallRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-text-primary font-medium ml-2">
                    {candidate.overallRating}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border-dark">
                <div className="flex items-center text-text-secondary">
                  <Mail size={16} className="mr-3" />
                  <span className="text-sm">{candidate.email}</span>
                </div>
                <div className="flex items-center text-text-secondary">
                  <Phone size={16} className="mr-3" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
                <div className="flex items-center text-text-secondary">
                  <MapPin size={16} className="mr-3" />
                  <span className="text-sm">{candidate.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Matrix */}
          <Card className="bg-dark-secondary border-border-dark">
            <CardHeader>
              <CardTitle className="text-text-primary">Skills Matrix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidate.skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-primary text-sm font-medium">{skill.name}</span>
                    <Badge 
                      className={`${getSkillLevelColor(skill.level)} text-white text-xs`}
                    >
                      {skill.level}
                    </Badge>
                  </div>
                  <Progress 
                    value={getSkillLevelWidth(skill.level)} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experience Timeline */}
          <Card className="bg-dark-secondary border-border-dark">
            <CardHeader>
              <CardTitle className="text-text-primary">Experience Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidate.experienceTimeline.map((exp, index) => (
                <div key={index} className="relative">
                  {index !== candidate.experienceTimeline.length - 1 && (
                    <div className="absolute left-2 top-8 w-0.5 h-12 bg-border-dark" />
                  )}
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-tech-green rounded-full mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary">{exp.position}</h4>
                      <p className="text-sm text-tech-green">{exp.company}</p>
                      <p className="text-xs text-text-secondary">{exp.duration}</p>
                      <p className="text-sm text-text-secondary mt-1">{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="bg-dark-secondary border-border-dark">
            <CardHeader>
              <CardTitle className="text-text-primary">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {candidate.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-dark-primary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText size={16} className="text-tech-green" />
                    <div>
                      <p className="text-text-primary text-sm font-medium">{doc.name}</p>
                      <p className="text-text-secondary text-xs">{doc.type} • {doc.uploadDate}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-tech-green hover:text-tech-green/80">
                    <Download size={14} />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Interview History & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Analytics */}
          <Card className="bg-dark-secondary border-border-dark">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center">
                <TrendingUp size={20} className="mr-2" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-dark-primary">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-dark-primary rounded-lg">
                      <div className="text-2xl font-bold text-tech-green">
                        {candidate.performanceMetrics.codeQuality}%
                      </div>
                      <div className="text-sm text-text-secondary">Code Quality</div>
                    </div>
                    <div className="text-center p-4 bg-dark-primary rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {candidate.performanceMetrics.communication}%
                      </div>
                      <div className="text-sm text-text-secondary">Communication</div>
                    </div>
                    <div className="text-center p-4 bg-dark-primary rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">
                        {candidate.performanceMetrics.technicalSkills}%
                      </div>
                      <div className="text-sm text-text-secondary">Technical Skills</div>
                    </div>
                    <div className="text-center p-4 bg-dark-primary rounded-lg">
                      <div className="text-2xl font-bold text-orange-400">
                        {candidate.performanceMetrics.problemSolving}%
                      </div>
                      <div className="text-sm text-text-secondary">Problem Solving</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="trends" className="space-y-4">
                  <div className="h-64">
                    <ChartContainer
                      config={{
                        score: {
                          label: "Performance Score",
                          color: "#39d353",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                          <XAxis dataKey="month" stroke="#8b949e" />
                          <YAxis stroke="#8b949e" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#39d353" 
                            strokeWidth={2}
                            dot={{ fill: "#39d353", strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="skills" className="space-y-4">
                  <div className="h-64">
                    <ChartContainer
                      config={{
                        score: {
                          label: "Skill Score",
                          color: "#39d353",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={skillsData}>
                          <XAxis dataKey="skill" stroke="#8b949e" />
                          <YAxis stroke="#8b949e" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="score" fill="#39d353" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Interview History */}
          <Card className="bg-dark-secondary border-border-dark">
            <CardHeader>
              <CardTitle className="text-text-primary">Interview History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidate.interviewHistory.length > 0 ? (
                candidate.interviewHistory.map((interview) => (
                  <div key={interview.id} className="p-4 bg-dark-primary rounded-lg border border-border-dark">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-text-primary">{interview.position}</h4>
                        <p className="text-sm text-text-secondary">
                          {new Date(interview.date).toLocaleDateString()} • {interview.interviewer}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getInterviewStatusIcon(interview.status)}
                        <Badge variant="secondary" className="capitalize">
                          {interview.status}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-text-primary">{interview.score}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-text-secondary mb-3">{interview.feedback}</p>
                    
                    {interview.technicalQuestions.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-text-primary">Technical Questions:</h5>
                        {interview.technicalQuestions.map((q, idx) => (
                          <div key={idx} className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-text-secondary">{q.question}</span>
                              <Badge variant="secondary">{q.score}/10</Badge>
                            </div>
                            <p className="text-text-secondary text-xs mt-1">{q.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar size={48} className="mx-auto text-text-secondary mb-4" />
                  <p className="text-text-secondary">No interview history available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card className="bg-dark-secondary border-border-dark">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-text-primary">Notes</CardTitle>
                <Button size="sm" className="bg-tech-green hover:bg-tech-green/90 text-dark-primary">
                  <Plus size={14} className="mr-1" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a note about this candidate..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="bg-dark-primary border-border-dark text-text-primary"
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="bg-tech-green hover:bg-tech-green/90 text-dark-primary"
                >
                  Save Note
                </Button>
              </div>
              
              {candidate.notes.length > 0 ? (
                <div className="space-y-3 pt-4 border-t border-border-dark">
                  {candidate.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-dark-primary rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text-primary">{note.author}</span>
                        <span className="text-xs text-text-secondary">{note.date}</span>
                      </div>
                      <p className="text-sm text-text-secondary">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border-t border-border-dark">
                  <FileText size={24} className="mx-auto text-text-secondary mb-2" />
                  <p className="text-text-secondary text-sm">No notes available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
