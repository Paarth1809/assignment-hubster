
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/account/ProfileCard';
import StatsCard from '@/components/account/StatsCard';
import ContentTabs from '@/components/account/ContentTabs';
import { getUserClassrooms, getUpcomingLiveClasses } from '@/utils/account';

export default function Account() {
  const { profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold">Please login to access your account</h1>
            <button onClick={() => navigate('/auth')} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Go to Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const classrooms = getUserClassrooms();
  const upcomingLiveClasses = getUpcomingLiveClasses(classrooms);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ProfileCard 
                profile={profile} 
                handleLogout={handleLogout} 
                updateProfile={updateProfile}
              />
              <StatsCard 
                classrooms={classrooms}
                upcomingLiveClasses={upcomingLiveClasses}
                userRole={profile.role}
              />
            </div>
            
            <div className="md:col-span-2">
              <ContentTabs 
                classrooms={classrooms}
                upcomingLiveClasses={upcomingLiveClasses}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
