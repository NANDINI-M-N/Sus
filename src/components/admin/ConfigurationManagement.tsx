
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Flag, 
  Link, 
  Shield, 
  Mail, 
  Bell,
  Save,
  RotateCcw,
  Globe,
  Key,
  Database,
  Cloud
} from 'lucide-react';

const ConfigurationManagement = () => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const featureFlags = [
    { id: 'video_interviews', name: 'Video Interviews', enabled: true, description: 'Enable video interview functionality' },
    { id: 'ai_analysis', name: 'AI Analysis', enabled: true, description: 'Enable AI-powered interview analysis' },
    { id: 'screen_sharing', name: 'Screen Sharing', enabled: false, description: 'Allow screen sharing during interviews' },
    { id: 'bulk_scheduling', name: 'Bulk Scheduling', enabled: true, description: 'Enable bulk interview scheduling' },
    { id: 'candidate_feedback', name: 'Candidate Feedback', enabled: false, description: 'Allow candidates to provide feedback' },
    { id: 'interview_recording', name: 'Interview Recording', enabled: true, description: 'Enable interview recording feature' }
  ];

  const integrations = [
    { 
      id: 'google_calendar', 
      name: 'Google Calendar', 
      status: 'connected', 
      description: 'Sync interviews with Google Calendar',
      lastSync: '2024-01-15 16:30'
    },
    { 
      id: 'slack', 
      name: 'Slack', 
      status: 'disconnected', 
      description: 'Send notifications to Slack channels',
      lastSync: 'Never'
    },
    { 
      id: 'outlook', 
      name: 'Outlook', 
      status: 'error', 
      description: 'Sync interviews with Outlook Calendar',
      lastSync: '2024-01-10 09:15'
    },
    { 
      id: 'zoom', 
      name: 'Zoom', 
      status: 'connected', 
      description: 'Generate Zoom meeting links automatically',
      lastSync: '2024-01-15 14:45'
    }
  ];

  const securityPolicies = [
    { id: 'password_policy', name: 'Password Policy', value: 'Strong', description: 'Minimum 8 characters, mixed case, numbers' },
    { id: 'session_timeout', name: 'Session Timeout', value: '60 minutes', description: 'Auto-logout after inactivity' },
    { id: 'two_factor', name: 'Two-Factor Auth', value: 'Optional', description: 'Require 2FA for admin accounts' },
    { id: 'api_rate_limit', name: 'API Rate Limit', value: '1000/hour', description: 'Requests per hour per user' }
  ];

  const emailTemplates = [
    { id: 'interview_invitation', name: 'Interview Invitation', status: 'active', lastModified: '2024-01-10' },
    { id: 'interview_reminder', name: 'Interview Reminder', status: 'active', lastModified: '2024-01-08' },
    { id: 'interview_confirmation', name: 'Interview Confirmation', status: 'active', lastModified: '2024-01-05' },
    { id: 'interview_cancellation', name: 'Interview Cancellation', status: 'draft', lastModified: '2024-01-03' },
    { id: 'feedback_request', name: 'Feedback Request', status: 'inactive', lastModified: '2023-12-28' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Connected</Badge>;
      case 'disconnected': return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Disconnected</Badge>;
      case 'error': return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">Error</Badge>;
      case 'active': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Active</Badge>;
      case 'inactive': return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Inactive</Badge>;
      case 'draft': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">Draft</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  const handleSaveChanges = () => {
    setUnsavedChanges(false);
    // Simulate save operation
    console.log('Saving configuration changes...');
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Configuration Management</h2>
          <p className="text-text-secondary mt-1">Manage platform settings and integrations</p>
        </div>
        {unsavedChanges && (
          <div className="flex gap-3">
            <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
              <RotateCcw size={16} className="mr-2" />
              Reset Changes
            </Button>
            <Button onClick={handleSaveChanges} className="bg-tech-green hover:bg-tech-green/90 text-dark-primary">
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Platform Settings */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Settings className="h-5 w-5 text-tech-green" />
            Platform Settings
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Configure general platform settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="platform_name" className="text-text-primary">Platform Name</Label>
                <Input 
                  id="platform_name" 
                  defaultValue="CodeInterview Pro" 
                  className="mt-1 bg-dark-primary border-border-dark text-text-primary"
                  onChange={() => setUnsavedChanges(true)}
                />
              </div>
              <div>
                <Label htmlFor="support_email" className="text-text-primary">Support Email</Label>
                <Input 
                  id="support_email" 
                  defaultValue="support@codeinterview.pro" 
                  className="mt-1 bg-dark-primary border-border-dark text-text-primary"
                  onChange={() => setUnsavedChanges(true)}
                />
              </div>
              <div>
                <Label htmlFor="max_interview_duration" className="text-text-primary">Max Interview Duration (minutes)</Label>
                <Input 
                  id="max_interview_duration" 
                  type="number" 
                  defaultValue="180" 
                  className="mt-1 bg-dark-primary border-border-dark text-text-primary"
                  onChange={() => setUnsavedChanges(true)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="default_timezone" className="text-text-primary">Default Timezone</Label>
                <Select onValueChange={() => setUnsavedChanges(true)}>
                  <SelectTrigger className="mt-1 bg-dark-primary border-border-dark text-text-primary">
                    <SelectValue placeholder="UTC" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-secondary border-border-dark">
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                    <SelectItem value="cet">CET</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="company_logo" className="text-text-primary">Company Logo URL</Label>
                <Input 
                  id="company_logo" 
                  placeholder="https://example.com/logo.png" 
                  className="mt-1 bg-dark-primary border-border-dark text-text-primary"
                  onChange={() => setUnsavedChanges(true)}
                />
              </div>
              <div>
                <Label htmlFor="privacy_policy" className="text-text-primary">Privacy Policy URL</Label>
                <Input 
                  id="privacy_policy" 
                  defaultValue="https://codeinterview.pro/privacy" 
                  className="mt-1 bg-dark-primary border-border-dark text-text-primary"
                  onChange={() => setUnsavedChanges(true)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Flag className="h-5 w-5 text-tech-green" />
            Feature Flags
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Enable or disable platform features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {featureFlags.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between p-4 rounded-lg border border-border-dark bg-dark-primary/50">
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">{flag.name}</h4>
                  <p className="text-sm text-text-secondary mt-1">{flag.description}</p>
                </div>
                <Switch 
                  checked={flag.enabled} 
                  onCheckedChange={() => setUnsavedChanges(true)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Settings */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Link className="h-5 w-5 text-tech-green" />
            Integration Settings
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Manage third-party integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 rounded-lg border border-border-dark bg-dark-primary/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-text-primary">{integration.name}</h4>
                    {getStatusBadge(integration.status)}
                  </div>
                  <p className="text-sm text-text-secondary">{integration.description}</p>
                  <p className="text-xs text-text-secondary mt-1">Last sync: {integration.lastSync}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                    Configure
                  </Button>
                  {integration.status === 'connected' ? (
                    <Button size="sm" variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                      Disconnect
                    </Button>
                  ) : (
                    <Button size="sm" className="bg-tech-green hover:bg-tech-green/90 text-dark-primary">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Policies */}
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <Shield className="h-5 w-5 text-tech-green" />
              Security Policies
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Configure security and access policies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityPolicies.map((policy) => (
                <div key={policy.id} className="p-3 rounded-lg border border-border-dark bg-dark-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text-primary">{policy.name}</h4>
                    <span className="text-sm text-tech-green font-medium">{policy.value}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{policy.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Email Templates */}
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <Mail className="h-5 w-5 text-tech-green" />
              Email Templates
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Manage email template configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emailTemplates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-3 rounded-lg border border-border-dark bg-dark-primary/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium text-text-primary">{template.name}</h4>
                      {getStatusBadge(template.status)}
                    </div>
                    <p className="text-xs text-text-secondary">Modified: {template.lastModified}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfigurationManagement;
