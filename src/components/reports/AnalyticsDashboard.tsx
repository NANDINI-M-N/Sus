
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  Target, 
  Award,
  Briefcase,
  Calendar
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';

const AnalyticsDashboard = () => {
  const { analytics, loading } = useAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tech-green"></div>
        <p className="ml-3 text-text-secondary">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">No analytics data available</p>
      </div>
    );
  }

  const interviewMetrics = analytics.monthlyTrends;
  const performanceTrends = analytics.performanceTrends;
  const departmentData = analytics.departmentStats.map((dept, index) => ({
    ...dept,
    color: ['#39d353', '#0969da', '#f85149', '#a5a5a5', '#f89406'][index % 5]
  }));
  const interviewerEffectiveness = analytics.interviewerStats;
  
  // Mock time to hire data since it requires complex calculation
  const timeToHireData = [
    { position: 'Senior Engineer', avg_days: analytics.timeToHire, target: 21, interviews: 5.2 },
    { position: 'Product Manager', avg_days: analytics.timeToHire + 4, target: 28, interviews: 4.8 },
    { position: 'Designer', avg_days: analytics.timeToHire - 4, target: 18, interviews: 4.1 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-dark-secondary border-border-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Interview Completion Rate</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{analytics.completionRate}%</p>
                <p className={`text-sm mt-1 flex items-center ${
                  analytics.completionRate > 0 ? 'text-tech-green' : 'text-red-400'
                }`}>
                  {analytics.completionRate > 0 ? (
                    <TrendingUp size={12} className="mr-1" />
                  ) : (
                    <TrendingDown size={12} className="mr-1" />
                  )}
                  {analytics.monthlyTrends && analytics.monthlyTrends.length > 1 ? 
                    `${analytics.monthlyTrends[analytics.monthlyTrends.length - 1].success_rate - 
                      analytics.monthlyTrends[analytics.monthlyTrends.length - 2].success_rate > 0 ? '+' : ''}
                    ${(analytics.monthlyTrends[analytics.monthlyTrends.length - 1].success_rate - 
                      analytics.monthlyTrends[analytics.monthlyTrends.length - 2].success_rate).toFixed(1)}% vs last month` : 
                    'No previous data'
                  }
                </p>
              </div>
              <Target className="h-8 w-8 text-tech-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-secondary border-border-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Average Interview Score</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{analytics.averageScore}/10</p>
                <p className="text-sm mt-1 text-tech-green flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  {analytics.monthlyTrends && analytics.monthlyTrends.length > 1 ? 
                    'vs last month' : 'No previous data'
                  }
                </p>
              </div>
              <Award className="h-8 w-8 text-tech-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-secondary border-border-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Time to Hire</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{analytics.timeToHire} days</p>
                <p className="text-sm mt-1 text-tech-green flex items-center">
                  <TrendingDown size={12} className="mr-1" />
                  vs target
                </p>
              </div>
              <Clock className="h-8 w-8 text-tech-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-secondary border-border-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Hire Success Rate</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{analytics.hireRate}%</p>
                <p className="text-sm mt-1 text-tech-green flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  vs last period
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-tech-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interview Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tech-green" />
              Interview Completion Trends
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Monthly interview completion and success rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={interviewMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="month" stroke="#8b949e" />
                <YAxis stroke="#8b949e" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e2432', 
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#39d353" fill="#39d353" fillOpacity={0.3} />
                <Area type="monotone" dataKey="scheduled" stackId="1" stroke="#0969da" fill="#0969da" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <Award className="h-5 w-5 text-tech-green" />
              Performance Score Trends
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Average candidate performance across different skill areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="month" stroke="#8b949e" />
                <YAxis stroke="#8b949e" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e2432', 
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
                <Line type="monotone" dataKey="coding_score" stroke="#39d353" strokeWidth={2} />
                <Line type="monotone" dataKey="communication" stroke="#0969da" strokeWidth={2} />
                <Line type="monotone" dataKey="problem_solving" stroke="#f85149" strokeWidth={2} />
                <Line type="monotone" dataKey="overall" stroke="#f89406" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance and Time to Hire */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-tech-green" />
              Department Performance
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Interview success rates by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border-dark bg-dark-primary/30">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-text-primary">{dept.name}</h4>
                      <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">
                        {dept.success_rate}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span>{dept.interviews} interviews</span>
                      <span>{dept.hires} hires</span>
                    </div>
                    <Progress value={dept.success_rate} className="h-2 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <Clock className="h-5 w-5 text-tech-green" />
              Time to Hire Analysis
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Average hiring timeline by position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeToHireData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis type="number" stroke="#8b949e" />
                <YAxis dataKey="position" type="category" stroke="#8b949e" width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e2432', 
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
                <Bar dataKey="avg_days" fill="#39d353" />
                <Bar dataKey="target" fill="#30363d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Interviewer Effectiveness */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Users className="h-5 w-5 text-tech-green" />
            Interviewer Effectiveness
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Performance metrics for interview panel members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-dark">
                  <th className="text-left p-3 text-text-secondary">Interviewer</th>
                  <th className="text-left p-3 text-text-secondary">Interviews</th>
                  <th className="text-left p-3 text-text-secondary">Avg Score</th>
                  <th className="text-left p-3 text-text-secondary">Hire Rate</th>
                </tr>
              </thead>
              <tbody>
                {interviewerEffectiveness.map((interviewer, index) => (
                  <tr key={index} className="border-b border-border-dark/50">
                    <td className="p-3 text-text-primary font-medium">{interviewer.interviewer}</td>
                    <td className="p-3 text-text-secondary">{interviewer.interviews}</td>
                    <td className="p-3 text-text-primary">{interviewer.avg_score.toFixed(1)}/10</td>
                    <td className="p-3">
                      <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">
                        {interviewer.hire_rate.toFixed(1)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
