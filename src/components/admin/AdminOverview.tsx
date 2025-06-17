
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Globe,
  Server,
  Database
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminOverview = () => {
  const userGrowthData = [
    { month: 'Jan', users: 8420, interviews: 1200 },
    { month: 'Feb', users: 9150, interviews: 1350 },
    { month: 'Mar', users: 9800, interviews: 1480 },
    { month: 'Apr', users: 10500, interviews: 1620 },
    { month: 'May', users: 11200, interviews: 1780 },
    { month: 'Jun', users: 12847, interviews: 2100 }
  ];

  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, requests: 1200 },
    { time: '04:00', cpu: 32, memory: 58, requests: 800 },
    { time: '08:00', cpu: 78, memory: 72, requests: 2400 },
    { time: '12:00', cpu: 85, memory: 78, requests: 3200 },
    { time: '16:00', cpu: 92, memory: 81, requests: 3800 },
    { time: '20:00', cpu: 68, memory: 65, requests: 2100 }
  ];

  const recentActivities = [
    { id: 1, type: 'interview', message: 'New interview completed by John Doe', time: '2 minutes ago', status: 'success' },
    { id: 2, type: 'user', message: 'New user registration: jane.smith@company.com', time: '5 minutes ago', status: 'info' },
    { id: 3, type: 'system', message: 'System backup completed successfully', time: '10 minutes ago', status: 'success' },
    { id: 4, type: 'alert', message: 'High CPU usage detected on server-02', time: '15 minutes ago', status: 'warning' },
    { id: 5, type: 'interview', message: 'Interview template updated: Senior Developer', time: '20 minutes ago', status: 'info' }
  ];

  const systemHealth = [
    { service: 'API Gateway', status: 'healthy', uptime: '99.9%', response: '45ms' },
    { service: 'Database', status: 'healthy', uptime: '99.8%', response: '12ms' },
    { service: 'Video Service', status: 'warning', uptime: '98.5%', response: '120ms' },
    { service: 'Email Service', status: 'healthy', uptime: '99.7%', response: '250ms' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle size={16} className="text-tech-green" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'info': return <Activity size={16} className="text-blue-400" />;
      default: return <Activity size={16} className="text-text-secondary" />;
    }
  };

  const getServiceStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Healthy</Badge>;
      case 'warning': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">Warning</Badge>;
      case 'error': return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">Error</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tech-green" />
              User Growth & Interview Completion
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Monthly user growth and interview completion trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
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
                <Area type="monotone" dataKey="users" stackId="1" stroke="#39d353" fill="#39d353" fillOpacity={0.3} />
                <Area type="monotone" dataKey="interviews" stackId="1" stroke="#0969da" fill="#0969da" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <Server className="h-5 w-5 text-tech-green" />
              System Performance
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Real-time system resource utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="time" stroke="#8b949e" />
                <YAxis stroke="#8b949e" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e2432', 
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
                <Line type="monotone" dataKey="cpu" stroke="#ff6b6b" strokeWidth={2} />
                <Line type="monotone" dataKey="memory" stroke="#4ecdc4" strokeWidth={2} />
                <Line type="monotone" dataKey="requests" stroke="#ffe66d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Health Indicators */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Database className="h-5 w-5 text-tech-green" />
            System Health Status
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Real-time monitoring of critical system services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemHealth.map((service, index) => (
              <div key={index} className="p-4 rounded-lg border border-border-dark bg-dark-primary/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-text-primary">{service.service}</h4>
                  {getServiceStatusBadge(service.status)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Uptime:</span>
                    <span className="text-text-primary">{service.uptime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Response:</span>
                    <span className="text-text-primary">{service.response}</span>
                  </div>
                  <Progress 
                    value={parseFloat(service.uptime)} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Monitoring */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Activity className="h-5 w-5 text-tech-green" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Real-time platform activity monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border border-border-dark bg-dark-primary/30">
                {getStatusIcon(activity.status)}
                <div className="flex-1">
                  <p className="text-text-primary text-sm">{activity.message}</p>
                  <p className="text-text-secondary text-xs mt-1">{activity.time}</p>
                </div>
                <Badge variant="outline" className="border-border-dark text-text-secondary">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
              View All Activities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
