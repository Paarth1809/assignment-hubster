
import { Link } from 'react-router-dom';

const AuthButtons = () => {
  return (
    <div className="hidden md:flex items-center gap-4">
      <Link to="/auth" className="text-sm font-medium transition-colors hover:text-primary">
        Sign In
      </Link>
      <Link to="/auth?tab=register" className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-primary/90 active:scale-95">
        Sign Up
      </Link>
    </div>
  );
};

export default AuthButtons;
