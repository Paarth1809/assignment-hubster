
import { useEffect, useState } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-6">
      {/* Gradient background */}
      <div 
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950"
        aria-hidden="true"
      />
      
      {/* Spotlight effect */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] aspect-square bg-gradient-to-b from-blue-100/30 to-blue-700/5 dark:from-blue-900/20 dark:to-blue-900/0 rounded-full blur-3xl opacity-0 animate-spotlight"
        aria-hidden="true"
      />
      
      {/* Abstract shape */}
      <div 
        className="absolute top-1/4 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-70 animate-float"
        aria-hidden="true"
      />
      
      {/* Abstract shape */}
      <div 
        className="absolute bottom-1/4 left-0 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl opacity-70 animate-float"
        style={{ animationDelay: '2s' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center justify-center px-3 py-1 mb-6 text-xs font-medium rounded-full bg-primary/10 text-primary">
            <span>Simplified Assignment Submissions</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="block">Submit Your Assignments</span>
            <span className="block mt-2">with <span className="text-primary">Confidence</span></span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Streamlined assignment submissions, instant feedback, and easy tracking—all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#upload" 
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
            >
              Upload Assignment
            </a>
            <a 
              href="#assignments" 
              className="glass glass-hover px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              View Submissions
            </a>
          </div>
        </div>
        
        {/* Floating image */}
        <div 
          className={`relative mt-16 transition-all duration-1500 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-12'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <div className="glass rounded-xl shadow-2xl shadow-blue-500/5 overflow-hidden">
            <div className="p-1 bg-gradient-to-b from-white/80 to-white/20 dark:from-white/5 dark:to-white/0">
              <img 
                src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="Assignment dashboard" 
                className="w-full h-auto rounded-lg transform transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-8 -top-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
