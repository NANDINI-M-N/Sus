import { Button } from '@/components/ui/button';
import { ArrowRight, Terminal, Leaf, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const codeSnippet = `function findBestCandidate(candidates) {
  return candidates
    .filter(c => c.skills.includes('problemSolving'))
    .sort((a, b) => b.score - a.score)[0];
}`;

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < codeSnippet.length) {
        setTypedText(codeSnippet.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section className="relative bg-dark-primary py-20 md:py-28 px-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-primary via-dark-primary to-dark-secondary pointer-events-none" />
      
      {/* Animated background elements */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-emerald-green/5 rounded-full blur-3xl animate-pulse-green" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-green/5 rounded-full blur-3xl animate-pulse-green" style={{ animationDuration: '12s' }} />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMjEyMTIiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTIgMmg1NnY1NkgyVjJ6IiBmaWxsPSIjMjAyMDIwIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] opacity-5 pointer-events-none" />
      
      {/* Main content */}
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left column - Text content */}
          <div className="flex flex-col space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center self-start rounded-full bg-dark-secondary border border-border-dark px-3 py-1 text-sm text-emerald-green">
              <span className="flex h-2 w-2 rounded-full bg-emerald-green mr-2 animate-pulse"></span>
              New AI Features Released
            </div>
            
            {/* Main Headline */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                <span className="block">Discover</span>
                <span className="block bg-green-gradient text-transparent bg-clip-text">Top Talent</span>
                <span className="block">With Confidence</span>
              </h1>
              
              {/* Subtext */}
              <p className="text-xl text-text-secondary mt-6 max-w-xl leading-relaxed">
                Our AI-powered platform combines real-time code collaboration, 
                intelligent candidate analysis, and seamless video interviews.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                asChild
                className="bg-green-gradient hover:opacity-90 text-white font-semibold px-8 py-6 h-auto text-lg shadow-lg shadow-emerald-green/20 hover:shadow-emerald-green/30 transition-all duration-200"
              >
                <Link to="/auth">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-emerald-green border-2 text-emerald-green hover:bg-emerald-green/10 hover:border-green-light px-8 py-6 h-auto text-lg shadow-lg shadow-emerald-green/10 hover:shadow-emerald-green/20 transition-all duration-200"
              >
                <Leaf className="mr-2 h-5 w-5" />
                Request Demo
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="pt-6 border-t border-border-dark">
              <p className="text-text-secondary text-sm mb-4">Trusted by top tech companies worldwide</p>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="text-text-secondary hover:text-emerald-green transition-colors">TechCorp</div>
                <div className="text-text-secondary hover:text-emerald-green transition-colors">InnovateLabs</div>
                <div className="text-text-secondary hover:text-emerald-green transition-colors">DevStudio</div>
                <div className="text-text-secondary hover:text-emerald-green transition-colors">ByteWorks</div>
              </div>
            </div>
          </div>
          
          {/* Right column - Code terminal */}
          <div className="hidden lg:block">
            <div className="relative bg-dark-secondary rounded-xl border border-border-dark shadow-2xl shadow-emerald-green/5 overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center justify-between bg-dark-secondary border-b border-border-dark p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-text-secondary text-xs">interview.js</div>
                <div className="w-4"></div>
              </div>
              
              {/* Terminal content */}
              <div className="p-6 font-mono text-sm">
                <div className="flex items-center text-text-secondary mb-2">
                  <Code className="h-4 w-4 mr-2 text-emerald-green" />
                  <span>Finding the perfect candidate:</span>
                </div>
                <pre className="text-white">
                  <code className="text-emerald-green">{typedText}</code>
                  <span className="animate-pulse">|</span>
                </pre>
              </div>
              
              {/* Terminal footer */}
              <div className="bg-dark-secondary border-t border-border-dark p-3 text-xs text-text-secondary flex justify-between">
                <span>AI-powered evaluation</span>
                <span className="text-emerald-green">Ready</span>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-green/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 w-32 h-32 bg-emerald-green/5 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
