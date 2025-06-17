
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Key,
  Users,
  Activity,
  Globe,
  Database,
  Eye,
  Clock,
  FileText
} from 'lucide-react';

const SecurityDashboard = () => {
  const securityMetrics = [
    {
      title: "Security Score",
      value: "94%",
      status: "excellent",
      description: "Overall platform security rating",
      icon: Shield
    },
    {
      title: "Active Threats",
      value: "2",
      status: "warning",
      description: "Potential security threats detected",
      icon: AlertTriangle
    },
    {
      title: "Failed Logins",
      value: "23",
      status: "moderate",
      description: "Failed login attempts (24h)",
      icon: XCircle
    },
    {
      title: "2FA Adoption",
      value: "67%",
      status: "good",
      description: "Users with 2FA enabled",
      icon: Lock
    }
  ];

  const securityAlerts = [
    {
      id: 1,
      level: 'high',
      title: 'Multiple failed login attempts',
      description: 'User account: john.doe@company.com - 15 failed attempts in 10 minutes',
      timestamp: '2024-01-15 16:45:23',
      source: 'Authentication System',
      status: 'investigating'
    },
    {
      id: 2,
      level: 'medium',
      title: 'Unusual API access pattern',
      description: 'API key abc123*** showing 300% increase in requests',
      timestamp: '2024-01-15 16:30:12',
      source: 'API Gateway',
      status: 'resolved'
    },
    {
      id: 3,
      level: 'low',
      title: 'Password policy violation attempt',
      description: 'User attempted to set weak password: jane.smith@company.com',
      timestamp: '2024-01-15 15:22:45',
      source: 'User Management',
      status: 'auto-resolved'
    },
    {
      id: 4,
      level: 'medium',
      title: 'Suspicious login location',
      description: 'Admin login from unusual location: Moscow, Russia',
      timestamp: '2024-01-15 14:15:30',
      source: 'Authentication System',
      status: 'investigating'
    }
  ];

  const accessControlPolicies = [
    {
      id: 1,
      name: 'Admin Access Control',
      description: 'Restrict admin panel access to specific IP ranges',
      status: 'active',
      lastModified: '2024-01-10',
      coverage: 95
    },
    {
      id: 2,
      name: 'API Rate Limiting',
      description: 'Limit API requests to prevent abuse',
      status: 'active',
      lastModified: '2024-01-08',
      coverage: 100
    },
    {
      id: 3,
      name: 'Session Management',
      description: 'Auto-logout inactive sessions after 60 minutes',
      status: 'active',
      lastModified: '2024-01-05',
      coverage: 98
    },
    {
      id: 4,
      name: 'Password Complexity',
      description: 'Enforce strong password requirements',
      status: 'warning',
      lastModified: '2024-01-03',
      coverage: 78
    }
  ];

  const auditLogs = [
    {
      id: 1,
      timestamp: '2024-01-15 16:50:12',
      user: 'admin@company.com',
      action: 'User account suspended',
      resource: 'user:john.doe@company.com',
      ip: '192.168.1.100',
      success: true
    },
    {
      id: 2,
      timestamp: '2024-01-15 16:45:30',
      user: 'recruiter@company.com',
      action: 'Interview template created',
      resource: 'template:senior-developer',
      ip: '192.168.1.105',
      success: true
    },
    {
      id: 3,
      timestamp: '2024-01-15 16:40:15',
      user: 'admin@company.com',
      action: 'Security policy updated',
      resource: 'policy:password-complexity',
      ip: '192.168.1.100',
      success: true
    },
    {
      id: 4,
      timestamp: '2024-01-15 16:35:22',
      user: 'unknown',
      action: 'Failed admin login',
      resource: 'admin-panel',
      ip: '185.220.101.42',
      success: false
    }
  ];

  const complianceChecks = [
    { name: 'GDPR Compliance', status: 'compliant', score: 98 },
    { name: 'SOC 2 Type II', status: 'compliant', score: 96 },
    { name: 'ISO 27001', status: 'in-progress', score: 85 },
    { name: 'HIPAA', status: 'non-applicable', score: 0 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Excellent</Badge>;
      case 'good': return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">Good</Badge>;
      case 'moderate': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">Moderate</Badge>;
      case 'warning': return <Badge className="bg-orange-400/20 text-orange-400 border-orange-400/30">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">Critical</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  const getAlertLevelBadge = (level: string) => {
    switch (level) {
      case 'high': return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">Medium</Badge>;
      case 'low': return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">Low</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  const getAlertStatusBadge = (status: string) => {
    switch (status) {
      case 'investigating': return <Badge className="bg-orange-400/20 text-orange-400 border-orange-400/30">Investigating</Badge>;
      case 'resolved': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Resolved</Badge>;
      case 'auto-resolved': return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">Auto-Resolved</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  const getPolicyStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Active</Badge>;
      case 'warning': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">Warning</Badge>;
      case 'inactive': return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Inactive</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Compliant</Badge>;
      case 'in-progress': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">In Progress</Badge>;
      case 'non-compliant': return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">Non-Compliant</Badge>;
      case 'non-applicable': return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">N/A</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="bg-dark-secondary border-border-dark">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">{metric.title}</p>
                    <p className="text-2xl font-bold text-text-primary mt-1">{metric.value}</p>
                    <p className="text-xs text-text-secondary mt-1">{metric.description}</p>
                  </div>
                  <Icon className="h-8 w-8 text-tech-green" />
                </div>
                <div className="mt-3">
                  {getStatusBadge(metric.status)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Alerts */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-tech-green" />
            Security Alerts
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Recent security events and threat notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-lg border border-border-dark bg-dark-primary/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getAlertLevelBadge(alert.level)}
                      {getAlertStatusBadge(alert.status)}
                      <span className="text-xs text-text-secondary">{alert.source}</span>
                    </div>
                    <h4 className="font-medium text-text-primary">{alert.title}</h4>
                    <p className="text-sm text-text-secondary mt-1">{alert.description}</p>
                    <p className="text-xs text-text-secondary mt-2">{alert.timestamp}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                      <Eye size={14} />
                    </Button>
                    <Button size="sm" variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Access Control Policies */}
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <Lock className="h-5 w-5 text-tech-green" />
              Access Control Policies
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Security policies and their enforcement status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accessControlPolicies.map((policy) => (
                <div key={policy.id} className="p-3 rounded-lg border border-border-dark bg-dark-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text-primary">{policy.name}</h4>
                    {getPolicyStatusBadge(policy.status)}
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{policy.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-secondary">Coverage: {policy.coverage}%</span>
                    <span className="text-xs text-text-secondary">Modified: {policy.lastModified}</span>
                  </div>
                  <Progress value={policy.coverage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Monitoring */}
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-tech-green" />
              Compliance Monitoring
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Regulatory compliance status and scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceChecks.map((check, index) => (
                <div key={index} className="p-3 rounded-lg border border-border-dark bg-dark-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text-primary">{check.name}</h4>
                    {getComplianceStatusBadge(check.status)}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">Compliance Score</span>
                    <span className="text-sm text-text-primary font-medium">{check.score}%</span>
                  </div>
                  {check.score > 0 && (
                    <Progress value={check.score} className="h-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <FileText className="h-5 w-5 text-tech-green" />
            Audit Trail
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Recent admin activities and system changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border border-border-dark bg-dark-primary/30">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {log.success ? (
                      <CheckCircle size={16} className="text-tech-green" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                    <span className="font-medium text-text-primary">{log.action}</span>
                    <Badge variant="outline" className="border-border-dark text-text-secondary text-xs">
                      {log.resource}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span>User: {log.user}</span>
                    <span>IP: {log.ip}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Eye size={12} />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
              View Full Audit Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
