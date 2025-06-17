
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Users,
  Clock,
  Target,
  Mail,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

const ReportingSystem = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const reportTemplates = [
    { 
      id: 1, 
      name: 'User Activity Report', 
      description: 'Daily/weekly/monthly user engagement metrics',
      type: 'analytics',
      lastGenerated: '2024-01-15',
      frequency: 'weekly',
      format: 'PDF'
    },
    { 
      id: 2, 
      name: 'Interview Performance', 
      description: 'Interview completion rates and success metrics',
      type: 'performance',
      lastGenerated: '2024-01-14',
      frequency: 'daily',
      format: 'Excel'
    },
    { 
      id: 3, 
      name: 'Revenue Analytics', 
      description: 'Subscription revenue and billing analytics',
      type: 'financial',
      lastGenerated: '2024-01-15',
      frequency: 'monthly',
      format: 'PDF'
    },
    { 
      id: 4, 
      name: 'System Health Report', 
      description: 'Platform uptime, performance, and error rates',
      type: 'technical',
      lastGenerated: '2024-01-15',
      frequency: 'daily',
      format: 'CSV'
    }
  ];

  const scheduledReports = [
    {
      id: 1,
      name: 'Weekly User Summary',
      schedule: 'Every Monday at 9:00 AM',
      recipients: ['admin@company.com', 'analytics@company.com'],
      format: 'PDF',
      status: 'active'
    },
    {
      id: 2,
      name: 'Monthly Revenue Report',
      schedule: '1st of every month at 8:00 AM',
      recipients: ['finance@company.com'],
      format: 'Excel',
      status: 'active'
    },
    {
      id: 3,
      name: 'Daily System Health',
      schedule: 'Daily at 6:00 AM',
      recipients: ['devops@company.com'],
      format: 'CSV',
      status: 'paused'
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'User Activity Report - Week 3',
      generatedDate: '2024-01-15 09:00',
      size: '2.4 MB',
      format: 'PDF',
      downloadCount: 12
    },
    {
      id: 2,
      name: 'Interview Performance - January 14',
      generatedDate: '2024-01-14 23:45',
      size: '856 KB',
      format: 'Excel',
      downloadCount: 8
    },
    {
      id: 3,
      name: 'System Health - January 15',
      generatedDate: '2024-01-15 06:00',
      size: '245 KB',
      format: 'CSV',
      downloadCount: 3
    },
    {
      id: 4,
      name: 'Revenue Analytics - December 2023',
      generatedDate: '2024-01-01 08:00',
      size: '1.8 MB',
      format: 'PDF',
      downloadCount: 25
    }
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'analytics': return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">Analytics</Badge>;
      case 'performance': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Performance</Badge>;
      case 'financial': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">Financial</Badge>;
      case 'technical': return <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30">Technical</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Other</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Active</Badge>;
      case 'paused': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">Paused</Badge>;
      case 'error': return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">Error</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  const getFormatBadge = (format: string) => {
    switch (format) {
      case 'PDF': return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">PDF</Badge>;
      case 'Excel': return <Badge className="bg-green-400/20 text-green-400 border-green-400/30">Excel</Badge>;
      case 'CSV': return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">CSV</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Reporting Header */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Reporting System</h2>
          <p className="text-text-secondary mt-1">Generate and manage automated reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
            <Plus size={16} className="mr-2" />
            New Template
          </Button>
          <Button className="bg-tech-green hover:bg-tech-green/90 text-dark-primary">
            <FileText size={16} className="mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Custom Report Builder */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-tech-green" />
            Custom Report Builder
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Build and generate custom reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="report_name" className="text-text-primary">Report Name</Label>
                <Input 
                  id="report_name" 
                  placeholder="Enter report name..." 
                  className="mt-1 bg-dark-primary border-border-dark text-text-primary"
                />
              </div>
              <div>
                <Label className="text-text-primary">Report Type</Label>
                <Select>
                  <SelectTrigger className="mt-1 bg-dark-primary border-border-dark text-text-primary">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-secondary border-border-dark">
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-text-primary">Date Range</Label>
                <div className="flex gap-2 mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 justify-start border-border-dark text-text-secondary hover:text-text-primary">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-dark-secondary border-border-dark">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label className="text-text-primary">Output Format</Label>
                <Select>
                  <SelectTrigger className="mt-1 bg-dark-primary border-border-dark text-text-primary">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-secondary border-border-dark">
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-text-primary">Email Recipients</Label>
                <Input 
                  placeholder="email1@company.com, email2@company.com" 
                  className="mt-1 bg-dark-primary border-border-dark text-text-primary"
                />
              </div>
              <div className="pt-6">
                <Button className="w-full bg-tech-green hover:bg-tech-green/90 text-dark-primary">
                  <Download size={16} className="mr-2" />
                  Generate & Download
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <FileText className="h-5 w-5 text-tech-green" />
            Report Templates
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Pre-configured report templates for quick generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reportTemplates.map((template) => (
              <div key={template.id} className="p-4 rounded-lg border border-border-dark bg-dark-primary/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-text-primary">{template.name}</h4>
                    <p className="text-sm text-text-secondary mt-1">{template.description}</p>
                  </div>
                  {getTypeBadge(template.type)}
                </div>
                <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
                  <span>Last generated: {template.lastGenerated}</span>
                  <div className="flex items-center gap-2">
                    {getFormatBadge(template.format)}
                    <Badge variant="outline" className="border-border-dark text-text-secondary">
                      {template.frequency}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-tech-green hover:bg-tech-green/90 text-dark-primary">
                    <Download size={14} className="mr-2" />
                    Generate
                  </Button>
                  <Button size="sm" variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                    <Edit size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduled Reports */}
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <Clock className="h-5 w-5 text-tech-green" />
              Scheduled Reports
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Automated report delivery schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledReports.map((report) => (
                <div key={report.id} className="p-3 rounded-lg border border-border-dark bg-dark-primary/30">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-text-primary">{report.name}</h4>
                    {getStatusBadge(report.status)}
                  </div>
                  <p className="text-sm text-text-secondary mb-2">{report.schedule}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getFormatBadge(report.format)}
                      <span className="text-xs text-text-secondary">
                        {report.recipients.length} recipient{report.recipients.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Edit size={12} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-400 hover:text-red-300">
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="bg-dark-secondary border-border-dark">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tech-green" />
              Recent Reports
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Recently generated report files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 rounded-lg border border-border-dark bg-dark-primary/30">
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary text-sm">{report.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-secondary">{report.generatedDate}</span>
                      <span className="text-xs text-text-secondary">•</span>
                      <span className="text-xs text-text-secondary">{report.size}</span>
                      <span className="text-xs text-text-secondary">•</span>
                      <span className="text-xs text-text-secondary">{report.downloadCount} downloads</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getFormatBadge(report.format)}
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Download size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportingSystem;
