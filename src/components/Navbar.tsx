
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Settings, LogOut, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { profile, signOut } = useAuth();
  const isMobile = useIsMobile();

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

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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
        <Link 
          to="/" 
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
        </Link>

        {!isMobile && (
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/join-class" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Join Class
            </Link>
            <Link to="/create-class" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Create Class
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          {profile ? (
            <div className="flex items-center gap-2">
              {!isMobile && (
                <span className="text-sm font-medium">{profile.name}</span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-xs text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/auth" className="text-sm font-medium transition-colors hover:text-primary">
                Sign In
              </Link>
              <Link to="/auth?tab=register" className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-primary/90 active:scale-95">
                Sign Up
              </Link>
            </div>
          )}
          
          {/* Mobile menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="py-4 flex flex-col h-full">
                  <div className="px-4 mb-8">
                    <h2 className="text-lg font-semibold mb-0">Menu</h2>
                    {profile && (
                      <p className="text-sm text-muted-foreground">Logged in as {profile.name}</p>
                    )}
                  </div>
                  <nav className="flex flex-col gap-2 px-2">
                    <Link 
                      to="/" 
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-secondary"
                    >
                      Home
                    </Link>
                    <Link 
                      to="/join-class" 
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-secondary"
                    >
                      Join Class
                    </Link>
                    <Link 
                      to="/create-class" 
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-secondary"
                    >
                      Create Class
                    </Link>
                  </nav>
                  
                  <div className="mt-auto">
                    {profile ? (
                      <div className="border-t pt-4 px-4 space-y-2">
                        <Link to="/account">
                          <Button variant="outline" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" />
                            My Account
                          </Button>
                        </Link>
                        <Link to="/settings">
                          <Button variant="outline" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          className="w-full justify-start"
                          onClick={() => signOut()}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    ) : (
                      <div className="border-t pt-4 px-4 space-y-2">
                        <Link to="/auth">
                          <Button variant="outline" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        <Link to="/auth?tab=register">
                          <Button className="w-full">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
