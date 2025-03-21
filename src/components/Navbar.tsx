
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './navbar/Logo';
import DesktopNav from './navbar/DesktopNav';
import UserMenu from './navbar/UserMenu';
import MobileMenu from './navbar/MobileMenu';
import AuthButtons from './navbar/AuthButtons';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { profile, signOut } = useAuth();
  const isMobile = useIsMobile();
  const isTeacher = profile?.role === 'teacher';

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
        <Logo />

        {!isMobile && <DesktopNav isTeacher={isTeacher} />}

        <div className="flex items-center gap-4">
          {profile ? (
            <UserMenu profile={profile} signOut={signOut} isMobile={isMobile} />
          ) : (
            <AuthButtons />
          )}
          
          {/* Mobile menu */}
          {isMobile && (
            <MobileMenu 
              profile={profile} 
              isTeacher={isTeacher} 
              signOut={signOut} 
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
