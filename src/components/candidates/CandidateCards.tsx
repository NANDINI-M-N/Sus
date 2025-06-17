
import { 
  MoreHorizontal, 
  Star, 
  Eye, 
  Calendar, 
  MessageSquare, 
  FileText,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Candidate } from '@/data/mockCandidates';

interface CandidateCardsProps {
  candidates: Candidate[];
  selectedCandidates: string[];
  onSelectCandidate: (candidateId: string) => void;
}

export const CandidateCards = ({
  candidates,
  selectedCandidates,
  onSelectCandidate
}: CandidateCardsProps) => {
  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'junior': return 'bg-blue-500 text-white';
      case 'mid': return 'bg-purple-500 text-white';
      case 'senior': return 'bg-orange-500 text-white';
      case 'lead': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-tech-green text-dark-primary';
      case 'interviewing': return 'bg-yellow-500 text-dark-primary';
      case 'unavailable': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {candidates.map((candidate) => (
        <Card 
          key={candidate.id} 
          className="bg-dark-secondary border-border-dark hover:border-tech-green/30 transition-all duration-200 hover:shadow-lg hover:shadow-tech-green/10"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate.profilePhoto} alt={candidate.name} />
                    <AvatarFallback className="bg-tech-green/20 text-tech-green">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Checkbox
                    checked={selectedCandidates.includes(candidate.id)}
                    onCheckedChange={() => onSelectCandidate(candidate.id)}
                    className="absolute -top-1 -right-1 bg-dark-primary border-border-dark"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary truncate">
                    {candidate.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getExperienceColor(candidate.experienceLevel)}>
                      {candidate.experienceLevel}
                    </Badge>
                    <Badge className={getAvailabilityColor(candidate.availability)}>
                      {candidate.availability}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-dark-secondary border-border-dark"
                >
                  <DropdownMenuItem className="text-text-primary hover:bg-dark-primary">
                    <Eye size={14} className="mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-text-primary hover:bg-dark-primary">
                    <Calendar size={14} className="mr-2" />
                    Schedule Interview
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-text-primary hover:bg-dark-primary">
                    <MessageSquare size={14} className="mr-2" />
                    Send Message
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-text-primary hover:bg-dark-primary">
                    <FileText size={14} className="mr-2" />
                    Add Notes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Contact Information */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-text-secondary">
                <Mail size={14} className="mr-2 flex-shrink-0" />
                <span className="truncate">{candidate.email}</span>
              </div>
              <div className="flex items-center text-sm text-text-secondary">
                <Phone size={14} className="mr-2 flex-shrink-0" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center text-sm text-text-secondary">
                <MapPin size={14} className="mr-2 flex-shrink-0" />
                <span className="truncate">{candidate.location}</span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 4).map((skill, index) => (
                  <Badge
                    key={index}
                    style={{ backgroundColor: skill.color + '20', color: skill.color }}
                    className="text-xs border-0"
                  >
                    {skill.name}
                  </Badge>
                ))}
                {candidate.skills.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{candidate.skills.length - 4}
                  </Badge>
                )}
              </div>
            </div>

            {/* Performance & Rating */}
            <div className="flex items-center justify-between pt-2 border-t border-border-dark">
              <div>
                <div className="text-sm text-text-secondary">Overall Rating</div>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={`${
                          i < Math.floor(candidate.overallRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-text-primary font-medium">
                    {candidate.overallRating}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-text-secondary">Last Interview</div>
                <div className="text-sm text-text-primary mt-1">
                  {new Date(candidate.lastInterviewDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="text-center">
                <div className="text-xs text-text-secondary">Code Quality</div>
                <div className="text-sm font-medium text-tech-green">
                  {candidate.performanceMetrics.codeQuality}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-text-secondary">Technical</div>
                <div className="text-sm font-medium text-tech-green">
                  {candidate.performanceMetrics.technicalSkills}%
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button 
                size="sm" 
                className="flex-1 bg-tech-green hover:bg-tech-green/90 text-dark-primary"
              >
                <Eye size={14} className="mr-1" />
                View
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-border-dark text-text-secondary hover:text-text-primary"
              >
                <Calendar size={14} className="mr-1" />
                Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
