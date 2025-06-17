
import { useState } from 'react';
import { 
  MoreHorizontal, 
  Star, 
  Eye, 
  Calendar, 
  MessageSquare, 
  FileText,
  ArrowUpDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Candidate } from '@/data/mockCandidates';

interface CandidateTableProps {
  candidates: Candidate[];
  selectedCandidates: string[];
  onSelectCandidate: (candidateId: string) => void;
  onSelectAll: () => void;
}

type SortField = 'name' | 'experienceLevel' | 'lastInterviewDate' | 'overallRating';
type SortDirection = 'asc' | 'desc';

export const CandidateTable = ({
  candidates,
  selectedCandidates,
  onSelectCandidate,
  onSelectAll
}: CandidateTableProps) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCandidates = [...candidates].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'lastInterviewDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="text-text-secondary" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp size={14} className="text-tech-green" /> : 
      <ChevronDown size={14} className="text-tech-green" />;
  };

  return (
    <div className="bg-dark-secondary rounded-lg border border-border-dark overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border-dark hover:bg-dark-primary/50">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedCandidates.length === candidates.length && candidates.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead className="text-text-secondary">
              <Button
                variant="ghost"
                onClick={() => handleSort('name')}
                className="p-0 h-auto text-text-secondary hover:text-text-primary"
              >
                Candidate
                <SortIcon field="name" />
              </Button>
            </TableHead>
            <TableHead className="text-text-secondary">Skills</TableHead>
            <TableHead className="text-text-secondary">
              <Button
                variant="ghost"
                onClick={() => handleSort('experienceLevel')}
                className="p-0 h-auto text-text-secondary hover:text-text-primary"
              >
                Experience
                <SortIcon field="experienceLevel" />
              </Button>
            </TableHead>
            <TableHead className="text-text-secondary">Availability</TableHead>
            <TableHead className="text-text-secondary">
              <Button
                variant="ghost"
                onClick={() => handleSort('lastInterviewDate')}
                className="p-0 h-auto text-text-secondary hover:text-text-primary"
              >
                Last Interview
                <SortIcon field="lastInterviewDate" />
              </Button>
            </TableHead>
            <TableHead className="text-text-secondary">
              <Button
                variant="ghost"
                onClick={() => handleSort('overallRating')}
                className="p-0 h-auto text-text-secondary hover:text-text-primary"
              >
                Rating
                <SortIcon field="overallRating" />
              </Button>
            </TableHead>
            <TableHead className="text-text-secondary w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCandidates.map((candidate) => (
            <TableRow 
              key={candidate.id} 
              className="border-border-dark hover:bg-dark-primary/50 transition-colors"
            >
              <TableCell>
                <Checkbox
                  checked={selectedCandidates.includes(candidate.id)}
                  onCheckedChange={() => onSelectCandidate(candidate.id)}
                />
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={candidate.profilePhoto} alt={candidate.name} />
                    <AvatarFallback className="bg-tech-green/20 text-tech-green">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-text-primary">{candidate.name}</div>
                    <div className="text-sm text-text-secondary">{candidate.email}</div>
                    <div className="text-sm text-text-secondary">{candidate.phone}</div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {candidate.skills.slice(0, 3).map((skill, index) => (
                    <Badge
                      key={index}
                      style={{ backgroundColor: skill.color + '20', color: skill.color }}
                      className="text-xs border-0"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{candidate.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <Badge className={getExperienceColor(candidate.experienceLevel)}>
                  {candidate.experienceLevel}
                </Badge>
              </TableCell>
              
              <TableCell>
                <Badge className={getAvailabilityColor(candidate.availability)}>
                  {candidate.availability}
                </Badge>
              </TableCell>
              
              <TableCell className="text-text-secondary">
                {new Date(candidate.lastInterviewDate).toLocaleDateString()}
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.floor(candidate.overallRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-text-secondary ml-1">
                    {candidate.overallRating}
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
