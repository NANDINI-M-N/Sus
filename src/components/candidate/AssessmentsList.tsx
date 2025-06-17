import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssessmentsList = () => {
  const navigate = useNavigate();
  
  const assessments = [
    {
      id: 1,
      name: 'Data Structures & Algorithms',
      difficulty: 'Expert',
      duration: '90 min',
      status: 'available',
      badgeColor: 'bg-red-500'
    },
    {
      id: 2,
      name: 'System Design Basics',
      difficulty: 'Advanced',
      duration: '75 min',
      status: 'locked',
      badgeColor: 'bg-orange-500'
    }
  ];

  const handleStartAssessment = (id: number) => {
    navigate(`/assessments/${id}`);
  };

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <Card key={assessment.id} className="bg-dark-secondary border-border-dark">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-text-primary">{assessment.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${assessment.badgeColor} text-xs`}>
                    {assessment.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Clock className="h-3 w-3" />
                    <span>{assessment.duration}</span>
                  </div>
                </div>
              </div>
              
              {assessment.status === 'available' ? (
                <Button 
                  className="bg-tech-green hover:bg-tech-green/90 text-dark-primary"
                  onClick={() => handleStartAssessment(assessment.id)}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </Button>
              ) : (
                <Button 
                  className="bg-gray-700 text-gray-400 cursor-not-allowed"
                  disabled
                >
                  Locked
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AssessmentsList; 