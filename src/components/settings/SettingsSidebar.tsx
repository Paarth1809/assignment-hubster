
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Bell, Palette, Shield, User } from 'lucide-react';

interface SettingsSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

export default function SettingsSidebar({ 
  activeTab, 
  setActiveTab, 
  handleLogout 
}: SettingsSidebarProps) {
  return (
    <Card className="w-full md:w-64 h-fit">
      <CardContent className="p-6">
        <Tabs 
          orientation="vertical" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full space-y-4"
        >
          <TabsList className="flex flex-col h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="profile" 
              className="w-full justify-start mb-1 data-[state=active]:bg-primary/10 p-2 rounded"
            >
              <User className="mr-2 h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="w-full justify-start mb-1 data-[state=active]:bg-primary/10 p-2 rounded"
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="w-full justify-start mb-1 data-[state=active]:bg-primary/10 p-2 rounded"
            >
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="w-full justify-start mb-1 data-[state=active]:bg-primary/10 p-2 rounded"
            >
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Separator className="my-4" />
        
        <Button 
          variant="outline" 
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}
