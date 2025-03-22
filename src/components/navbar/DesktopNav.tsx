
import { Link } from 'react-router-dom';

interface DesktopNavProps {
  isTeacher: boolean;
}

const DesktopNav = ({ isTeacher }: DesktopNavProps) => {
  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Home
      </Link>
      <Link to="/classes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Classes
      </Link>
      <Link to="/join-class" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Join Class
      </Link>
      {isTeacher && (
        <Link to="/create-class" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Create Class
        </Link>
      )}
    </nav>
  );
};

export default DesktopNav;
