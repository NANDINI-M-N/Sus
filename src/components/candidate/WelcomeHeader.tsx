import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, TrendingUp } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

const WelcomeHeader = () => {
  const { profile } = useProfile();
  const achievements = [
    { name: 'Problem Solver', color: 'bg-tech-green' },
    { name: 'Code Quality', color: 'bg-blue-500' },
    { name: 'Fast Learner', color: 'bg-purple-500' }
  ];

  return (
    <Card className="bg-dark-secondary border-border-dark">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-tech-green rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-dark-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Welcome back, {profile?.first_name || 'Candidate'}!</h1>
              <p className="text-text-secondary mt-1">Ready for your next coding challenge?</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-tech-green" />
                  <span className="text-sm text-text-secondary">Performance Score: 85/100</span>
                </div>
                <div className="flex gap-2">
                  {achievements.map((achievement, index) => (
                    <Badge key={index} className={`${achievement.color} text-white text-xs`}>
                      {achievement.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeHeader;
