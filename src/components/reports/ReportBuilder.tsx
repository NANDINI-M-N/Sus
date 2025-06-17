import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Plus, 
  Trash2, 
  Eye, 
  Save, 
  Calendar as CalendarIcon,
  Filter,
  BarChart3,
  Settings,
  Target,
  Users,
  Clock,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

interface Metric {
  id: string;
  name: string;
  category: string;
}

interface FilterOption {
  id: string;
  name: string;
  type: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  filters: string[];
  popular: boolean;
}

const ReportBuilder = () => {
  const [reportName, setReportName] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [visualizationType, setVisualizationType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [availableMetrics, setAvailableMetrics] = useState<Metric[]>([]);
  const [availableFilters, setAvailableFilters] = useState<FilterOption[]>([]);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);

  useEffect(() => {
    const fetchReportBuilderData = async () => {
      try {
        setLoading(true);

        // Fetch interview data to generate metrics and filters
        const { data: interviews, error: interviewsError } = await supabase
          .from('interviews')
          .select(`
            *,
            candidates (*),
            positions (*),
            users (*)
          `);

        if (interviewsError) throw interviewsError;

        // Generate metrics based on available data
        const metrics: Metric[] = [
          { id: 'completion_rate', name: 'Interview Completion Rate', category: 'performance' },
          { id: 'avg_score', name: 'Average Interview Score', category: 'performance' },
          { id: 'time_to_hire', name: 'Time to Hire', category: 'efficiency' },
          { id: 'hire_rate', name: 'Hire Success Rate', category: 'success' },
          { id: 'technical_score', name: 'Technical Assessment Score', category: 'skills' },
          { id: 'communication_score', name: 'Communication Score', category: 'skills' },
          { id: 'cultural_fit_score', name: 'Cultural Fit Score', category: 'culture' },
          { id: 'problem_solving_score', name: 'Problem Solving Score', category: 'skills' }
        ];

        // Extract unique departments and positions for filters
        const departments = [...new Set(interviews.map(i => i.department))];
        const positions = [...new Set(interviews.map(i => i.positions.title))];
        const interviewers = [...new Set(interviews.map(i => i.users.id))];

        const filters: FilterOption[] = [
          { id: 'department', name: 'Department', type: 'multiselect' },
          { id: 'position', name: 'Position', type: 'multiselect' },
          { id: 'interviewer', name: 'Interviewer', type: 'multiselect' },
          { id: 'date_range', name: 'Date Range', type: 'daterange' },
          { id: 'score_range', name: 'Score Range', type: 'range' }
        ];

        // Generate report templates based on common use cases
        const templates: ReportTemplate[] = [
          {
            id: 'performance_summary',
            name: 'Performance Summary',
            description: 'Overview of interview performance metrics',
            metrics: ['completion_rate', 'avg_score', 'hire_rate'],
            filters: ['department', 'date_range'],
            popular: true
          },
          {
            id: 'skills_analysis',
            name: 'Skills Analysis',
            description: 'Detailed breakdown of candidate skills',
            metrics: ['technical_score', 'communication_score', 'problem_solving_score'],
            filters: ['position', 'date_range'],
            popular: true
          },
          {
            id: 'efficiency_metrics',
            name: 'Efficiency Metrics',
            description: 'Analysis of hiring process efficiency',
            metrics: ['time_to_hire', 'completion_rate'],
            filters: ['department', 'date_range'],
            popular: false
          }
        ];

        setAvailableMetrics(metrics);
        setAvailableFilters(filters);
        setReportTemplates(templates);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchReportBuilderData();
  }, []);

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const useTemplate = (template: ReportTemplate) => {
    setReportName(template.name);
    setSelectedMetrics(template.metrics);
    setSelectedFilters(template.filters);
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      performance: 'bg-tech-green/20 text-tech-green border-tech-green/30',
      efficiency: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
      success: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
      experience: 'bg-purple-400/20 text-purple-400 border-purple-400/30',
      skills: 'bg-orange-400/20 text-orange-400 border-orange-400/30',
      culture: 'bg-pink-400/20 text-pink-400 border-pink-400/30'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-400/20 text-gray-400 border-gray-400/30';
  };

  if (error) {
    return (
      <Card className="bg-dark-secondary border-border-dark">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Error loading report builder data: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-32" />
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Report Builder Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Custom Report Builder</h2>
          <p className="text-text-secondary mt-1">Create personalized analytics reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
            <Save size={16} className="mr-2" />
            Save Template
          </Button>
          <Button className="bg-tech-green hover:bg-tech-green/90 text-dark-primary">
            <Eye size={16} className="mr-2" />
            Preview Report
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-dark-secondary border-border-dark">
              <CardHeader>
                <CardTitle className="text-text-primary flex items-center gap-2">
                  <Settings className="h-5 w-5 text-tech-green" />
                  Report Configuration
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Set up your custom report parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="report_name" className="text-text-primary">Report Name</Label>
                  <Input
                    id="report_name"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="Enter report name..."
                    className="mt-1 bg-dark-primary border-border-dark text-text-primary"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-text-primary">Visualization Type</Label>
                    <Select value={visualizationType} onValueChange={setVisualizationType}>
                      <SelectTrigger className="mt-1 bg-dark-primary border-border-dark text-text-primary">
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-secondary border-border-dark">
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                        <SelectItem value="table">Data Table</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-text-primary">Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full mt-1 justify-start border-border-dark text-text-secondary hover:text-text-primary">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            "Select date range"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Metrics Selection */}
                <div>
                  <Label className="text-text-primary mb-2 block">Select Metrics</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableMetrics.map((metric) => (
                      <div
                        key={metric.id}
                        className="flex items-center space-x-2 p-3 rounded-lg border border-border-dark hover:border-tech-green/50 transition-colors"
                      >
                        <Checkbox
                          id={metric.id}
                          checked={selectedMetrics.includes(metric.id)}
                          onCheckedChange={() => handleMetricToggle(metric.id)}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={metric.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-primary cursor-pointer"
                          >
                            {metric.name}
                          </label>
                          <Badge className={`ml-2 ${getCategoryBadge(metric.category)}`}>
                            {metric.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filters Selection */}
                <div>
                  <Label className="text-text-primary mb-2 block">Apply Filters</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableFilters.map((filter) => (
                      <div
                        key={filter.id}
                        className="flex items-center space-x-2 p-3 rounded-lg border border-border-dark hover:border-tech-green/50 transition-colors"
                      >
                        <Checkbox
                          id={filter.id}
                          checked={selectedFilters.includes(filter.id)}
                          onCheckedChange={() => handleFilterToggle(filter.id)}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={filter.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-primary cursor-pointer"
                          >
                            {filter.name}
                          </label>
                          <Badge className="ml-2 bg-dark-primary/50 text-text-secondary border-border-dark">
                            {filter.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Templates */}
          <div className="space-y-6">
            <Card className="bg-dark-secondary border-border-dark">
              <CardHeader>
                <CardTitle className="text-text-primary">Report Templates</CardTitle>
                <CardDescription className="text-text-secondary">
                  Start with a pre-configured template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 rounded-lg border border-border-dark hover:border-tech-green/50 transition-colors cursor-pointer"
                    onClick={() => useTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-medium text-text-primary">{template.name}</h3>
                        <p className="text-xs text-text-secondary">{template.description}</p>
                      </div>
                      {template.popular && (
                        <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {template.metrics.slice(0, 3).map((metric) => (
                        <Badge
                          key={metric}
                          variant="outline"
                          className="text-xs border-border-dark text-text-secondary"
                        >
                          {availableMetrics.find(m => m.id === metric)?.name || metric}
                        </Badge>
                      ))}
                      {template.metrics.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-border-dark text-text-secondary"
                        >
                          +{template.metrics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportBuilder; 