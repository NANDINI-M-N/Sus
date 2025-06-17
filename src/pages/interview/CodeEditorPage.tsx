import React from 'react';
import { CodeEditorPanel } from '@/components/interview/CodeEditorPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Play, FileText } from 'lucide-react';
import { useInterview } from '@/contexts/InterviewContext';

const CodeEditorPage: React.FC = () => {
  const { code, language } = useInterview();

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Code Editor</h1>
        
        <div className="flex items-center space-x-3">
          <span className="text-text-secondary">
            Language: <span className="text-tech-green">{language}</span>
          </span>
          <span className="text-text-secondary">
            Length: <span className="text-white">{code.length} chars</span>
          </span>
        </div>
      </div>
      
      <Card className="bg-dark-secondary border-border-dark h-[calc(100%-4rem)]">
        <CardContent className="p-0 h-full">
          <Tabs defaultValue="editor" className="h-full flex flex-col">
            <TabsList className="bg-dark-primary px-4 py-2 border-b border-border-dark justify-start">
              <TabsTrigger value="editor" className="text-white data-[state=active]:bg-dark-secondary">
                <Code className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="problem" className="text-white data-[state=active]:bg-dark-secondary">
                <FileText className="w-4 h-4 mr-2" />
                Problem
              </TabsTrigger>
              <TabsTrigger value="output" className="text-white data-[state=active]:bg-dark-secondary">
                <Play className="w-4 h-4 mr-2" />
                Output
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="flex-1 p-0 m-0">
              <CodeEditorPanel />
            </TabsContent>
            
            <TabsContent value="problem" className="flex-1 p-6 m-0 overflow-auto">
              <h2 className="text-xl font-semibold text-white mb-4">Two Sum Problem</h2>
              <div className="prose prose-invert">
                <p>Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.</p>
                <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
                <p>You can return the answer in any order.</p>
                
                <h3>Example 1:</h3>
                <pre className="bg-dark-primary p-3 rounded">
                  <code>
                    Input: nums = [2,7,11,15], target = 9<br />
                    Output: [0,1]<br />
                    Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                  </code>
                </pre>
                
                <h3>Example 2:</h3>
                <pre className="bg-dark-primary p-3 rounded">
                  <code>
                    Input: nums = [3,2,4], target = 6<br />
                    Output: [1,2]
                  </code>
                </pre>
                
                <h3>Example 3:</h3>
                <pre className="bg-dark-primary p-3 rounded">
                  <code>
                    Input: nums = [3,3], target = 6<br />
                    Output: [0,1]
                  </code>
                </pre>
                
                <h3>Constraints:</h3>
                <ul>
                  <li>2 ≤ nums.length ≤ 10<sup>4</sup></li>
                  <li>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></li>
                  <li>-10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></li>
                  <li>Only one valid answer exists.</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="output" className="flex-1 p-0 m-0">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-border-dark">
                  <h3 className="text-white font-medium">Execution Output</h3>
                </div>
                <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-dark-primary">
                  {/* Sample output */}
                  <pre className="text-white">
                    {`> Running solution for Two Sum...
> Test case 1: nums = [2,7,11,15], target = 9
✓ Output: [0,1] - Correct!

> Test case 2: nums = [3,2,4], target = 6
✓ Output: [1,2] - Correct!

> Test case 3: nums = [3,3], target = 6
✓ Output: [0,1] - Correct!

All test cases passed!
Time complexity: O(n)
Space complexity: O(n)
Execution time: 0.12ms`}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeEditorPage; 