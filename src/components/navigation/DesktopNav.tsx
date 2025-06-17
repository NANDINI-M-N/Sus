import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Code, 
  Video, 
  MessageSquare, 
  Brain,
  FileText,
  Search,
  User,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/hooks/useProfile';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md w-full justify-start relative",
        isActive 
          ? "bg-emerald-green/10 text-emerald-green font-medium before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-emerald-green before:rounded-r-md after:absolute after:right-0 after:top-0 after:bottom-0 after:w-1 after:bg-emerald-green/30 after:rounded-l-md" 
          : "text-gray-300 hover:text-white hover:bg-gray-900 hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:bottom-0 hover:before:w-1 hover:before:bg-emerald-green/30 hover:before:rounded-r-md"
      )}
      onClick={onClick}
    >
      <Icon className={cn(
        "h-5 w-5 transition-transform",
        isActive && "transform scale-110"
      )} />
      <span>{label}</span>
    </Button>
  );
};

const DesktopNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useProfile();
  
  const mainNavItems = [
    { label: 'Dashboard', icon: Home, path: '/recruiter-dashboard' },
    { label: 'Candidates', icon: Users, path: '/candidates' },
    { label: 'Interviews', icon: Calendar, path: '/interviews' },
    { label: 'Reports', icon: BarChart3, path: '/reports' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];
  
  const interviewNavItems = [
    { label: 'Video Call', icon: Video, path: '/interview-room/video' },
    { label: 'Code Editor', icon: Code, path: '/interview-room/code' },
    { label: 'Chat', icon: MessageSquare, path: '/interview-room/chat' },
    { label: 'AI Analysis', icon: Brain, path: '/interview-room/analysis' },
    { label: 'Problem Statement', icon: FileText, path: '/interview-room/problem' },
  ];
  
  const isInterviewRoom = location.pathname.includes('interview-room');
  
  // Check if path is active, including partial matches for nested routes
  const isPathActive = (path: string) => {
    if (path === '/recruiter-dashboard' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path);
  };
  
  const getInitials = () => {
    if (!profile) return '';
    const first = profile.first_name?.charAt(0) || '';
    const last = profile.last_name?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || profile.email.charAt(0).toUpperCase();
  };
  
  return (
    <div className="h-full w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Logo and App Name */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-emerald-green flex items-center justify-center text-gray-900 font-bold">
          H
        </div>
        <span className="text-white text-lg font-semibold">Hacerank</span>
      </div>
      
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search..." 
            className="pl-8 bg-gray-900 border-gray-700 text-white"
          />
        </div>
      </div>
      
      {/* Navigation Items */}
      <div className="p-4 flex-1 overflow-auto">
        {!isInterviewRoom ? (
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={isPathActive(item.path)}
                onClick={() => navigate(item.path)}
              />
            ))}
          </nav>
        ) : (
          <>
            <h4 className="text-gray-400 text-xs uppercase font-medium mb-2 px-2">Interview Tools</h4>
            <nav className="space-y-1">
              {interviewNavItems.map((item) => (
                <NavItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isActive={isPathActive(item.path)}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </nav>
          </>
        )}
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-emerald-green animate-spin" />
          </div>
        ) : (
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/profile')}>
            <Avatar>
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-emerald-green text-gray-900">{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white text-sm font-medium">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-gray-400 text-xs">
                {profile?.role.charAt(0).toUpperCase() + profile?.role.slice(1)}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Settings */}
      <div className="p-4 border-t border-gray-700">
        <NavItem
          icon={Settings}
          label="Settings"
          path="/settings"
          isActive={isPathActive('/settings')}
          onClick={() => navigate('/settings')}
        />
      </div>
    </div>
  );
};

export default DesktopNav; 