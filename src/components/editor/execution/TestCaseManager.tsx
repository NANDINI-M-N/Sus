import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, XCircle, Play, FilePlus, Minus } from 'lucide-react';
import { TestCase } from './CodeExecutor';

interface TestCaseManagerProps {
  onRunTests: (testCases: TestCase[]) => void;
}

export const TestCaseManager: React.FC<TestCaseManagerProps> = ({ onRunTests }) => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [editingCase, setEditingCase] = useState<TestCase | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Load test cases from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('editor_test_cases');
    if (saved) {
      try {
        setTestCases(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load test cases:', error);
      }
    }
  }, []);

  // Save test cases to localStorage
  useEffect(() => {
    localStorage.setItem('editor_test_cases', JSON.stringify(testCases));
  }, [testCases]);

  const createNewTestCase = () => {
    const newCase: TestCase = {
      id: `test_${Date.now()}`,
      name: `Test Case ${testCases.length + 1}`,
      input: '',
      expectedOutput: '',
      description: ''
    };
    setEditingCase(newCase);
    setIsCreating(true);
  };

  const saveTestCase = (testCase: TestCase) => {
    if (isCreating) {
      setTestCases(prev => [...prev, testCase]);
      setIsCreating(false);
    } else {
      setTestCases(prev => prev.map(tc => tc.id === testCase.id ? testCase : tc));
    }
    setEditingCase(null);
  };

  const deleteTestCase = (id: string) => {
    setTestCases(prev => prev.filter(tc => tc.id !== id));
  };

  const cancelEdit = () => {
    setEditingCase(null);
    setIsCreating(false);
  };

  const loadPresetTestCases = (preset: string) => {
    let presetCases: TestCase[] = [];
    
    switch (preset) {
      case 'hello-world':
        presetCases = [
          {
            id: 'hw1',
            name: 'Basic Hello World',
            input: '',
            expectedOutput: 'Hello World',
            description: 'Should output "Hello World"'
          }
        ];
        break;
      case 'arithmetic':
        presetCases = [
          {
            id: 'math1',
            name: 'Addition Test',
            input: '5\n3',
            expectedOutput: '8',
            description: 'Add two numbers'
          },
          {
            id: 'math2',
            name: 'Multiplication Test',
            input: '4\n6',
            expectedOutput: '24',
            description: 'Multiply two numbers'
          }
        ];
        break;
      case 'string-manipulation':
        presetCases = [
          {
            id: 'str1',
            name: 'Reverse String',
            input: 'hello',
            expectedOutput: 'olleh',
            description: 'Reverse the input string'
          },
          {
            id: 'str2',
            name: 'Uppercase',
            input: 'world',
            expectedOutput: 'WORLD',
            description: 'Convert to uppercase'
          }
        ];
        break;
    }
    
    setTestCases(prev => [...prev, ...presetCases]);
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Test Cases</h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={createNewTestCase}
            className="h-7 px-3 bg-tech-green hover:bg-tech-green/80"
          >
            <PlusCircle className="w-3 h-3 mr-1" />
            New Test
          </Button>
          {testCases.length > 0 && (
            <Button
              size="sm"
              onClick={() => onRunTests(testCases)}
              className="h-7 px-3 bg-blue-600 hover:bg-blue-600/80"
            >
              <Play className="w-3 h-3 mr-1" />
              Run All
            </Button>
          )}
        </div>
      </div>

      {/* Preset Test Cases */}
      <div className="mb-4">
        <Label className="text-text-secondary text-xs mb-2 block">Quick Start Templates:</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadPresetTestCases('hello-world')}
            className="h-6 px-2 text-xs border-border-dark text-text-secondary hover:bg-dark-primary"
          >
            Hello World
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadPresetTestCases('arithmetic')}
            className="h-6 px-2 text-xs border-border-dark text-text-secondary hover:bg-dark-primary"
          >
            Arithmetic
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadPresetTestCases('string-manipulation')}
            className="h-6 px-2 text-xs border-border-dark text-text-secondary hover:bg-dark-primary"
          >
            Strings
          </Button>
        </div>
      </div>

      <Separator className="bg-border-dark mb-4" />

      {/* Test Cases List */}
      <ScrollArea className="flex-1">
        {editingCase && (
          <TestCaseEditor
            testCase={editingCase}
            onSave={saveTestCase}
            onCancel={cancelEdit}
          />
        )}

        {testCases.length === 0 && !editingCase ? (
          <div className="flex flex-col items-center justify-center h-32 text-text-secondary">
            <FilePlus className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No test cases yet</p>
            <p className="text-xs">Create your first test case or use a template</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testCases.map((testCase, index) => (
              <TestCaseCard
                key={testCase.id}
                testCase={testCase}
                index={index}
                onEdit={setEditingCase}
                onDelete={deleteTestCase}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

interface TestCaseEditorProps {
  testCase: TestCase;
  onSave: (testCase: TestCase) => void;
  onCancel: () => void;
}

const TestCaseEditor: React.FC<TestCaseEditorProps> = ({ testCase, onSave, onCancel }) => {
  const [formData, setFormData] = useState<TestCase>(testCase);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.expectedOutput.trim()) {
      return;
    }
    onSave(formData);
  };

  return (
    <Card className="mb-4 bg-dark-primary border-tech-green/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-white">
          {testCase.id.startsWith('test_') ? 'New Test Case' : 'Edit Test Case'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs text-text-secondary">Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 bg-dark-secondary border-border-dark text-white"
            placeholder="Test case name"
          />
        </div>

        <div>
          <Label className="text-xs text-text-secondary">Description (optional)</Label>
          <Input
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 bg-dark-secondary border-border-dark text-white"
            placeholder="Brief description of what this test does"
          />
        </div>

        <div>
          <Label className="text-xs text-text-secondary">Input</Label>
          <Textarea
            value={formData.input}
            onChange={(e) => setFormData({ ...formData, input: e.target.value })}
            className="mt-1 bg-dark-secondary border-border-dark text-white font-mono text-xs"
            placeholder="Input data (one value per line)"
            rows={3}
          />
        </div>

        <div>
          <Label className="text-xs text-text-secondary">Expected Output</Label>
          <Textarea
            value={formData.expectedOutput}
            onChange={(e) => setFormData({ ...formData, expectedOutput: e.target.value })}
            className="mt-1 bg-dark-secondary border-border-dark text-white font-mono text-xs"
            placeholder="Expected output"
            rows={3}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!formData.name.trim() || !formData.expectedOutput.trim()}
            className="bg-tech-green hover:bg-tech-green/80"
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="border-border-dark text-text-secondary hover:bg-dark-secondary"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface TestCaseCardProps {
  testCase: TestCase;
  index: number;
  onEdit: (testCase: TestCase) => void;
  onDelete: (id: string) => void;
}

const TestCaseCard: React.FC<TestCaseCardProps> = ({ testCase, index, onEdit, onDelete }) => {
  return (
    <Card className="bg-dark-secondary border-border-dark">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-border-dark text-text-secondary">
              #{index + 1}
            </Badge>
            <h4 className="text-sm font-medium text-white">{testCase.name}</h4>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(testCase)}
              className="h-6 w-6 p-0 text-text-secondary hover:text-white"
            >
              ✏️
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(testCase.id)}
              className="h-6 w-6 p-0 text-text-secondary hover:text-red-400"
            >
              <XCircle className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {testCase.description && (
          <p className="text-xs text-text-secondary mb-2">{testCase.description}</p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <Label className="text-text-secondary">Input:</Label>
            <pre className="bg-dark-primary p-1 rounded mt-1 text-gray-300 text-xs">
              {testCase.input || '(empty)'}
            </pre>
          </div>
          <div>
            <Label className="text-text-secondary">Expected:</Label>
            <pre className="bg-dark-primary p-1 rounded mt-1 text-gray-300 text-xs">
              {testCase.expectedOutput}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
