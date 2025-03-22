
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import { UserProfile } from '@/utils/types';

interface MobileMenuProps {
  profile: UserProfile | null;
  isTeacher: boolean;
  signOut: () => void;
}

const MobileMenu = ({ profile, isTeacher, signOut }: MobileMenuProps) => {
  return (
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
              to="/classes" 
              className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-secondary"
            >
              Classes
            </Link>
            <Link 
              to="/join-class" 
              className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-secondary"
            >
              Join Class
            </Link>
            {isTeacher && (
              <Link 
                to="/create-class" 
                className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-secondary"
              >
                Create Class
              </Link>
            )}
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
  );
};

export default MobileMenu;
