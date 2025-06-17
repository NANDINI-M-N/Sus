import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Code, LogOut, User, ChevronDown, Leaf } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutNotification from "@/components/notifications/LogoutNotification";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowLogoutNotification(true);
    navigate('/', { state: { justLoggedOut: true } });
  };

  const getDashboardLink = () => {
    if (!profile) return '/candidate-dashboard';
    
    switch (profile.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'recruiter':
        return '/recruiter-dashboard';
      case 'candidate':
        return '/candidate-dashboard';
      default:
        return '/candidate-dashboard';
    }
  };
  
  // Check if we're on the homepage
  const isHomepage = location.pathname === '/';

  return (
    <header 
      className={`border-b backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-primary/95 border-border-dark shadow-lg shadow-black/10' 
          : isHomepage 
            ? 'bg-transparent border-transparent' 
            : 'bg-dark-primary/90 border-border-dark'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
              isScrolled || !isHomepage 
                ? 'bg-green-gradient' 
                : 'bg-dark-secondary border border-border-dark group-hover:bg-green-gradient'
            }`}>
              <Leaf className={`h-5 w-5 ${
                isScrolled || !isHomepage ? 'text-white' : 'text-emerald-green group-hover:text-white'
              }`} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">CodeGreen</span>
              <span className="text-xs text-text-secondary -mt-1">Technical Interviews</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/#features" 
              className="px-4 py-2 text-text-secondary hover:text-emerald-green transition-colors relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link 
              to="/#pricing" 
              className="px-4 py-2 text-text-secondary hover:text-emerald-green transition-colors relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 text-text-secondary hover:text-emerald-green transition-colors flex items-center">
                  Resources
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-dark-secondary border-border-dark w-56">
                <DropdownMenuItem className="text-text-secondary hover:text-white hover:bg-border-dark">
                  Documentation
                </DropdownMenuItem>
                <DropdownMenuItem className="text-text-secondary hover:text-white hover:bg-border-dark">
                  Blog
                </DropdownMenuItem>
                <DropdownMenuItem className="text-text-secondary hover:text-white hover:bg-border-dark">
                  Case Studies
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link 
              to="/#about" 
              className="px-4 py-2 text-text-secondary hover:text-emerald-green transition-colors relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4 pl-4">
                <Button
                  asChild
                  variant="outline"
                  className="border-emerald-green border-2 text-emerald-green hover:bg-emerald-green hover:text-dark-primary font-medium shadow-lg shadow-emerald-green/10"
                >
                  <Link to={getDashboardLink()}>Dashboard</Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white hover:bg-border-dark hover:text-emerald-green rounded-full h-9 w-9 p-0"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-dark-secondary border-border-dark">
                    <DropdownMenuLabel className="text-white">
                      {profile?.first_name} {profile?.last_name}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel className="text-text-secondary text-xs font-normal">
                      {profile?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border-dark" />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="text-text-secondary hover:text-white cursor-pointer hover:bg-border-dark"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-4">
                <Button
                  asChild
                  variant="ghost"
                  className="text-white hover:text-emerald-green"
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-green-gradient hover:opacity-90 text-white font-medium shadow-lg shadow-emerald-green/20"
                >
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-emerald-green"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-dark animate-in slide-in-from-top">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/#features" 
                className="text-text-secondary hover:text-emerald-green transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/#pricing" 
                className="text-text-secondary hover:text-emerald-green transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/#resources" 
                className="text-text-secondary hover:text-emerald-green transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link 
                to="/#about" 
                className="text-text-secondary hover:text-emerald-green transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-border-dark">
                  <Button
                    asChild
                    variant="outline"
                    className="border-emerald-green border-2 text-emerald-green hover:bg-emerald-green hover:text-dark-primary justify-start font-medium"
                  >
                    <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className="text-white hover:text-emerald-green justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-border-dark">
                  <Button
                    asChild
                    className="bg-green-gradient hover:opacity-90 text-dark-primary justify-start font-medium"
                  >
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-emerald-green text-emerald-green hover:bg-emerald-green hover:text-dark-primary justify-start"
                  >
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Logout Notification */}
      {showLogoutNotification && (
        <LogoutNotification 
          onClose={() => setShowLogoutNotification(false)}
        />
      )}
    </header>
  );
};

export default Header;
