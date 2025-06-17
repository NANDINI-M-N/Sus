import React from 'react';
import { Outlet } from 'react-router-dom';
import NavLayout from '@/components/navigation/NavLayout';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InterviewLayout: React.FC = () => {
  const navigate = useNavigate();
  
  const handleEndInterview = () => {
    // In a real app, we would save the interview data before navigating away
    navigate('/interviews');
  };
  
  return (
    <NavLayout>
      <div className="flex flex-col h-full">
        {/* Interview Header */}
        <header className="bg-dark-secondary border-b border-border-dark px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-white font-semibold text-lg">Senior Frontend Developer Interview</h1>
            <p className="text-text-secondary text-sm">Sarah Chen</p>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm" 
            className="bg-red-600 hover:bg-red-700"
            onClick={handleEndInterview}
          >
            <LogOut className="w-4 h-4 mr-2" />
            End Interview
          </Button>
        </header>
        
        {/* Interview Content */}
        <div className="flex-1 overflow-auto bg-dark-primary">
          <Outlet />
        </div>
      </div>
    </NavLayout>
  );
};

export default InterviewLayout; 