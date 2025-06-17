import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Activity,
  Download,
  Share2,
  Maximize2,
  Settings,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
} from 'recharts';
import { useReportData } from '@/hooks/useReportData';
import { Skeleton } from '@/components/ui/skeleton';

const DataVisualization = () => {
  const { 
    interviewTrends, 
    departmentPerformance, 
    skillsMetrics, 
    positionDistribution,
    performanceData,
    interviewerEfficiency,
    loading,
    error 
  } = useReportData();

  if (error) {
    return (
      <Card className="bg-dark-secondary border-border-dark">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Error loading visualization data: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const LoadingSkeleton = () => (
    <div className="h-[300px] w-full bg-dark-primary/30 rounded-lg animate-pulse" />
  );

  return (
    <div className="space-y-6">
      {/* Data Visualization Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Data Visualization</h2>
          <p className="text-text-secondary mt-1">Interactive charts and analytics insights</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="last_6_months">
            <SelectTrigger className="w-40 bg-dark-secondary border-border-dark text-text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-dark-secondary border-border-dark">
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="last_6_months">Last 6 Months</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
            <Download size={16} className="mr-2" />
            Export Charts
          </Button>
        </div>
      </div>

      {/* Interview Trends Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-text-primary flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-tech-green" />
                  Interview Volume Trends
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Monthly interview and hiring trends
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Maximize2 size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={interviewTrends}>
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
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="interviews" 
                    stackId="1" 
                    stroke="#0969da" 
                    fill="#0969da" 
                    fillOpacity={0.3}
                    name="Interviews"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hires" 
                    stackId="1" 
                    stroke="#39d353" 
                    fill="#39d353" 
                    fillOpacity={0.6}
                    name="Hires"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-text-primary flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-tech-green" />
                  Department Performance
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Interview success rates by department
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Settings size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="department" stroke="#8b949e" />
                  <YAxis stroke="#8b949e" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e2432',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="interviews" fill="#0969da" name="Total Interviews" />
                  <Bar dataKey="hires" fill="#39d353" name="Successful Hires" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-text-primary flex items-center gap-2">
                  <Activity className="h-5 w-5 text-tech-green" />
                  Skills Assessment
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Average scores across key skills
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsMetrics}>
                  <PolarGrid stroke="#30363d" />
                  <PolarAngleAxis dataKey="skill" stroke="#8b949e" />
                  <PolarRadiusAxis stroke="#8b949e" />
                  <Radar
                    name="Current Score"
                    dataKey="current"
                    stroke="#0969da"
                    fill="#0969da"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Target Score"
                    dataKey="target"
                    stroke="#39d353"
                    fill="#39d353"
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-text-primary flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-tech-green" />
                  Position Distribution
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Interview distribution by position level
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={positionDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {positionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e2432',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-text-primary flex items-center gap-2">
                  <Activity className="h-5 w-5 text-tech-green" />
                  Performance Analysis
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Interview scores vs. hire probability
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis
                    type="number"
                    dataKey="interview_score"
                    name="Interview Score"
                    stroke="#8b949e"
                    domain={[0, 10]}
                  />
                  <YAxis
                    type="number"
                    dataKey="hire_probability"
                    name="Hire Probability"
                    stroke="#8b949e"
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e2432',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Legend />
                  <Scatter
                    name="Candidates"
                    data={performanceData}
                    fill="#0969da"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-text-primary flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-tech-green" />
                  Interviewer Efficiency
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Performance metrics by interviewer
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={interviewerEfficiency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="interviewer" stroke="#8b949e" />
                  <YAxis stroke="#8b949e" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e2432',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="efficiency" fill="#0969da" name="Efficiency %" />
                  <Bar dataKey="satisfaction" fill="#39d353" name="Satisfaction" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataVisualization;
