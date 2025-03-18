
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Monitor, Sun, Palette, Globe, Loader2 } from 'lucide-react';
import { UserProfile } from '@/utils/types';
import { useToast } from '@/hooks/use-toast';

interface AppearanceTabProps {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
}

export default function AppearanceTab({ profile, updateProfile }: AppearanceTabProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    profile?.preferences?.theme || 'system'
  );
  const [language, setLanguage] = useState(profile?.preferences?.language || 'en');
  const [fontSize, setFontSize] = useState(profile?.preferences?.fontSize || 'medium');

  // Apply theme when it changes
  useEffect(() => {
    // If theme is system, check user's preference
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    } else {
      // Otherwise apply the selected theme
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    
    // Store theme preference in localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system preference changes if using system theme
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleUpdateAppearance = () => {
    setIsSubmitting(true);
    
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        preferences: {
          ...profile.preferences,
          theme,
          language,
          fontSize
        }
      };
      
      updateProfile(updatedProfile);
      
      toast({
        title: "Appearance settings updated",
        description: "Your appearance preferences have been saved successfully."
      });
    } catch (error: any) {
      console.error("Failed to update appearance:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your appearance settings.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance Settings
        </CardTitle>
        <CardDescription>
          Customize how the application looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <Button 
                type="button" 
                variant={theme === 'light' ? 'default' : 'outline'} 
                className="flex flex-col items-center justify-center h-24 gap-2 relative overflow-hidden"
                onClick={() => setTheme('light')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 opacity-40" />
                <Sun className="h-6 w-6 relative z-10" />
                <span className="relative z-10">Light</span>
              </Button>
              
              <Button 
                type="button" 
                variant={theme === 'dark' ? 'default' : 'outline'} 
                className="flex flex-col items-center justify-center h-24 gap-2 relative overflow-hidden"
                onClick={() => setTheme('dark')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-40" />
                <Moon className="h-6 w-6 relative z-10" />
                <span className="relative z-10">Dark</span>
              </Button>
              
              <Button 
                type="button" 
                variant={theme === 'system' ? 'default' : 'outline'} 
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => setTheme('system')}
              >
                <Monitor className="h-6 w-6" />
                <span>System</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Choose between light, dark, or system preference for the application theme
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This will change the language for the user interface (preview feature)
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger id="fontSize">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Adjust the text size throughout the application
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateAppearance} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Appearance Settings'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
