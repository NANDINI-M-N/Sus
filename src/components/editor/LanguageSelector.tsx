import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, FileText, Database, Globe, Zap, Coffee, Terminal } from 'lucide-react';

export interface Language {
  id: string;
  name: string;
  icon: React.ReactNode;
  extension: string;
  defaultContent: string;
  description: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: <span className="text-yellow-500">🟨</span>,
    extension: '.js',
    description: 'Dynamic programming language',
    defaultContent: `// JavaScript Example
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));

// Modern JavaScript features
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled);`
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: <span className="text-blue-500">🔷</span>,
    extension: '.ts',
    description: 'Typed superset of JavaScript',
    defaultContent: `// TypeScript Example
interface User {
    id: number;
    name: string;
    email: string;
}

class UserService {
    private users: User[] = [];

    addUser(user: User): void {
        this.users.push(user);
    }

    getUserById(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }
}

const userService = new UserService();
userService.addUser({ id: 1, name: "John Doe", email: "john@example.com" });`
  },
  {
    id: 'python',
    name: 'Python',
    icon: <span className="text-green-500">🐍</span>,
    extension: '.py',
    description: 'High-level programming language',
    defaultContent: `# Python Example
def fibonacci(n):
    """Generate fibonacci sequence up to n terms"""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    return sequence

# List comprehension
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]

print("Fibonacci sequence:", fibonacci(10))
print("Squares:", squares)`
  },
  {
    id: 'java',
    name: 'Java',
    icon: <Coffee className="w-4 h-4 text-orange-600" />,
    extension: '.java',
    description: 'Object-oriented programming language',
    defaultContent: `// Java Example
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            numbers.add(i);
        }
        
        System.out.println("Numbers: " + numbers);
        System.out.println("Sum: " + calculateSum(numbers));
    }
    
    public static int calculateSum(List<Integer> numbers) {
        return numbers.stream()
                     .mapToInt(Integer::intValue)
                     .sum();
    }
}`
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: <Zap className="w-4 h-4 text-blue-600" />,
    extension: '.cpp',
    description: 'Systems programming language',
    defaultContent: `// C++ Example
#include <iostream>
#include <vector>
#include <algorithm>

class Calculator {
private:
    std::vector<int> numbers;

public:
    void addNumber(int num) {
        numbers.push_back(num);
    }
    
    int getSum() const {
        int sum = 0;
        for (const auto& num : numbers) {
            sum += num;
        }
        return sum;
    }
    
    void sort() {
        std::sort(numbers.begin(), numbers.end());
    }
};

int main() {
    Calculator calc;
    calc.addNumber(5);
    calc.addNumber(2);
    calc.addNumber(8);
    
    std::cout << "Sum: " << calc.getSum() << std::endl;
    return 0;
}`
  },
  {
    id: 'go',
    name: 'Go',
    icon: <span className="text-cyan-500">🐹</span>,
    extension: '.go',
    description: 'Fast, simple programming language',
    defaultContent: `// Go Example
package main

import (
    "fmt"
    "sort"
)

type Person struct {
    Name string
    Age  int
}

func (p Person) String() string {
    return fmt.Sprintf("%s (%d years old)", p.Name, p.Age)
}

func main() {
    people := []Person{
        {"Alice", 30},
        {"Bob", 25},
        {"Charlie", 35},
    }
    
    // Sort by age
    sort.Slice(people, func(i, j int) bool {
        return people[i].Age < people[j].Age
    })
    
    for _, person := range people {
        fmt.Println(person)
    }
}`
  },
  {
    id: 'html',
    name: 'HTML',
    icon: <Globe className="w-4 h-4 text-orange-500" />,
    extension: '.html',
    description: 'Markup language for web',
    defaultContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
    </header>
    
    <main>
        <div class="card">
            <h2>About</h2>
            <p>This is a sample HTML page with modern structure.</p>
        </div>
    </main>
</body>
</html>`
  },
  {
    id: 'css',
    name: 'CSS',
    icon: <span className="text-blue-400">🎨</span>,
    extension: '.css',
    description: 'Styling language for web',
    defaultContent: `/* CSS Example - Modern Styles */
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --background-color: #f8fafc;
  --text-color: #1e293b;
  --border-radius: 8px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
}`
  },
  {
    id: 'json',
    name: 'JSON',
    icon: <Database className="w-4 h-4 text-green-600" />,
    extension: '.json',
    description: 'Data interchange format',
    defaultContent: `{
  "name": "My Project",
  "version": "1.0.0",
  "description": "A sample JSON configuration",
  "author": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0"
  },
  "scripts": {
    "start": "npm run dev",
    "build": "npm run build",
    "test": "jest"
  },
  "config": {
    "theme": "dark",
    "language": "en",
    "features": {
      "authentication": true,
      "analytics": false,
      "notifications": true
    }
  }
}`
  }
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  compact = false
}) => {
  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.id === selectedLanguage);

  if (compact) {
    return (
      <Select value={selectedLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-40 bg-dark-secondary border-border-dark text-white h-8">
          <SelectValue className="text-white" />
        </SelectTrigger>
        <SelectContent className="bg-dark-secondary border-border-dark">
          {SUPPORTED_LANGUAGES.map((language) => (
            <SelectItem 
              key={language.id} 
              value={language.id} 
              className="text-white hover:bg-dark-primary"
            >
              <div className="flex items-center space-x-2">
                {language.icon}
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Card className="bg-dark-secondary border-border-dark">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Code className="w-5 h-5 text-tech-green" />
          Languages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {SUPPORTED_LANGUAGES.map((language) => (
          <button
            key={language.id}
            onClick={() => onLanguageChange(language.id)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
              selectedLanguage === language.id
                ? 'bg-tech-green/10 border border-tech-green text-white'
                : 'bg-dark-primary border border-border-dark text-text-secondary hover:text-white hover:bg-dark-primary/80'
            }`}
          >
            <div className="flex items-center gap-3">
              {language.icon}
              <div className="flex-1">
                <div className="font-medium">{language.name}</div>
                <div className="text-xs opacity-70">{language.description}</div>
              </div>
              <span className="text-xs opacity-50">{language.extension}</span>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
};
