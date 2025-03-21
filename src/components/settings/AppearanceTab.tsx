
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/utils/types';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppearanceTabProps {
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

type ThemeOption = 'light' | 'dark' | 'system';
type FontSizeOption = 'small' | 'medium' | 'large';

export default function AppearanceTab({ profile, updateProfile }: AppearanceTabProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize theme preference - default to system
  const [theme, setTheme] = useState<ThemeOption>(
    profile.preferences?.theme as ThemeOption || 'system'
  );
  
  // Initialize language preference - default to English
  const [language, setLanguage] = useState(
    profile.preferences?.language || 'en'
  );
  
  // Initialize font size preference - default to medium
  const [fontSize, setFontSize] = useState<FontSizeOption>(
    (profile.preferences?.fontSize as FontSizeOption) || 'medium'
  );
  
  // Apply theme when component loads and when theme changes
  useEffect(() => {
    const applyTheme = () => {
      // Remove any existing theme classes
      document.documentElement.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        // Check system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.add(systemPrefersDark ? 'dark' : 'light');
      } else {
        // Apply selected theme
        document.documentElement.classList.add(theme);
      }
      
      // Store preference in localStorage for persistence
      localStorage.setItem('theme', theme);
    };
    
    applyTheme();
    
    // Add listener for system preference changes if using system theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  
  // Save appearance settings
  const saveAppearanceSettings = async () => {
    setIsSaving(true);
    
    try {
      await updateProfile({
        preferences: {
          ...profile.preferences,
          theme,
          language,
          fontSize,
        }
      });
      
      toast({
        title: 'Appearance settings saved',
        description: 'Your appearance preferences have been updated.',
      });
    } catch (error) {
      console.error('Error saving appearance settings:', error);
      toast({
        title: 'Error saving settings',
        description: 'There was a problem saving your appearance settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle font size change
  const handleFontSizeChange = (value: string) => {
    setFontSize(value as FontSizeOption);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize the look and feel of the application
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>
              Choose your preferred color theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={theme} 
              onValueChange={(value) => setTheme(value as ThemeOption)}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem 
                  value="light" 
                  id="theme-light" 
                  className="sr-only" 
                />
                <Label
                  htmlFor="theme-light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Sun className="mb-3 h-6 w-6" />
                  Light
                  {theme === 'light' && (
                    <Check className="absolute top-1 right-1 h-4 w-4 text-primary" />
                  )}
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="dark" 
                  id="theme-dark" 
                  className="sr-only" 
                />
                <Label
                  htmlFor="theme-dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Moon className="mb-3 h-6 w-6" />
                  Dark
                  {theme === 'dark' && (
                    <Check className="absolute top-1 right-1 h-4 w-4 text-primary" />
                  )}
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="system" 
                  id="theme-system" 
                  className="sr-only" 
                />
                <Label
                  htmlFor="theme-system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Monitor className="mb-3 h-6 w-6" />
                  System
                  {theme === 'system' && (
                    <Check className="absolute top-1 right-1 h-4 w-4 text-primary" />
                  )}
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>
              Select your preferred language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full sm:w-[240px]">
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
          </CardContent>
        </Card>
        
        {/* Font Size */}
        <Card>
          <CardHeader>
            <CardTitle>Font Size</CardTitle>
            <CardDescription>
              Adjust the text size for better readability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={fontSize} onValueChange={handleFontSizeChange}>
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={saveAppearanceSettings} 
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
