import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Edit, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProblemStatementInputProps {
  onProblemStatementChange: (statement: string) => void;
  onRoleLevelChange: (level: string) => void;
  initialProblemStatement?: string;
  initialRoleLevel?: string;
}

const ProblemStatementInput: React.FC<ProblemStatementInputProps> = ({
  onProblemStatementChange,
  onRoleLevelChange,
  initialProblemStatement = '',
  initialRoleLevel = 'mid-level'
}) => {
  const [isEditing, setIsEditing] = useState(!initialProblemStatement);
  const [problemStatement, setProblemStatement] = useState(initialProblemStatement);
  const [roleLevel, setRoleLevel] = useState(initialRoleLevel);

  const handleSave = () => {
    onProblemStatementChange(problemStatement);
    onRoleLevelChange(roleLevel);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProblemStatement(initialProblemStatement);
    setRoleLevel(initialRoleLevel);
    setIsEditing(false);
  };

  return (
    <Card className="bg-dark-secondary border-border-dark">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-border-dark">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-tech-green" />
          <CardTitle className="text-white text-sm">Problem Statement</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-text-secondary hover:text-white"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-text-secondary hover:text-white"
                onClick={handleCancel}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-8 px-2 bg-tech-green hover:bg-tech-green/80 text-dark-primary"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isEditing ? (
          <div className="p-4 space-y-4">
            <Textarea
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="Enter the problem statement or coding challenge description here..."
              className="min-h-[120px] bg-dark-primary border-border-dark text-white"
            />
            <div className="flex items-center space-x-2">
              <span className="text-text-secondary text-sm">Role Level:</span>
              <Select value={roleLevel} onValueChange={setRoleLevel}>
                <SelectTrigger className="w-32 bg-dark-primary border-border-dark text-white h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-secondary border-border-dark">
                  <SelectItem value="junior" className="text-white hover:bg-dark-primary">Junior</SelectItem>
                  <SelectItem value="mid-level" className="text-white hover:bg-dark-primary">Mid-level</SelectItem>
                  <SelectItem value="senior" className="text-white hover:bg-dark-primary">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-2 flex items-center space-x-2">
              <Badge variant="outline" className="text-tech-green border-tech-green">
                {roleLevel.charAt(0).toUpperCase() + roleLevel.slice(1)} Role
              </Badge>
            </div>
            <ScrollArea className="h-[120px]">
              {problemStatement ? (
                <p className="text-white text-sm whitespace-pre-wrap">{problemStatement}</p>
              ) : (
                <p className="text-text-secondary text-sm italic">
                  No problem statement provided. Click edit to add one.
                </p>
              )}
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProblemStatementInput; 