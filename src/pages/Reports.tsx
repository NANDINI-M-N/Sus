import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Target,
  Share2,
  Filter,
  Plus,
  Home,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  Code,
  Download,
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import AnalyticsDashboard from '@/components/reports/AnalyticsDashboard';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Reports = () => {
  const { analytics, loading } = useAnalytics();
  const { profile } = useProfile();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeNav, setActiveNav] = useState('analytics');

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
      case 'dashboard':
        navigate(profile?.role === 'recruiter' ? '/recruiter-dashboard' : '/admin-dashboard');
        break;
      case 'interviews':
        navigate('/interviews');
        break;
      case 'candidates':
        navigate('/candidates');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        // Stay on analytics
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
      // In a real app, this would filter reports or analytics
    }
  };

  // Calculate trend percentages by comparing to previous periods
  const calculateTrend = (current: number, previous: number): { change: string, trend: 'up' | 'down' | 'neutral' } => {
    if (previous === 0) return { change: "N/A", trend: 'neutral' };
    
    const percentChange = ((current - previous) / previous) * 100;
    const trend = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral';
    return { 
      change: `${percentChange > 0 ? '+' : ''}${Math.round(percentChange)}%`, 
      trend 
    };
  };
  
  // Get previous period data for trends
  const getPreviousData = () => {
    if (!analytics || !analytics.monthlyTrends || analytics.monthlyTrends.length < 2) {
      return {
        interviews: 0,
        completionRate: 0,
        averageScore: 0,
        timeToHire: 0
      };
    }
    
    // Use data from the previous month
    const previousMonth = analytics.monthlyTrends[analytics.monthlyTrends.length - 2];
    return {
      interviews: previousMonth.scheduled || 0,
      completionRate: previousMonth.success_rate || 0,
      averageScore: analytics.averageScore,
      timeToHire: analytics.timeToHire
    };
  };
  
  const previousData = getPreviousData();
  
  // Calculate trends
  const interviewsTrend = calculateTrend(
    analytics?.totalInterviews || 0, 
    previousData.interviews
  );
  
  const completionRateTrend = calculateTrend(
    analytics?.completionRate || 0, 
    previousData.completionRate
  );
  
  const scoreTrend = calculateTrend(
    analytics?.averageScore || 0, 
    previousData.averageScore
  );
  
  const timeToHireTrend = calculateTrend(
    analytics?.timeToHire || 0, 
    previousData.timeToHire
  );
  
  const reportStats = [
    {
      title: "Total Interviews",
      value: analytics?.totalInterviews?.toString() || "0",
      change: interviewsTrend.change,
      trend: interviewsTrend.trend,
      icon: Users
    },
    {
      title: "Completion Rate",
      value: analytics ? `${analytics.completionRate}%` : "0%",
      change: completionRateTrend.change,
      trend: completionRateTrend.trend,
      icon: Target
    },
    {
      title: "Average Score",
      value: analytics ? `${analytics.averageScore}/10` : "0/10",
      change: scoreTrend.change,
      trend: scoreTrend.trend,
      icon: BarChart3
    },
    {
      title: "Time to Hire",
      value: analytics ? `${analytics.timeToHire} days` : "0 days",
      change: timeToHireTrend.change,
      trend: timeToHireTrend.trend,
      icon: Calendar
    }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

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
                  placeholder="Search analytics..."
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
                  <p className="text-text-secondary text-sm">{profile?.role === 'recruiter' ? 'Recruiter' : 'Admin'}</p>
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
              Reports & Analytics
            </h1>
            <p className="text-text-secondary">
              Comprehensive interview performance insights
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {!loading && (
              <>
                <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                  <Filter size={16} className="mr-2" />
                  Filters
                </Button>
                <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
                <Button className="bg-tech-green hover:bg-tech-green/90 text-dark-primary">
                  <Plus size={16} className="mr-2" />
                  New Report
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Search - Mobile */}
        <div className="md:hidden mb-6">
          <form onSubmit={handleSearch} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <Input
              type="text"
              placeholder="Search analytics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-dark-primary border-border-dark text-text-primary"
            />
          </form>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {loading ? (
            // Loading state for stats cards
            Array(4).fill(0).map((_, index) => (
              <Card key={index} className="bg-dark-secondary border-border-dark">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-full">
                      <div className="h-4 w-24 bg-dark-primary/50 rounded animate-pulse mb-3"></div>
                      <div className="h-8 w-16 bg-dark-primary/50 rounded animate-pulse mb-3"></div>
                      <div className="h-4 w-20 bg-dark-primary/50 rounded animate-pulse"></div>
                    </div>
                    <div className="h-8 w-8 bg-dark-primary/50 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            reportStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-dark-secondary border-border-dark hover:border-tech-green/30 transition-all duration-300 group overflow-hidden relative"
                >
                  <div className={`absolute inset-0 bg-tech-green opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text-secondary">{stat.title}</p>
                        <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                        <p className={`text-sm mt-1 ${
                          stat.trend === 'up' ? 'text-tech-green' : 
                          stat.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                        }`}>
                          {stat.change}
                        </p>
                      </div>
                      <div className="bg-tech-green/10 text-tech-green w-10 h-10 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Report Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {!loading && (
            <>
              <Card 
                className="bg-dark-secondary border-border-dark hover:border-tech-green/30 transition-all duration-300 cursor-pointer group overflow-hidden relative"
                onClick={() => toast({ title: "Feature coming soon", description: "This feature is under development" })}
              >
                <div className="absolute inset-0 bg-tech-green opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                      <BarChart3 size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-text-primary">Custom Reports</span>
                  </div>
                  <ChevronRight size={18} className="text-text-secondary group-hover:text-tech-green group-hover:translate-x-1 transition-all duration-300" />
                </CardContent>
              </Card>

              <Card 
                className="bg-dark-secondary border-border-dark hover:border-tech-green/30 transition-all duration-300 cursor-pointer group overflow-hidden relative"
                onClick={() => toast({ title: "Feature coming soon", description: "This feature is under development" })}
              >
                <div className="absolute inset-0 bg-tech-green opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                      <Share2 size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-text-primary">Share Reports</span>
                  </div>
                  <ChevronRight size={18} className="text-text-secondary group-hover:text-tech-green group-hover:translate-x-1 transition-all duration-300" />
                </CardContent>
              </Card>

              <Card 
                className="bg-dark-secondary border-border-dark hover:border-tech-green/30 transition-all duration-300 cursor-pointer group overflow-hidden relative"
                onClick={() => toast({ title: "Feature coming soon", description: "This feature is under development" })}
              >
                <div className="absolute inset-0 bg-tech-green opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-tech-green w-10 h-10 rounded-lg flex items-center justify-center">
                      <Download size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-text-primary">Download Data</span>
                  </div>
                  <ChevronRight size={18} className="text-text-secondary group-hover:text-tech-green group-hover:translate-x-1 transition-all duration-300" />
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Analytics Dashboard */}
        {loading ? (
          <div className="space-y-6">
            <div className="h-96 bg-dark-secondary border-border-dark rounded-md animate-pulse" />
          </div>
        ) : (
          <div className="space-y-6">
            <AnalyticsDashboard />
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;
