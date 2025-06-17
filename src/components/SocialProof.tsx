import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SocialProof = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);
  
  // Companies with more detailed information
  const companies = [
    { name: "TechCorp", logo: "TC", color: "bg-blue-500/20" },
    { name: "InnovateLabs", logo: "IL", color: "bg-purple-500/20" },
    { name: "DevStudio", logo: "DS", color: "bg-green-500/20" },
    { name: "CodeFirst", logo: "CF", color: "bg-yellow-500/20" },
    { name: "ByteWorks", logo: "BW", color: "bg-pink-500/20" },
    { name: "NexGen", logo: "NG", color: "bg-orange-500/20" }
  ];

  // Stats with target values
  const stats = [
    { number: 10000, label: "Interviews Conducted", suffix: "+" },
    { number: 500, label: "Companies Trust Us", suffix: "+" },
    { number: 95, label: "Satisfaction Rate", suffix: "%" },
    { number: 40, label: "Time Saved", suffix: "%" }
  ];
  
  // Testimonials with more detailed information
  const testimonials = [
    {
      quote: "CodeSignal transformed our hiring process. We reduced time-to-hire by 40% while significantly improving the quality of our technical assessments.",
      author: "Sarah Mitchell",
      position: "VP Engineering",
      company: "TechCorp",
      avatar: "SM",
      rating: 5
    },
    {
      quote: "The AI-powered analysis has been a game-changer for our technical interviews. We can now objectively evaluate candidates based on their problem-solving approach and code quality.",
      author: "Michael Chen",
      position: "CTO",
      company: "ByteWorks",
      avatar: "MC",
      rating: 5
    },
    {
      quote: "Our remote hiring process is now seamless thanks to the real-time collaboration features. The video quality is excellent, and the code editor works flawlessly.",
      author: "Jessica Wong",
      position: "Head of Talent",
      company: "DevStudio",
      avatar: "JW",
      rating: 4
    }
  ];
  
  // Animate counting up the stats
  useEffect(() => {
    const finalStats = stats.map(stat => stat.number);
    const duration = 2000; // 2 seconds animation
    const frameRate = 50; // Update 50 times per second
    const totalFrames = duration / (1000 / frameRate);
    let frame = 0;
    
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      if (frame <= totalFrames) {
        const newAnimatedStats = finalStats.map(stat => 
          Math.round(stat * progress)
        );
        setAnimatedStats(newAnimatedStats);
      } else {
        clearInterval(timer);
        setAnimatedStats(finalStats);
      }
    }, 1000 / frameRate);
    
    return () => clearInterval(timer);
  }, []);
  
  // Handle testimonial navigation
  const nextTestimonial = () => {
    setActiveTestimonial((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevTestimonial = () => {
    setActiveTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };
  
  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);
    
    return () => clearInterval(interval);
  }, [activeTestimonial]);

  return (
    <section className="relative bg-dark-primary py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-primary via-dark-primary to-dark-secondary/30 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-dark to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center rounded-full bg-dark-secondary border border-border-dark px-3 py-1 text-sm text-emerald-green mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-green mr-2 animate-pulse"></span>
            Trusted by Innovators
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            Join <span className="bg-green-gradient text-transparent bg-clip-text">industry leaders</span> who trust our platform
          </h2>
          
          <p className="text-xl text-text-secondary">
            Companies worldwide rely on our platform to find and hire the best technical talent.
          </p>
        </div>
        
        {/* Companies logos - modern grid with hover effects */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 mb-24">
          {companies.map((company, index) => (
            <div 
              key={index} 
              className="group relative rounded-xl border border-border-dark bg-dark-secondary p-6 flex items-center justify-center transition-all duration-300 hover:border-emerald-green/30 hover:shadow-lg hover:shadow-emerald-green/5"
            >
              <div className={`absolute inset-0 ${company.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white group-hover:text-emerald-green transition-colors duration-300">{company.logo}</div>
                <div className="text-xs text-text-secondary mt-2 opacity-70 group-hover:opacity-100 transition-opacity">{company.name}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats - with animated counting */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => (
            <div key={index} className="relative group">
              {/* Background glow on hover */}
              <div className="absolute inset-0 bg-emerald-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"></div>
              
              <div className="relative bg-dark-secondary border border-border-dark rounded-xl p-6 text-center group-hover:border-emerald-green/30 transition-colors duration-300">
                <div className="text-4xl lg:text-5xl font-bold bg-green-gradient text-transparent bg-clip-text mb-2">
                  {animatedStats[index].toLocaleString()}{stat.suffix}
                </div>
                <div className="text-text-secondary group-hover:text-white transition-colors">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonials - modern carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-dark-secondary border border-border-dark rounded-xl p-8 md:p-12 shadow-xl shadow-emerald-green/5">
            {/* Quote icon */}
            <div className="absolute top-6 left-6 text-emerald-green/20">
              <Quote size={48} />
            </div>
            
            {/* Testimonial content */}
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`transition-opacity duration-500 ${
                    index === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Stars */}
                    <div className="flex items-center space-x-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={20} 
                          className={i < testimonial.rating ? "text-emerald-green fill-emerald-green" : "text-gray-400"} 
                        />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl text-white mb-8 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Author info */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-green-gradient rounded-full flex items-center justify-center mb-3">
                        <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                      </div>
                      <div className="text-lg font-semibold text-white">{testimonial.author}</div>
                      <div className="text-text-secondary">
                        {testimonial.position}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-gray-700 hover:border-emerald-green/50 hover:bg-gray-900"
                onClick={prevTestimonial}
              >
                <ArrowLeft size={16} />
              </Button>
              
              {/* Dots */}
              <div className="flex items-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeTestimonial 
                        ? 'bg-emerald-green w-6' 
                        : 'bg-gray-700 hover:bg-gray-400'
                    }`}
                    onClick={() => setActiveTestimonial(index)}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-gray-700 hover:border-emerald-green/50 hover:bg-gray-900"
                onClick={nextTestimonial}
              >
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
