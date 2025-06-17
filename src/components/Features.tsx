import { Code, Brain, Video, Users, Clock, BarChart, Check, Leaf } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Features = () => {
  const features = [
    {
      icon: Code,
      title: "Real-time Code Collaboration",
      description: "Watch candidates code in real-time with live syntax highlighting and instant feedback.",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      benefits: ["Syntax highlighting", "Multi-language support", "Instant feedback"]
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI evaluates code quality, algorithmic thinking, and problem-solving approaches.",
      color: "bg-emerald-green/10 text-emerald-green border-emerald-green/20",
      benefits: ["Code quality metrics", "Plagiarism detection", "Performance analysis"]
    },
    {
      icon: Video,
      title: "HD Video Interviews",
      description: "Seamless video integration with screen sharing and automated transcription.",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      benefits: ["Screen sharing", "Auto-transcription", "Recording & playback"]
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Multiple interviewers can join sessions and collaborate on candidate evaluation in real-time.",
      color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      benefits: ["Shared notes", "Multi-interviewer support", "Collaborative scoring"]
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Built-in timers and progress tracking keep interviews structured and efficient.",
      color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      benefits: ["Automated timers", "Progress tracking", "Scheduling tools"]
    },
    {
      icon: BarChart,
      title: "Analytics & Reports",
      description: "Comprehensive analytics on candidate performance and interview metrics.",
      color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      benefits: ["Performance insights", "Comparison tools", "Exportable reports"]
    }
  ];

  return (
    <section id="features" className="relative bg-dark-secondary py-24">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMjEyMTIiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTIgMmg1NnY1NkgyVjJ6IiBmaWxsPSIjMjAyMDIwIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] opacity-5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-dark to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-dark to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-dark-primary border border-border-dark px-3 py-1 text-sm text-emerald-green mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-green mr-2 animate-pulse"></span>
            Powerful Features
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Everything you need for
            <span className="bg-green-gradient text-transparent bg-clip-text"> technical interviews</span>
          </h2>
          
          <p className="text-xl text-text-secondary">
            Our platform streamlines the technical interview process from start to finish,
            helping you identify top talent efficiently and effectively.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-dark-primary border-border-dark hover:border-emerald-green/30 transition-all duration-300 group overflow-hidden relative"
            >
              {/* Gradient hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-green/0 to-emerald-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Card content */}
              <div className="p-8 relative z-10">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${feature.color} w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={24} />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-green transition-colors">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-text-secondary leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                {/* Benefits list */}
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-sm text-text-secondary">
                      <Check size={16} className="text-emerald-green mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block rounded-xl bg-dark-primary border border-border-dark p-8 shadow-xl shadow-emerald-green/5">
            <h3 className="text-2xl font-semibold text-white mb-4">Ready to transform your hiring process?</h3>
            <p className="text-text-secondary mb-6">Join hundreds of companies already using our platform.</p>
            <div className="inline-flex items-center gap-2 bg-dark-secondary px-4 py-2 rounded-md border border-border-dark">
              <span className="text-emerald-green font-mono">$</span>
              <span className="text-text-secondary">npm install codegreen-success</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
