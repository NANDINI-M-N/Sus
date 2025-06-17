import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
  VideoIcon, 
  Home, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  X, 
  ChevronRight, 
  Code, 
  Filter, 
  Plus,
  User,
  LogOut
} from "lucide-react";
import { useInterviews } from "@/hooks/useInterviews";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/loading/PageLoader";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Interviews = () => {
  const { interviews, loading, updateInterviewStatuses } = useInterviews();
  const { profile } = useProfile();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeNav, setActiveNav] = useState('interviews');

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

  // Update interview statuses when the component loads
  useEffect(() => {
    if (interviews.length > 0) {
      updateInterviewStatuses();
    }
  }, [interviews.length]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigation = (id: string) => {
    setActiveNav(id);
    switch(id) {
      case 'dashboard':
        navigate(profile?.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');
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
        // Stay on interviews
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
      // In a real app, this would filter interviews
    }
  };

  if (loading) {
    return <PageLoader text="Loading interviews..." />;
  }

  const filteredInterviews = interviews.filter(interview => {
    // First apply the status filter
    if (filter === 'all') return true;
    if (filter === 'scheduled') return interview.status === 'scheduled' || interview.status === 'in_progress';
    if (filter === 'completed') return interview.status === 'completed';
    return true;
  }).filter(interview => {
    // Then apply search filter if there's a search query
    if (!searchQuery.trim()) return true;
    
    // Search in title, candidate name, position, etc.
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = interview.title?.toLowerCase().includes(searchLower);
    const candidateMatch = interview.candidate && 
      `${interview.candidate.first_name} ${interview.candidate.last_name}`.toLowerCase().includes(searchLower);
    const positionMatch = interview.job_position?.title?.toLowerCase().includes(searchLower);
    
    return titleMatch || candidateMatch || positionMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Render an interview card
  const renderInterviewCard = (interview: any) => (
    <Card 
      key={interview.id} 
      className="bg-dark-secondary border-border-dark hover:border-tech-green/50 transition-colors group overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-tech-green opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-400/20 text-blue-400">
                {profile?.role !== 'candidate' && interview.candidate ? 
                  `${interview.candidate.first_name?.[0] || ''}${interview.candidate.last_name?.[0] || ''}` : 
                  profile?.role === 'candidate' && interview.recruiter ?
                  `${interview.recruiter.first_name?.[0] || ''}${interview.recruiter.last_name?.[0] || ''}` :
                  'U'
                }
              </AvatarFallback>
            </Avatar>
          <div>
            <CardTitle className="text-text-primary text-lg">
              {interview.title}
            </CardTitle>
            <CardDescription className="text-text-secondary">
              {interview.job_position?.title || 'No position specified'}
            </CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(interview.status)}>
            {formatStatus(interview.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {interview.scheduled_at && (
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {format(new Date(interview.scheduled_at), 'PPP p')}
            </span>
          </div>
        )}
        
        {interview.duration_minutes && (
          <div className="flex items-center gap-2 text-text-secondary">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{interview.duration_minutes} minutes</span>
          </div>
        )}

        {profile?.role !== 'candidate' && interview.candidate && (
          <div className="flex items-center gap-2 text-text-secondary">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              {interview.candidate.first_name} {interview.candidate.last_name}
            </span>
          </div>
        )}

        {profile?.role === 'candidate' && interview.recruiter && (
          <div className="flex items-center gap-2 text-text-secondary">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              Interviewer: {interview.recruiter.first_name} {interview.recruiter.last_name}
            </span>
          </div>
        )}

        {interview.job_position?.company && (
          <div className="text-sm text-text-secondary">
            Company: {interview.job_position.company.name}
          </div>
        )}

        {interview.overall_score !== null && (
          <div className="text-sm text-text-secondary">
            Score: {interview.overall_score}/100
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-border-dark pt-4 bg-dark-primary/30">
        <div className="flex gap-2 w-full">
          {interview.meeting_url && (interview.status === 'scheduled' || interview.status === 'in_progress') && (
            <Button 
              size="sm" 
              className="bg-tech-green hover:bg-tech-green/90 text-dark-primary flex-1"
              onClick={() => window.open(interview.meeting_url!, '_blank')}
            >
              <VideoIcon className="h-4 w-4 mr-2" />
              Join Interview
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant={interview.status === 'completed' ? 'outline' : 'default'}
            className={interview.status === 'completed' 
              ? "border-border-dark text-text-secondary hover:text-text-primary flex-1" 
              : "bg-tech-green hover:bg-tech-green/90 text-dark-primary flex-1"}
            onClick={() => navigate(`/interview-room?id=${interview.id}`)}
          >
            {interview.status === 'completed' ? 'View Details' : 'Join Now'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Top Navigation Bar */}
      <header className="bg-dark-secondary border-b border-border-dark sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-tech-green rounded-lg flex items-center justify-center">
                <Code className="h-5 w-5 text-dark-primary" />
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-tech-green" />
                <span className="text-xl font-bold text-text-primary hidden md:block">CodeSignal</span>
              </div>
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
                        ? 'bg-tech-green/10 text-tech-green'
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
                  placeholder="Search interviews..."
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
                      <AvatarFallback className="bg-tech-green/20 text-tech-green">
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
                        ? 'bg-tech-green/10 text-tech-green'
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
                  <AvatarFallback className="bg-tech-green/20 text-tech-green">
                    {profile?.first_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-text-primary font-medium">{profile?.first_name || ''} {profile?.last_name || ''}</p>
                  <p className="text-text-secondary text-sm">{profile?.role === 'recruiter' ? 'Recruiter' : 'Candidate'}</p>
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
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              {profile?.role === 'candidate' ? 'My Interviews' : 'Interview Management'}
            </h1>
            <p className="text-text-secondary">
              {profile?.role === 'candidate' 
                ? 'View your scheduled and completed interviews'
                : 'Manage interviews and track candidate progress'
              }
            </p>
          </div>
          
          {profile?.role === 'recruiter' && (
            <Button 
              className="bg-tech-green hover:bg-tech-green/90 text-dark-primary"
              onClick={() => navigate('/schedule')}
            >
              <Plus size={16} className="mr-2" />
              Schedule Interview
            </Button>
          )}
        </div>

        {/* Filter and Search - Mobile */}
        <div className="md:hidden flex items-center gap-3 mb-6">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-dark-primary border-border-dark text-text-primary"
            />
          </form>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-border-dark text-text-secondary">
                <Filter size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-dark-secondary border-border-dark">
              <DropdownMenuItem 
                onClick={() => setFilter('all')}
                className={`cursor-pointer ${filter === 'all' ? 'text-tech-green' : 'text-text-secondary'}`}
              >
                All Interviews
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilter('scheduled')}
                className={`cursor-pointer ${filter === 'scheduled' ? 'text-tech-green' : 'text-text-secondary'}`}
              >
                Scheduled
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilter('completed')}
                className={`cursor-pointer ${filter === 'completed' ? 'text-tech-green' : 'text-text-secondary'}`}
              >
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filter Tabs - Desktop */}
        <div className="hidden md:flex gap-4 mb-6">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className={filter === 'all' ? 'bg-tech-green text-dark-primary' : 'border-border-dark text-text-secondary'}
          >
            All Interviews
          </Button>
          <Button
            onClick={() => setFilter('scheduled')}
            variant={filter === 'scheduled' ? 'default' : 'outline'}
            className={filter === 'scheduled' ? 'bg-tech-green text-dark-primary' : 'border-border-dark text-text-secondary'}
          >
            Scheduled
          </Button>
          <Button
            onClick={() => setFilter('completed')}
            variant={filter === 'completed' ? 'default' : 'outline'}
            className={filter === 'completed' ? 'bg-tech-green text-dark-primary' : 'border-border-dark text-text-secondary'}
          >
            Completed
          </Button>
        </div>

        {filteredInterviews.length === 0 ? (
          <Card className="bg-dark-secondary border-border-dark">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-text-secondary mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">No interviews found</h3>
              <p className="text-text-secondary text-center mb-6">
                {filter === 'all' 
                  ? 'No interviews scheduled yet'
                  : `No ${filter} interviews found`
                }
              </p>
              {profile?.role === 'recruiter' && (
                <Button 
                  className="bg-tech-green hover:bg-tech-green/90 text-dark-primary"
                  onClick={() => navigate('/schedule')}
                >
                  <Plus size={16} className="mr-2" />
                  Schedule Interview
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {filter === 'all' && (
              <>
                {/* Scheduled Interviews Section */}
                {filteredInterviews.filter(i => i.status === 'scheduled').length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-text-primary">Scheduled Interviews</h2>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        {filteredInterviews.filter(i => i.status === 'scheduled').length}
                      </Badge>
                    </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredInterviews
                        .filter(i => i.status === 'scheduled')
                        .map(interview => renderInterviewCard(interview))}
                    </div>
                    </div>
                  )}
                  
                {/* In Progress Interviews Section */}
                {filteredInterviews.filter(i => i.status === 'in_progress').length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-text-primary">In Progress Interviews</h2>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        {filteredInterviews.filter(i => i.status === 'in_progress').length}
                      </Badge>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredInterviews
                        .filter(i => i.status === 'in_progress')
                        .map(interview => renderInterviewCard(interview))}
                    </div>
                    </div>
                  )}

                {/* Completed Interviews Section */}
                {filteredInterviews.filter(i => i.status === 'completed').length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-text-primary">Completed Interviews</h2>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        {filteredInterviews.filter(i => i.status === 'completed').length}
                      </Badge>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredInterviews
                        .filter(i => i.status === 'completed')
                        .map(interview => renderInterviewCard(interview))}
                    </div>
                    </div>
                )}
              </>
            )}
            
            {filter !== 'all' && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredInterviews.map(interview => renderInterviewCard(interview))}
                    </div>
                  )}
          </>
        )}
      </main>
    </div>
  );
};

export default Interviews;
