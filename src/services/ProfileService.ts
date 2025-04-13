
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/utils/types";

// Get profile by user id
export async function getProfileById(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
  
  return data;
}

// Update user profile
export async function updateProfile(profile: {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'student' | 'teacher';
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      role: profile.role,
      updated_at: new Date().toISOString()
    })
    .eq('id', profile.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
  
  return data;
}

// Sync local profile with Supabase profile
export async function syncUserProfile(localProfile: UserProfile) {
  try {
    // First try to get the profile from Supabase
    const { data: existingProfile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', localProfile.id)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking profile:', error);
      return localProfile;
    }
    
    if (!existingProfile) {
      // Create new profile in Supabase if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: localProfile.id,
          full_name: localProfile.name,
          role: localProfile.role,
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating profile:', createError);
        return localProfile;
      }
      
      return {
        ...localProfile,
        name: newProfile.full_name || localProfile.name,
      };
    } else {
      // Update local profile with Supabase data
      return {
        ...localProfile,
        name: existingProfile.full_name || localProfile.name,
        avatar: existingProfile.avatar_url || localProfile.avatar,
      };
    }
  } catch (error) {
    console.error('Error syncing profile:', error);
    return localProfile;
  }
}
