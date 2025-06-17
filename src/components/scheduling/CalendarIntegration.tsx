
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  Download, 
  Upload, 
  RotateCw, 
  Mail,
  Clock,
  Link,
  Globe
} from 'lucide-react';

const CalendarIntegration = () => {
  const [syncStatus, setSyncStatus] = useState('connected');

  const integrations = [
    {
      id: 'google',
      name: 'Google Calendar',
      icon: '📅',
      status: 'connected',
      lastSync: '2 minutes ago',
      events: 24,
      conflicts: 0
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      icon: '📧',
      status: 'connected',
      lastSync: '5 minutes ago',
      events: 18,
      conflicts: 2
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      icon: '🍎',
      status: 'disconnected',
      lastSync: 'Never',
      events: 0,
      conflicts: 0
    },
    {
      id: 'zoom',
      name: 'Zoom Meetings',
      icon: '💻',
      status: 'connected',
      lastSync: '1 hour ago',
      events: 15,
      conflicts: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-tech-green/20 text-tech-green border-tech-green';
      case 'syncing': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'disconnected': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'error': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle size={16} className="text-tech-green" />;
      case 'syncing': return <RotateCw size={16} className="text-blue-400 animate-spin" />;
      case 'disconnected': return <AlertCircle size={16} className="text-red-400" />;
      case 'error': return <AlertCircle size={16} className="text-yellow-400" />;
      default: return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Integration Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-dark-secondary border-border-dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-tech-green" />
              <div>
                <p className="text-lg font-semibold text-text-primary">3</p>
                <p className="text-sm text-text-secondary">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-secondary border-border-dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RotateCw className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-lg font-semibold text-text-primary">57</p>
                <p className="text-sm text-text-secondary">Synced Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-secondary border-border-dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-lg font-semibold text-text-primary">2</p>
                <p className="text-sm text-text-secondary">Conflicts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-secondary border-border-dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-lg font-semibold text-text-primary">2m</p>
                <p className="text-sm text-text-secondary">Last Sync</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Integrations */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-lg text-text-primary flex items-center gap-2">
            <Calendar className="h-5 w-5 text-tech-green" />
            Calendar Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 bg-dark-primary rounded-lg border border-border-dark">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{integration.icon}</div>
                <div>
                  <h4 className="font-medium text-text-primary">{integration.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                    <span>Last sync: {integration.lastSync}</span>
                    <span>{integration.events} events</span>
                    {integration.conflicts > 0 && (
                      <span className="text-yellow-400">{integration.conflicts} conflicts</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className={`${getStatusColor(integration.status)} border capitalize`}>
                  {getStatusIcon(integration.status)}
                  <span className="ml-1">{integration.status}</span>
                </Badge>
                {integration.status === 'connected' ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                      <Settings size={14} />
                    </Button>
                    <Button size="sm" variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                      <RotateCw size={14} />
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" className="bg-tech-green hover:bg-tech-green/90 text-dark-primary">
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sync Settings */}
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-lg text-text-primary flex items-center gap-2">
              <Settings className="h-5 w-5 text-tech-green" />
              Sync Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-text-primary">Auto-sync calendars</Label>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-text-primary">Sync frequency</Label>
              <select className="bg-dark-primary border border-border-dark rounded px-3 py-1 text-text-primary text-sm">
                <option>Every 5 minutes</option>
                <option>Every 15 minutes</option>
                <option>Every 30 minutes</option>
                <option>Every hour</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-text-primary">Conflict notifications</Label>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-text-primary">Create meeting rooms</Label>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-text-primary">Send calendar invites</Label>
              <Switch defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label className="text-text-primary">Default meeting duration</Label>
              <Input 
                type="number" 
                defaultValue="60" 
                className="bg-dark-primary border-border-dark text-text-primary"
                placeholder="Minutes"
              />
            </div>
          </CardContent>
        </Card>

        {/* Export & Import */}
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-lg text-text-primary flex items-center gap-2">
              <Download className="h-5 w-5 text-tech-green" />
              Export & Import
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button className="w-full justify-start bg-tech-green hover:bg-tech-green/90 text-dark-primary">
                <Download className="h-4 w-4 mr-2" />
                Export to ICS File
              </Button>
              <Button variant="outline" className="w-full justify-start border-border-dark text-text-secondary hover:text-text-primary">
                <Upload className="h-4 w-4 mr-2" />
                Import from ICS File
              </Button>
              <Button variant="outline" className="w-full justify-start border-border-dark text-text-secondary hover:text-text-primary">
                <Mail className="h-4 w-4 mr-2" />
                Email Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start border-border-dark text-text-secondary hover:text-text-primary">
                <Link className="h-4 w-4 mr-2" />
                Generate Public Link
              </Button>
            </div>
            
            <div className="pt-4 border-t border-border-dark">
              <h4 className="font-medium text-text-primary mb-3">Meeting Room Integration</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-border-dark text-text-secondary hover:text-text-primary">
                  <Globe className="h-4 w-4 mr-2" />
                  Configure Meeting Rooms
                </Button>
                <div className="flex items-center justify-between">
                  <Label className="text-text-primary">Auto-book rooms</Label>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-lg text-text-primary">Recent Sync Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-primary rounded-lg border border-border-dark">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-tech-green" size={16} />
                <div>
                  <p className="text-sm font-medium text-text-primary">Google Calendar synced successfully</p>
                  <p className="text-xs text-text-secondary">2 minutes ago • 3 new events imported</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-primary rounded-lg border border-border-dark">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-yellow-400" size={16} />
                <div>
                  <p className="text-sm font-medium text-text-primary">Outlook conflict detected</p>
                  <p className="text-xs text-text-secondary">5 minutes ago • Meeting overlap found</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-primary rounded-lg border border-border-dark">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-tech-green" size={16} />
                <div>
                  <p className="text-sm font-medium text-text-primary">Zoom integration updated</p>
                  <p className="text-xs text-text-secondary">1 hour ago • Meeting links generated</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarIntegration;
