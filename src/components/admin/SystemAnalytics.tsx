
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Globe,
  Smartphone,
  Monitor,
  AlertCircle
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SystemAnalytics = () => {
  const usageData = [
    { date: '2024-01-01', users: 1200, sessions: 3400, pageViews: 12000 },
    { date: '2024-01-02', users: 1350, sessions: 3800, pageViews: 13200 },
    { date: '2024-01-03', users: 1180, sessions: 3200, pageViews: 11500 },
    { date: '2024-01-04', users: 1420, sessions: 4100, pageViews: 14800 },
    { date: '2024-01-05', users: 1650, sessions: 4600, pageViews: 16200 },
    { date: '2024-01-06', users: 1580, sessions: 4400, pageViews: 15600 },
    { date: '2024-01-07', users: 1720, sessions: 4800, pageViews: 17100 }
  ];

  const performanceMetrics = [
    { metric: 'API Response Time', value: 245, unit: 'ms', status: 'good', target: 300 },
    { metric: 'Page Load Time', value: 1.2, unit: 's', status: 'excellent', target: 2.0 },
    { metric: 'Error Rate', value: 0.15, unit: '%', status: 'excellent', target: 1.0 },
    { metric: 'Uptime', value: 99.95, unit: '%', status: 'excellent', target: 99.9 }
  ];

  const featureAdoption = [
    { feature: 'Video Interviews', adoption: 85, users: 10847 },
    { feature: 'Code Editor', adoption: 72, users: 9250 },
    { feature: 'Screen Sharing', adoption: 68, users: 8734 },
    { feature: 'AI Analysis', adoption: 45, users: 5781 },
    { feature: 'Templates', adoption: 91, users: 11691 },
    { feature: 'Scheduling', adoption: 78, users: 10020 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 65, color: '#39d353' },
    { name: 'Mobile', value: 25, color: '#0969da' },
    { name: 'Tablet', value: 10, color: '#f85149' }
  ];

  const errorLogs = [
    { time: '14:30:25', level: 'error', message: 'Database connection timeout', count: 3 },
    { time: '14:28:12', level: 'warning', message: 'High memory usage detected', count: 1 },
    { time: '14:25:45', level: 'error', message: 'Video service unavailable', count: 5 },
    { time: '14:22:18', level: 'info', message: 'Scheduled backup completed', count: 1 },
    { time: '14:20:30', level: 'warning', message: 'API rate limit approaching', count: 2 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Excellent</Badge>;
      case 'good': return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">Good</Badge>;
      case 'warning': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">Critical</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case 'error': return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">Error</Badge>;
      case 'warning': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">Warning</Badge>;
      case 'info': return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">Info</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Usage Statistics */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Activity className="h-5 w-5 text-tech-green" />
            Platform Usage Statistics
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Daily active users, sessions, and page views
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="date" stroke="#8b949e" />
              <YAxis stroke="#8b949e" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e2432', 
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  color: '#ffffff'
                }} 
              />
              <Area type="monotone" dataKey="pageViews" stackId="1" stroke="#39d353" fill="#39d353" fillOpacity={0.3} />
              <Area type="monotone" dataKey="sessions" stackId="1" stroke="#0969da" fill="#0969da" fillOpacity={0.3} />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#f85149" fill="#f85149" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tech-green" />
              Performance Metrics
            </CardTitle>
            <CardDescription className="text-text-secondary">
              System performance and monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="p-4 rounded-lg border border-border-dark bg-dark-primary/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-primary font-medium">{metric.metric}</span>
                    {getStatusBadge(metric.status)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-text-primary">
                      {metric.value}{metric.unit}
                    </span>
                    <span className="text-sm text-text-secondary">
                      Target: {metric.target}{metric.unit}
                    </span>
                  </div>
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Usage */}
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <Monitor className="h-5 w-5 text-tech-green" />
              Device Usage
            </CardTitle>
            <CardDescription className="text-text-secondary">
              User device distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
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
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-text-primary">{device.name}</span>
                  </div>
                  <span className="text-text-primary font-medium">{device.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Adoption Rates */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Target className="h-5 w-5 text-tech-green" />
            Feature Adoption Rates
          </CardTitle>
          <CardDescription className="text-text-secondary">
            User adoption of platform features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureAdoption} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis type="number" stroke="#8b949e" />
              <YAxis dataKey="feature" type="category" stroke="#8b949e" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e2432', 
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  color: '#ffffff'
                }} 
              />
              <Bar dataKey="adoption" fill="#39d353" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Error Rate Monitoring */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-tech-green" />
            Error Rate Monitoring
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Recent system errors and warnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {errorLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border-dark bg-dark-primary/30">
                <div className="flex items-center gap-3">
                  {getLogLevelBadge(log.level)}
                  <div>
                    <p className="text-text-primary text-sm">{log.message}</p>
                    <p className="text-text-secondary text-xs">{log.time}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-border-dark text-text-secondary">
                  {log.count}x
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemAnalytics;
