import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Star,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useReportData } from '@/hooks/useReportData';
import { Skeleton } from '@/components/ui/skeleton';

const InterviewReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { interviewReports, loading, error } = useReportData();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Completed</Badge>;
      case 'in_review': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">In Review</Badge>;
      case 'pending': return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">Pending</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_hire': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Strong Hire</Badge>;
      case 'hire': return <Badge className="bg-green-400/20 text-green-400 border-green-400/30">Hire</Badge>;
      case 'consider': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">Consider</Badge>;
      case 'no_hire': return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">No Hire</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Pending</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-tech-green';
    if (score >= 7.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredReports = interviewReports.filter(report => {
    const matchesSearch = report.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.interviewer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (error) {
    return (
      <Card className="bg-dark-secondary border-border-dark">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Error loading interview reports: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
                <Input
                  placeholder="Search by candidate, position, or interviewer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-dark-primary border-border-dark text-text-primary"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 bg-dark-primary border-border-dark text-text-primary">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-dark-secondary border-border-dark">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                <Filter size={16} className="mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interview Reports List */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeletons
          Array(3).fill(0).map((_, index) => (
            <Card key={index} className="bg-dark-secondary border-border-dark">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 min-w-[200px]">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredReports.length === 0 ? (
          <Card className="bg-dark-secondary border-border-dark">
            <CardContent className="p-6">
              <div className="text-center text-text-secondary">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p>No interview reports found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="bg-dark-secondary border-border-dark hover:border-tech-green/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Report Header */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">{report.candidate}</h3>
                        <p className="text-text-secondary">{report.position}</p>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>{report.interviewer}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{report.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} />
                          <span className={getScoreColor(report.overall_score)}>
                            {report.overall_score.toFixed(1)}/10
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">{report.ai_analysis}</p>
                      </div>
                      <div className="flex gap-2">
                        {getRecommendationBadge(report.recommendation)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <Button className="w-full bg-tech-green hover:bg-tech-green/90 text-dark-primary">
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" className="w-full border-border-dark text-text-secondary hover:text-text-primary">
                      <Download size={16} className="mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default InterviewReports;
