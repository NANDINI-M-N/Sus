import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, User, FileText, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [completionItems, setCompletionItems] = useState([
    { name: 'Personal Information', completed: false, icon: User, path: '/profile?section=personal' },
    { name: 'Resume Upload', completed: false, icon: FileText, path: '/profile?section=resume' },
    { name: 'Skills Assessment', completed: false, icon: Award, path: '/assessments' },
    { name: 'Work Experience', completed: false, icon: User, path: '/profile?section=experience' },
    { name: 'Education Details', completed: false, icon: Award, path: '/profile?section=education' },
    { name: 'Portfolio Projects', completed: false, icon: FileText, path: '/profile?section=projects' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchProfileCompletionData();
    }
  }, [profile]);

  const fetchProfileCompletionData = async () => {
    setLoading(true);
    try {
      // Fetch profile data to determine completion status
      const updatedItems = [...completionItems];
      
      // Personal information is completed if first_name and last_name are set
      updatedItems[0].completed = !!(profile?.first_name && profile?.last_name);
      
      // Check if resume is uploaded (can be expanded based on your DB structure)
      if (profile?.id) {
        const { data: resumeData } = await supabase
          .from('profiles')
          .select('resume_url')
          .eq('id', profile.id)
          .single();
          
        updatedItems[1].completed = !!resumeData?.resume_url;
      }
      
      // Check if skills assessment is completed
      if (profile?.id) {
        const { data: assessmentData, error } = await supabase
          .from('assessment_submissions')
          .select('id')
          .eq('candidate_id', profile.id)
          .limit(1);
          
        updatedItems[2].completed = assessmentData && assessmentData.length > 0;
      }
      
      // Check work experience
      if (profile?.id) {
        const { data: experienceData } = await supabase
          .from('profiles')
          .select('experience_years')
          .eq('id', profile.id)
          .single();
          
        updatedItems[3].completed = experienceData?.experience_years !== null && 
                                   experienceData?.experience_years !== undefined;
      }
      
      // For education and portfolio, you would need to check related tables
      // This is a placeholder implementation
      updatedItems[4].completed = false;
      updatedItems[5].completed = false;
      
      setCompletionItems(updatedItems);
    } catch (error) {
      console.error('Error fetching profile completion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = completionItems.filter(item => item.completed).length;
  const completionPercentage = Math.round((completedCount / completionItems.length) * 100);

  return (
    <Card className="bg-dark-secondary border-border-dark">
      <CardHeader>
        <CardTitle className="text-lg text-text-primary flex items-center gap-2">
          <User className="h-5 w-5 text-tech-green" />
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-tech-green">{completionPercentage}%</p>
            <p className="text-sm text-text-secondary">{completedCount} of {completionItems.length} completed</p>
          </div>
          <div className="w-24 h-24">
            <Progress value={completionPercentage} className="h-2 w-full" />
          </div>
        </div>

        <Alert className="bg-dark-primary border-border-dark">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-text-secondary">
            Complete your profile to increase your chances of getting hired by 3x!
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {completionItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-dark-primary">
              <div className={`p-2 rounded-full ${item.completed ? 'bg-tech-green' : 'bg-gray-600'}`}>
                {item.completed ? (
                  <CheckCircle className="h-4 w-4 text-dark-primary" />
                ) : (
                  <item.icon className="h-4 w-4 text-text-secondary" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${item.completed ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {item.name}
                </p>
              </div>
              {!item.completed && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs border-border-dark text-tech-green hover:bg-tech-green hover:text-dark-primary"
                  onClick={() => navigate(item.path)}
                >
                  Complete
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletion;
