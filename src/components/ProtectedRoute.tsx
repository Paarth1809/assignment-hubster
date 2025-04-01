
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading && !user && location.pathname !== '/auth') {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to access this page',
        variant: 'destructive',
      });
    }
  }, [user, isLoading, location.pathname, toast]);

  if (isLoading) {
    // Show loading state
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page if not logged in
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
