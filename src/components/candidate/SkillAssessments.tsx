import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, Clock, CheckCircle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SkillAssessments = () => {
  const navigate = useNavigate();
  
  const assessments = [
    {
      id: 1,
      name: 'JavaScript Fundamentals',
      difficulty: 'Intermediate',
      duration: '45 min',
      status: 'completed',
      score: 85,
      maxScore: 100,
      completedDate: '2024-06-10',
      badgeEarned: 'JS Expert'
    },
    {
      id: 2,
      name: 'React Advanced Concepts',
      difficulty: 'Advanced',
      duration: '60 min',
      status: 'completed',
      score: 78,
      maxScore: 100,
      completedDate: '2024-06-08',
      badgeEarned: 'React Pro'
    },
    {
      id: 3,
      name: 'Data Structures & Algorithms',
      difficulty: 'Expert',
      duration: '90 min',
      status: 'available',
      score: 0,
      maxScore: 100,
      completedDate: null,
      badgeEarned: null
    },
    {
      id: 4,
      name: 'System Design Basics',
      difficulty: 'Advanced',
      duration: '75 min',
      status: 'locked',
      score: 0,
      maxScore: 100,
      completedDate: null,
      badgeEarned: null
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-tech-green';
      case 'available': return 'text-blue-500';
      case 'locked': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-tech-green';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const handleStartAssessment = (id: number) => {
    navigate(`/assessments/${id}`);
  };

  return (
    <Card className="bg-dark-secondary border-border-dark">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-text-primary flex items-center gap-2">
          <Award className="h-5 w-5 text-tech-green" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          className="w-full justify-start bg-tech-green hover:bg-tech-green/90 text-dark-primary"
          onClick={() => navigate('/profile')}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Complete Profile
        </Button>
        
        <Button 
          className="w-full justify-start bg-white/10 hover:bg-white/20 text-text-primary"
          onClick={() => navigate('/assessments')}
        >
          View All Assessments
        </Button>
        
        <Button 
          className="w-full justify-start bg-white/10 hover:bg-white/20 text-text-primary"
          onClick={() => navigate('/schedule')}
        >
          Schedule Interview
        </Button>
      </CardContent>
    </Card>
  );
};

export default SkillAssessments;
