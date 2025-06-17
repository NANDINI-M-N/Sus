import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Clock, FileText, Users, Star, Edit, Copy, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  duration_minutes: number;
  questions_count: number;
  sections: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  usage_count: number;
  rating: number;
  last_used_at: string | null;
  is_public: boolean;
}

const InterviewTemplates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTemplates: 0,
    totalUsage: 0,
    avgRating: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interview_templates')
        .select('*');

      if (error) {
        throw error;
      }

      // Process templates data
      const processedTemplates = data.map(template => ({
        id: template.id,
        name: template.name,
        duration_minutes: template.duration_minutes || 60,
        questions_count: template.questions_count || 0,
        sections: template.sections || [],
        difficulty: template.difficulty || 'Intermediate',
        usage_count: template.usage_count || 0,
        rating: template.rating || 0,
        last_used_at: template.last_used_at,
        is_public: template.is_public || false
      }));

      setTemplates(processedTemplates);

      // Calculate stats
      if (processedTemplates.length > 0) {
        const totalUsage = processedTemplates.reduce((sum, template) => sum + template.usage_count, 0);
        const totalRating = processedTemplates.reduce((sum, template) => sum + template.rating, 0);
        const avgRating = totalRating / processedTemplates.length;

        setStats({
          totalTemplates: processedTemplates.length,
          totalUsage,
          avgRating: Math.round(avgRating * 10) / 10 // Round to 1 decimal place
        });
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load interview templates',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  const formatLastUsed = (dateString: string | null) => {
    if (!dateString) return 'Never used';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.sections.some(section => section.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Interview Templates</h2>
          <p className="text-text-secondary">Create and manage reusable interview formats</p>
        </div>
        <Button className="bg-tech-green hover:bg-tech-green/90 text-dark-primary">
          <Plus size={16} className="mr-2" />
          Create Template
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <Input
                type="text"
                placeholder="Search templates, sections, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-dark-primary border-border-dark text-text-primary"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                Difficulty
              </Button>
              <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                Duration
              </Button>
              <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                Usage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-tech-green animate-spin" />
        </div>
      ) : (
        <>
      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.length === 0 ? (
              <div className="lg:col-span-2 text-center py-12 text-text-secondary">
                {searchQuery ? 'No templates match your search' : 'No templates found. Create your first template!'}
              </div>
            ) : (
              filteredTemplates.map((template) => (
          <Card key={template.id} className="bg-dark-secondary border-border-dark hover:border-tech-green/30 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-text-primary mb-2">{template.name}</CardTitle>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                            {formatDuration(template.duration_minutes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={12} />
                            {template.questions_count} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                            {template.usage_count} uses
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                        {template.rating > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={12} fill="currentColor" />
                            <span className="text-xs">{template.rating.toFixed(1)}</span>
                  </div>
                        )}
                        {template.is_public && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                      Public
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <Badge className={`${getDifficultyColor(template.difficulty)} border text-xs mb-2`}>
                  {template.difficulty}
                </Badge>
                <div className="flex flex-wrap gap-2">
                  {template.sections.map((section, index) => (
                    <Badge key={index} className="bg-dark-primary text-text-secondary border-border-dark text-xs">
                      {section}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border-dark">
                <span className="text-xs text-text-secondary">
                        Last used {formatLastUsed(template.last_used_at)}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-text-secondary hover:text-text-primary">
                    <Edit size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-text-secondary hover:text-text-primary">
                    <Copy size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
              ))
            )}
      </div>

      {/* Template Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-dark-secondary border-border-dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-tech-green" />
              <div>
                    <p className="text-lg font-semibold text-text-primary">{stats.totalTemplates}</p>
                <p className="text-sm text-text-secondary">Total Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-secondary border-border-dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                    <p className="text-lg font-semibold text-text-primary">{stats.totalUsage}</p>
                <p className="text-sm text-text-secondary">Total Usage</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-secondary border-border-dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-400" />
              <div>
                    <p className="text-lg font-semibold text-text-primary">{stats.avgRating}</p>
                <p className="text-sm text-text-secondary">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        </>
      )}
    </div>
  );
};

export default InterviewTemplates;
