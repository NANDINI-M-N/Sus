import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Award, 
  User,
  LogOut,
  Bell,
  Code2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CandidateNavbar = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/candidate-dashboard' },
    { id: 'interviews', label: 'Interviews', icon: Calendar, path: '/schedule' },
    { id: 'assessments', label: 'Assessments', icon: Award, path: '/assessments' },
    { id: 'profile', label: 'My Profile', icon: User, path: '/profile' },
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-green/95 to-emerald-green/80 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-2 shadow-lg">
            <Code2 className="h-5 w-5 text-emerald-green" />
          </div>
          <span className="text-white font-bold text-lg">CodeSignal</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
              onClick={() => navigate(item.path)}
            >
              <item.icon size={16} />
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/20">
                <Avatar className="h-8 w-8 ring-2 ring-white">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-white text-emerald-green text-sm font-bold">
                    {profile?.first_name?.[0] || 'n'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-none shadow-lg rounded-xl mt-2" align="end">
              <DropdownMenuLabel className="text-gray-800 font-medium">
                {profile?.first_name} {profile?.last_name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem 
                className="text-gray-700 cursor-pointer hover:text-emerald-green hover:bg-gray-100 rounded-md my-1"
                onClick={() => navigate('/profile')}
              >
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem 
                className="text-gray-700 cursor-pointer hover:text-red-500 hover:bg-gray-100 rounded-md my-1"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default CandidateNavbar; 