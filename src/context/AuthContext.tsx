import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserProfile } from '@/utils/types';
import { getCurrentUser, initializeDefaultUser, saveUserProfile } from '@/utils/storage';
import { syncUserProfile } from '@/services/ProfileService';

interface AuthContextProps {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{error: any}>;
  signUp: (email: string, password: string, name: string, role: 'student' | 'teacher') => Promise<{error: any}>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
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
    const loadUserProfile = async () => {
      if (user) {
        // First check for profile in local storage
        const storedProfile = getCurrentUser();
        
        if (storedProfile && storedProfile.id === user.id) {
          // Sync with Supabase profile
          const syncedProfile = await syncUserProfile(storedProfile);
          setProfile(syncedProfile);
          saveUserProfile(syncedProfile);
          
          // Apply saved theme preference if available
          if (syncedProfile.preferences?.theme) {
            applyTheme(syncedProfile.preferences.theme);
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
          
          // Sync with Supabase
          const syncedProfile = await syncUserProfile(newProfile);
          saveUserProfile(syncedProfile);
          setProfile(syncedProfile);
        }
      } else {
        // Initialize default user if not authenticated
        const defaultUser = initializeDefaultUser();
        setProfile(defaultUser);
        
        // Apply system theme preference
        applyTheme('system');
      }
    };
    
    loadUserProfile();
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
        data: { name, role }
      }
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updatedProfileData: Partial<UserProfile>): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (!profile) {
        resolve();
        return;
      }
      
      // Merge the current profile with the updated data
      const updatedProfile: UserProfile = {
        ...profile,
        ...updatedProfileData,
        // For nested objects, we need to merge them explicitly
        preferences: {
          ...profile.preferences,
          ...updatedProfileData.preferences,
          notifications: {
            ...profile.preferences?.notifications,
            ...updatedProfileData.preferences?.notifications
          }
        }
      };
      
      saveUserProfile(updatedProfile);
      setProfile(updatedProfile);
      
      // Apply theme changes if they were updated
      if (updatedProfileData.preferences?.theme) {
        applyTheme(updatedProfileData.preferences.theme);
      }
      
      resolve();
    });
    
    // Also update Supabase profile if relevant fields are updated
    if (profile && (updatedProfileData.name || updatedProfileData.avatar)) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: updatedProfileData.name || profile.name,
            avatar_url: updatedProfileData.avatar || profile.avatar,
            role: updatedProfileData.role || profile.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);
      } catch (error) {
        console.error("Error updating Supabase profile:", error);
      }
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
