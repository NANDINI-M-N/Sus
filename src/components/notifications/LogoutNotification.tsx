import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogoutNotificationProps {
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const LogoutNotification = ({ 
  onClose, 
  autoClose = true, 
  autoCloseTime = 5000 
}: LogoutNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-fade-in">
      <Card className="bg-dark-secondary border border-tech-green shadow-lg shadow-tech-green/10 w-80">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-tech-green/10 p-2">
                <CheckCircle className="h-5 w-5 text-tech-green" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-1">
                  Logged out
                </h4>
                <p className="text-xs text-text-secondary">
                  You have been successfully logged out
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-text-secondary hover:text-text-primary"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoutNotification; 