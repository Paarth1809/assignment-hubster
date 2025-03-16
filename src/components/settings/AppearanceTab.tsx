import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Monitor, Sun } from 'lucide-react';
import { UserProfile } from '@/utils/types';

interface AppearanceTabProps {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
}

export default function AppearanceTab({ profile, updateProfile }: AppearanceTabProps) {
  const [theme, setTheme] = useState(profile?.preferences?.theme || 'system');
  const [language, setLanguage] = useState(profile?.preferences?.language || 'en');

  // Apply theme when it changes
  React.useEffect(() => {
    // If theme is system, check user's preference
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    } else {
      // Otherwise apply the selected theme
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const handleUpdateAppearance = () => {
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        preferences: {
          ...profile.preferences,
          theme,
          language
        }
      };
      
      updateProfile(updatedProfile);
    } catch (error: any) {
      console.error("Failed to update appearance:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize how the application looks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <Button 
                type="button" 
                variant={theme === 'light' ? 'default' : 'outline'} 
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-6 w-6" />
                <span>Light</span>
              </Button>
              
              <Button 
                type="button" 
                variant={theme === 'dark' ? 'default' : 'outline'} 
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-6 w-6" />
                <span>Dark</span>
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
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This will change the language for the user interface (preview feature)
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateAppearance}>
          Save Appearance Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
