import { Github, Twitter, Linkedin, Mail, ArrowRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-dark-secondary border-t border-border-dark relative">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-dark to-transparent" />
      
      {/* Newsletter section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto bg-dark-primary rounded-xl border border-border-dark p-8 md:p-12 shadow-xl shadow-black/5 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-green/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-green/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="max-w-md">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Stay updated with our <span className="bg-green-gradient text-transparent bg-clip-text">latest features</span>
              </h3>
              <p className="text-text-secondary mb-0 md:mb-4">
                Join our newsletter to receive updates about new features, interview tips, and industry insights.
              </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-dark-secondary border-border-dark text-white focus:border-emerald-green/50 h-12"
              />
              <Button className="bg-green-gradient hover:opacity-90 text-white h-12">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12 border-t border-border-dark">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-dark-primary border border-border-dark rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-emerald-green" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl">CodeGreen</span>
                <span className="text-xs text-text-secondary -mt-1">Technical Interviews</span>
              </div>
            </div>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Revolutionizing technical interviews with AI-powered assessments and real-time collaboration.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-9 h-9 rounded-full bg-dark-primary border border-border-dark flex items-center justify-center text-text-secondary hover:text-emerald-green hover:border-emerald-green/50 transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-dark-primary border border-border-dark flex items-center justify-center text-text-secondary hover:text-emerald-green hover:border-emerald-green/50 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-dark-primary border border-border-dark flex items-center justify-center text-text-secondary hover:text-emerald-green hover:border-emerald-green/50 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-dark-primary border border-border-dark flex items-center justify-center text-text-secondary hover:text-emerald-green hover:border-emerald-green/50 transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-lg">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-text-secondary hover:text-emerald-green transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-emerald-green transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-emerald-green transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-emerald-green transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5 text-lg">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-text-secondary hover:text-emerald-green transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-emerald-green transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-emerald-green transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-emerald-green transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5 text-lg">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-text-secondary hover:text-emerald-green transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-emerald-green transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-emerald-green transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-emerald-green transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border-dark mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-text-secondary text-sm mb-4 md:mb-0">
              © 2024 CodeGreen. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-text-secondary hover:text-emerald-green text-sm transition-colors">
                Privacy
              </a>
              <a href="#" className="text-text-secondary hover:text-emerald-green text-sm transition-colors">
                Terms
              </a>
              <a href="#" className="text-text-secondary hover:text-emerald-green text-sm transition-colors">
                Cookies
              </a>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-green">💚</span>
                <span className="text-text-secondary text-sm">Made for developers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
