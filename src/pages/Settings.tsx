
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ProfileTab from '@/components/settings/ProfileTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import AppearanceTab from '@/components/settings/AppearanceTab';
import SecurityTab from '@/components/settings/SecurityTab';
import SettingsSidebar from '@/components/settings/SettingsSidebar';

export default function Settings() {
  const { profile, updateProfile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('profile');

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    navigate('/');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold">Please login to access settings</h1>
            <button onClick={() => navigate('/auth')} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Go to Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            <SettingsSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              handleLogout={handleLogout} 
            />
            
            <div className="flex-1">
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="profile" className="mt-0">
                  <ProfileTab profile={profile} updateProfile={updateProfile} />
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0">
                  <NotificationsTab profile={profile} updateProfile={updateProfile} />
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-0">
                  <AppearanceTab profile={profile} updateProfile={updateProfile} />
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <SecurityTab />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
