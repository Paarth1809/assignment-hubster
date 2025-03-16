
import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserProfile } from '@/utils/types';
import { getCurrentUser, initializeDefaultUser, saveUserProfile } from '@/utils/storage';

interface AuthContextProps {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{error: any}>;
  signUp: (email: string, password: string, name: string, role: 'student' | 'teacher') => Promise<{error: any}>;
  signOut: () => Promise<void>;
  updateProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get session from supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ? mapUser(session.user) : null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ? mapUser(session.user) : null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Get or create user profile when auth user changes
  useEffect(() => {
    if (user) {
      const storedProfile = getCurrentUser();
      if (storedProfile && storedProfile.id === user.id) {
        setProfile(storedProfile);
        
        // Apply saved theme preference if available
        if (storedProfile.preferences?.theme) {
          applyTheme(storedProfile.preferences.theme);
        }
      } else {
        // Create a new profile based on auth data
        const newProfile: UserProfile = {
          id: user.id,
          name: user.user_metadata?.name || user.email.split('@')[0],
          email: user.email,
          role: 'student',
          enrolledClasses: [],
          preferences: {
            theme: 'system',
            language: 'en',
            notifications: {
              email: false,
              browser: false
            }
          }
        };
        saveUserProfile(newProfile);
        setProfile(newProfile);
      }
    } else {
      // Initialize default user if not authenticated
      const defaultUser = initializeDefaultUser();
      setProfile(defaultUser);
      
      // Apply system theme preference
      applyTheme('system');
    }
  }, [user]);

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    if (theme === 'system') {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
      localStorage.removeItem('theme');
    } else {
      // Apply explicit theme preference
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  };

  const mapUser = (user: any): AuthUser => ({
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata
  });

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, name: string, role: 'student' | 'teacher') => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (!error) {
      // Create user profile
      const userResponse = await supabase.auth.getUser();
      if (userResponse.data.user) {
        const newProfile: UserProfile = {
          id: userResponse.data.user.id,
          name,
          email,
          role,
          enrolledClasses: [],
          preferences: {
            theme: 'system',
            language: 'en',
            notifications: {
              email: false,
              browser: false
            }
          }
        };
        saveUserProfile(newProfile);
      }
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = (updatedProfile: UserProfile) => {
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    
    // Apply theme changes if they were updated
    if (updatedProfile.preferences?.theme) {
      applyTheme(updatedProfile.preferences.theme);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      isLoading,
      signIn,
      signUp,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
