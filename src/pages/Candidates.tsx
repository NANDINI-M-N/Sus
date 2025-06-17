
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Mail, Phone, Calendar } from "lucide-react";
import { useCandidates } from "@/hooks/useCandidates";
import PageLoader from "@/components/loading/PageLoader";
import { BulkActions } from "@/components/candidates/BulkActions";
import ScheduleInterviewModal from "@/components/ScheduleInterviewModal";
import { format } from "date-fns";
import BackButton from "@/components/ui/back-button";
import { useProfile } from "@/hooks/useProfile";

const Candidates = () => {
  const { candidates, loading } = useCandidates();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCandidateForScheduling, setSelectedCandidateForScheduling] = useState<any>(null);
  
  // Determine the back destination based on user role
  const getBackDestination = () => {
    if (profile?.role === 'recruiter') {
      return '/recruiter-dashboard';
    } else if (profile?.role === 'admin') {
      return '/admin-dashboard';
    } else {
      return '/';
    }
  };

  if (loading) {
    return <PageLoader text="Loading candidates..." />;
  }

  const filteredCandidates = candidates.filter(candidate => {
    const fullName = `${candidate.first_name || ''} ${candidate.last_name || ''}`.toLowerCase();
    const email = candidate.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || email.includes(search);
  });

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'C';
  };

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedCandidates([]);
  };

  const handleScheduleIndividual = (candidate: any) => {
    setSelectedCandidateForScheduling({
      id: candidate.id,
      name: `${candidate.first_name} ${candidate.last_name}`,
      email: candidate.email,
      position: 'Candidate',
      avatar: candidate.avatar_url || ''
    });
    setShowScheduleModal(true);
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <BackButton 
            to={getBackDestination()}
            label="Back to Dashboard" 
            className="text-text-secondary hover:text-text-primary"
          />
          <div className="h-6 w-px bg-border-dark"></div>
          <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Candidates</h1>
          <p className="text-text-secondary">
            Manage and review candidate profiles
          </p>
          </div>
        </div>

        {/* Search and Bulk Actions */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-dark-secondary border-border-dark text-text-primary"
              />
            </div>
            
            {filteredCandidates.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-border-dark data-[state=checked]:bg-tech-green data-[state=checked]:border-tech-green"
                />
                <span className="text-text-secondary text-sm">
                  Select All ({filteredCandidates.length})
                </span>
              </div>
            )}
          </div>
          
          {selectedCandidates.length > 0 && (
            <BulkActions 
              selectedCount={selectedCandidates.length}
              selectedCandidateIds={selectedCandidates}
              onClearSelection={handleClearSelection}
            />
          )}
        </div>

        {filteredCandidates.length === 0 ? (
          <Card className="bg-dark-secondary border-border-dark">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-text-secondary mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {searchTerm ? 'No candidates found' : 'No candidates registered'}
              </h3>
              <p className="text-text-secondary text-center">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Candidates will appear here once they register'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className={`bg-dark-secondary border-border-dark hover:border-tech-green/50 transition-colors ${
                selectedCandidates.includes(candidate.id) ? 'ring-2 ring-tech-green' : ''
              }`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={() => handleSelectCandidate(candidate.id)}
                      className="border-border-dark data-[state=checked]:bg-tech-green data-[state=checked]:border-tech-green"
                    />
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidate.avatar_url || undefined} />
                      <AvatarFallback className="bg-tech-green text-dark-primary">
                        {getInitials(candidate.first_name, candidate.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-text-primary text-lg">
                        {candidate.first_name} {candidate.last_name}
                      </CardTitle>
                      <Badge variant="outline" className="border-tech-green text-tech-green mt-1">
                        Candidate
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm truncate">{candidate.email}</span>
                  </div>
                  
                  {candidate.phone && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{candidate.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Joined {format(new Date(candidate.created_at), 'PP')}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleScheduleIndividual(candidate)}
                      className="bg-tech-green hover:bg-tech-green/90 text-dark-primary"
                    >
                      Schedule Interview
                    </Button>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Individual Schedule Interview Modal */}
        {showScheduleModal && selectedCandidateForScheduling && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-secondary rounded-lg border border-border-dark w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Schedule Interview - {selectedCandidateForScheduling.name}
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setShowScheduleModal(false);
                      setSelectedCandidateForScheduling(null);
                    }}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    ×
                  </Button>
                </div>
                <ScheduleInterviewModal 
                  onClose={() => {
                    setShowScheduleModal(false);
                    setSelectedCandidateForScheduling(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
