import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  Home,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  ChevronRight,
  X,
  Briefcase,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useInterviews } from '@/hooks/useInterviews';
import { useActivities } from '@/hooks/useActivities';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  progress?: number;
}

interface Interview {
  id: string;
  candidate: string;
  position: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  metadata?: any;
}

const RecruiterDashboard = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { signOut, user } = useAuth();
  const { profile } = useProfile();
  const { interviews, loading } = useInterviews();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.contains(event.target as Node) && showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const handleNavigation = (id: string) => {
    setActiveNav(id);
    switch(id) {
      case 'interviews':
        navigate('/interviews');
        break;
      case 'candidates':
        navigate('/candidates');
        break;
      case 'analytics':
        navigate('/reports');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        // Stay on dashboard
        break;
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for "${searchQuery}"`,
      });
      // In a real app, this would navigate to search results or filter the current view
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Calculate stats from actual data
  const activeInterviews = interviews.filter(interview => 
    interview.status === 'scheduled' || interview.status === 'in_progress'
  ).length;
  
  const pendingReviews = interviews.filter(interview => 
    interview.status === 'completed' && !interview.feedback
  ).length;
  
  // Get unique candidate IDs
  const uniqueCandidates = new Set(
    interviews.filter(interview => interview.candidate_id).map(interview => interview.candidate_id)
  ).size;
  
  // Calculate this month's completed interviews
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const completedThisMonth = interviews.filter(interview => {
    if (interview.status !== 'completed') return false;
    const completedDate = new Date(interview.updated_at);
    return completedDate >= startOfMonth;
  }).length;
  
  // Calculate progress percentages
  const interviewProgress = Math.min(100, Math.round((completedThisMonth / 20) * 100)); // Assuming target is 20
  const candidateProgress = Math.min(100, Math.round((uniqueCandidates / 30) * 100)); // Assuming target is 30
  const reviewProgress = Math.min(100, Math.round(((pendingReviews * -1) + 10) / 10 * 100)); // Inverse - less is better
  
  const stats: StatCard[] = [
    {
      title: 'Active Interviews',
      value: activeInterviews.toString(),
      change: 'Currently active',
      icon: Calendar,
      color: 'text-emerald-green',
      bgColor: 'bg-emerald-green/10',
      progress: interviewProgress
    },
    {
      title: 'Total Candidates',
      value: uniqueCandidates.toString(),
      change: 'In your interviews',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      progress: candidateProgress
    },
    {
      title: 'Pending Reviews',
      value: pendingReviews.toString(),
      change: 'Need feedback',
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      progress: reviewProgress
    },
    {
      title: 'This Month\'s Completed',
      value: completedThisMonth.toString(),
      change: `Since ${startOfMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      icon: CheckCircle,
      color: 'text-emerald-green',
      bgColor: 'bg-emerald-green/10'
    }
  ];

  // Filter interviews for the current recruiter and upcoming ones
  const upcomingInterviews = interviews.filter(interview => {
    if (!user || interview.recruiter_id !== user.id) return false;
    if (interview.status === 'cancelled' || interview.status === 'completed') return false;
    if (!interview.scheduled_at) return false;
    
    const interviewDate = new Date(interview.scheduled_at);
    const now = new Date();
    return interviewDate > now;
  }).sort((a, b) => {
    const dateA = new Date(a.scheduled_at!);
    const dateB = new Date(b.scheduled_at!);
    return dateA.getTime() - dateB.getTime();
  }).slice(0, 5); // Show only first 5 upcoming interviews

  const { activities, loading: activitiesLoading, formatActivityTime } = useActivities();
  const recentActivities = activities.slice(0, 4);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const quickActions = [
    { 
      label: 'Schedule Interview', 
      icon: Calendar, 
      color: 'bg-emerald-green',
      action: () => navigate('/schedule')
    },
    { 
      label: 'Add Candidate', 
      icon: Plus, 
      color: 'bg-blue-600',
      action: () => navigate('/candidates?action=add')
    },
    { 
      label: 'View Reports', 
      icon: FileText, 
      color: 'bg-purple-600',
      action: () => navigate('/reports')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-400/20 text-blue-400';
      case 'in-progress': return 'bg-emerald-green/20 text-emerald-green';
      case 'completed': return 'bg-gray-400/20 text-gray-400';
      default: return 'bg-gray-400/20 text-gray-400';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'interview': return Calendar;
      case 'candidate': return Users;
      case 'review': return FileText;
      case 'hire': return CheckCircle;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'interview': return 'bg-emerald-green/20 text-emerald-green';
      case 'candidate': return 'bg-blue-400/20 text-blue-400';
      case 'review': return 'bg-purple-400/20 text-purple-400';
      case 'hire': return 'bg-yellow-400/20 text-yellow-400';
      default: return 'bg-gray-400/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Top Navigation Bar */}
      <header className="bg-dark-secondary border-b border-border-dark sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-emerald-green rounded-lg flex items-center justify-center">
                <Code className="h-5 w-5 text-dark-primary" />
              </div>
              <span className="text-xl font-bold text-text-primary hidden md:block">CodeInterview</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                      activeNav === item.id
                        ? 'bg-emerald-green/10 text-emerald-green'
                        : 'text-text-secondary hover:text-text-primary hover:bg-dark-primary'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            
            {/* Search and User Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Bar - Hidden on mobile */}
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-60 bg-dark-primary border-border-dark text-text-primary h-9 rounded-full"
                />
              </form>
              
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-text-secondary hover:text-text-primary relative"
                onClick={() => toast({
                  title: "Notifications",
                  description: "You have 3 unread notifications",
                })}
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-emerald-green/20 text-emerald-green">
                        {profile?.first_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-dark-secondary border-border-dark">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-text-primary">{profile?.first_name || ''} {profile?.last_name || ''}</p>
                      <p className="text-sm text-text-secondary">{profile?.email || ''}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-border-dark" />
                  <DropdownMenuItem 
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer text-text-secondary hover:text-text-primary"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/settings')}
                    className="cursor-pointer text-text-secondary hover:text-text-primary"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border-dark" />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="cursor-pointer text-text-secondary hover:text-text-primary"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-text-secondary hover:text-text-primary"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div 
          id="mobile-menu"
          className="fixed inset-0 z-40 md:hidden"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)}></div>
          <div className="fixed top-0 right-0 h-full w-64 bg-dark-secondary border-l border-border-dark p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Menu</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-text-secondary hover:text-text-primary"
                onClick={() => setShowMobileMenu(false)}
              >
                <X size={18} />
              </Button>
            </div>
            
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleNavigation(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                      activeNav === item.id
                        ? 'bg-emerald-green/10 text-emerald-green'
                        : 'text-text-secondary hover:text-text-primary hover:bg-dark-primary'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="border-t border-border-dark mt-6 pt-6">
              <div className="flex items-center space-x-3 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-emerald-green/20 text-emerald-green">
                    {profile?.first_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-text-primary font-medium">{profile?.first_name || ''} {profile?.last_name || ''}</p>
                  <p className="text-text-secondary text-sm">Senior Recruiter</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-text-secondary hover:text-text-primary"
                onClick={handleSignOut}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome back, {profile?.first_name || 'Recruiter'}!
          </h1>
          <p className="text-text-secondary">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Card 
                key={index} 
                className="bg-dark-secondary border-border-dark hover:border-emerald-green/30 transition-all duration-300 cursor-pointer group overflow-hidden relative"
                onClick={action.action}
              >
                <div className={`absolute inset-0 ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                      <IconComponent size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-text-primary">{action.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-text-secondary group-hover:text-emerald-green group-hover:translate-x-1 transition-all duration-300" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={index} 
                className="bg-dark-secondary border-border-dark hover:border-emerald-green/30 transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-text-secondary text-sm mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgColor} ${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                      <IconComponent size={20} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {stat.progress !== undefined && (
                      <Progress value={stat.progress} className={`h-1 bg-dark-primary ${stat.color.replace('text', 'bg')}`} />
                    )}
                    <p className="text-xs text-text-secondary">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Interviews */}
          <Card className="bg-dark-secondary border-border-dark lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between px-6">
              <CardTitle className="text-lg font-semibold text-text-primary">Upcoming Interviews</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-text-secondary hover:text-text-primary"
                onClick={() => navigate('/interviews')}
              >
                View All
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-green"></div>
                </div>
              ) : upcomingInterviews.length === 0 ? (
                <div className="text-center py-12 bg-dark-primary/30 rounded-lg border border-border-dark">
                  <Calendar className="h-12 w-12 text-text-secondary mx-auto mb-3" />
                  <p className="text-text-secondary mb-2">No upcoming interviews</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-emerald-green text-emerald-green hover:bg-emerald-green hover:text-dark-primary"
                    onClick={() => navigate('/schedule')}
                  >
                    <Plus size={16} className="mr-1" />
                    Schedule Interview
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => (
                    <div 
                      key={interview.id} 
                      className="flex items-center p-4 bg-dark-primary/50 rounded-lg border border-border-dark hover:border-emerald-green/30 transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/interview-room?id=${interview.id}`)}
                    >
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarFallback className="bg-blue-400/20 text-blue-400">
                          {interview.candidate ? 
                            `${interview.candidate.first_name?.[0] || ''}${interview.candidate.last_name?.[0] || ''}` : 
                            'UC'
                          }
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-text-primary font-medium truncate">
                            {interview.candidate ? 
                              `${interview.candidate.first_name} ${interview.candidate.last_name}` : 
                              'Unknown Candidate'
                            }
                          </p>
                          <Badge className={`${getStatusColor(interview.status || 'scheduled')} ml-2`}>
                            {interview.status || 'scheduled'}
                          </Badge>
                        </div>
                        <div className="flex items-center text-text-secondary text-sm">
                          <Briefcase size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{interview.job_position?.title || 'No Position'}</span>
                          <span className="mx-2">•</span>
                          <Clock size={14} className="mr-1 flex-shrink-0" />
                          <span>
                            {interview.scheduled_at ? 
                              format(new Date(interview.scheduled_at), 'MMM dd, h:mm a') : 
                              'No time set'
                            }
                          </span>
                        </div>
                      </div>
                      
                      <ChevronRight size={16} className="text-text-secondary ml-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-dark-secondary border-border-dark">
            <CardHeader className="flex flex-row items-center justify-between px-6">
              <CardTitle className="text-lg font-semibold text-text-primary">Recent Activity</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-text-secondary hover:text-text-primary"
                onClick={() => navigate('/activities')}
              >
                View All
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-green"></div>
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="text-center py-12 bg-dark-primary/30 rounded-lg border border-border-dark">
                  <Clock className="h-12 w-12 text-text-secondary mx-auto mb-3" />
                  <p className="text-text-secondary">No recent activities</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentActivities.map((activity) => {
                    const IconComponent = getActivityIcon(activity.type);
                    const colorClass = getActivityColor(activity.type);
                    return (
                      <div key={activity.id} className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-text-primary font-medium mb-1">{activity.title}</p>
                          <p className="text-text-secondary text-sm mb-2">{activity.description}</p>
                          <p className="text-text-secondary text-xs">{formatActivityTime(activity.created_at)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
