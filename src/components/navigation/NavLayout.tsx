import React from 'react';
import { Outlet } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { Code2 } from 'lucide-react';

interface NavLayoutProps {
  children?: React.ReactNode;
}

const NavLayout: React.FC<NavLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-full bg-dark-primary flex">
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:block h-full">
        <DesktopNav />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-dark-secondary border-b border-border-dark px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MobileNav />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-tech-green rounded-md flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-lg font-semibold">CodeSignal</span>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default NavLayout; 