import React from 'react';
import { Outlet } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

interface NavLayoutProps {
  children?: React.ReactNode;
}

const NavLayout: React.FC<NavLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-full bg-gray-900 flex">
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:block h-full">
        <DesktopNav />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MobileNav />
            <span className="text-white text-lg font-semibold">Hacerank</span>
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