
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, X } from 'lucide-react';
import { skillsList, experienceLevels, locations, availabilities } from '@/data/mockCandidates';

interface CandidateFiltersProps {
  skillsFilter: string[];
  setSkillsFilter: (skills: string[]) => void;
  experienceFilter: string[];
  setExperienceFilter: (experience: string[]) => void;
  locationFilter: string[];
  setLocationFilter: (locations: string[]) => void;
  availabilityFilter: string[];
  setAvailabilityFilter: (availability: string[]) => void;
  ratingFilter: number | null;
  setRatingFilter: (rating: number | null) => void;
}

export const CandidateFilters = ({
  skillsFilter,
  setSkillsFilter,
  experienceFilter,
  setExperienceFilter,
  locationFilter,
  setLocationFilter,
  availabilityFilter,
  setAvailabilityFilter,
  ratingFilter,
  setRatingFilter
}: CandidateFiltersProps) => {
  const [skillsExpanded, setSkillsExpanded] = useState(false);

  const handleSkillToggle = (skill: string) => {
    setSkillsFilter(
      skillsFilter.includes(skill)
        ? skillsFilter.filter(s => s !== skill)
        : [...skillsFilter, skill]
    );
  };

  const handleExperienceToggle = (experience: string) => {
    setExperienceFilter(
      experienceFilter.includes(experience)
        ? experienceFilter.filter(e => e !== experience)
        : [...experienceFilter, experience]
    );
  };

  const handleLocationToggle = (location: string) => {
    setLocationFilter(
      locationFilter.includes(location)
        ? locationFilter.filter(l => l !== location)
        : [...locationFilter, location]
    );
  };

  const handleAvailabilityToggle = (availability: string) => {
    setAvailabilityFilter(
      availabilityFilter.includes(availability)
        ? availabilityFilter.filter(a => a !== availability)
        : [...availabilityFilter, availability]
    );
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-tech-green text-dark-primary';
      case 'interviewing': return 'bg-yellow-500 text-dark-primary';
      case 'unavailable': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'junior': return 'bg-blue-500 text-white';
      case 'mid': return 'bg-purple-500 text-white';
      case 'senior': return 'bg-orange-500 text-white';
      case 'lead': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
      </div>

      {/* Skills Filter */}
      <Card className="bg-dark-primary border-border-dark">
        <CardHeader className="pb-3">
          <CardTitle className="text-text-primary text-sm">Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {skillsList.slice(0, skillsExpanded ? skillsList.length : 8).map(skill => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={`skill-${skill}`}
                checked={skillsFilter.includes(skill)}
                onCheckedChange={() => handleSkillToggle(skill)}
              />
              <Label
                htmlFor={`skill-${skill}`}
                className="text-text-secondary text-sm cursor-pointer flex-1"
              >
                {skill}
              </Label>
            </div>
          ))}
          {skillsList.length > 8 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSkillsExpanded(!skillsExpanded)}
              className="text-tech-green hover:text-tech-green/80 p-0 h-auto"
            >
              {skillsExpanded ? 'Show Less' : `Show ${skillsList.length - 8} More`}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Experience Level Filter */}
      <Card className="bg-dark-primary border-border-dark">
        <CardHeader className="pb-3">
          <CardTitle className="text-text-primary text-sm">Experience Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {experienceLevels.map(level => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`experience-${level}`}
                checked={experienceFilter.includes(level)}
                onCheckedChange={() => handleExperienceToggle(level)}
              />
              <Label
                htmlFor={`experience-${level}`}
                className="text-text-secondary text-sm cursor-pointer flex-1 capitalize"
              >
                {level}
              </Label>
              <Badge className={getExperienceColor(level)}>
                {level}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Location Filter */}
      <Card className="bg-dark-primary border-border-dark">
        <CardHeader className="pb-3">
          <CardTitle className="text-text-primary text-sm">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {locations.map(location => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`location-${location}`}
                checked={locationFilter.includes(location)}
                onCheckedChange={() => handleLocationToggle(location)}
              />
              <Label
                htmlFor={`location-${location}`}
                className="text-text-secondary text-sm cursor-pointer flex-1"
              >
                {location}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Availability Filter */}
      <Card className="bg-dark-primary border-border-dark">
        <CardHeader className="pb-3">
          <CardTitle className="text-text-primary text-sm">Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {availabilities.map(availability => (
            <div key={availability} className="flex items-center space-x-2">
              <Checkbox
                id={`availability-${availability}`}
                checked={availabilityFilter.includes(availability)}
                onCheckedChange={() => handleAvailabilityToggle(availability)}
              />
              <Label
                htmlFor={`availability-${availability}`}
                className="text-text-secondary text-sm cursor-pointer flex-1 capitalize"
              >
                {availability}
              </Label>
              <Badge className={getAvailabilityColor(availability)}>
                {availability}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card className="bg-dark-primary border-border-dark">
        <CardHeader className="pb-3">
          <CardTitle className="text-text-primary text-sm">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={ratingFilter === rating}
                onCheckedChange={() => setRatingFilter(ratingFilter === rating ? null : rating)}
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="text-text-secondary text-sm cursor-pointer flex-1 flex items-center"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={`${
                      i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-2">& above</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
