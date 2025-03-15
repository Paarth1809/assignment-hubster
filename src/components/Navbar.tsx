
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-10",
        scrolled 
          ? "glass shadow-md backdrop-blur-md bg-white/70 dark:bg-black/30" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a 
          href="/" 
          className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-80"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M8 13h8" />
              <path d="M8 17h8" />
              <path d="M8 9h1" />
            </svg>
          </div>
          <span className="text-xl font-medium">AssignHub</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </a>
          <a href="#assignments" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            My Assignments
          </a>
          <a href="#upload" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Upload
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium transition-colors hover:text-primary">
            Sign In
          </button>
          <button className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-primary/90 active:scale-95">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
