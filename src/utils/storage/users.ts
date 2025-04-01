
import { UserProfile } from "../types";
import { getLocalStorage, setLocalStorage } from "./base";

// User Profiles
const USER_PROFILE_STORAGE_KEY = 'user_profile';

// Initialize default user profile
export const initializeDefaultUser = (): UserProfile | null => {
  // Check if a user profile exists
  const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
  if (storedProfile) {
    return JSON.parse(storedProfile);
  }

  return null;
};

// Get current user profile
export const getCurrentUser = (): UserProfile | null => {
  const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
  return storedProfile ? JSON.parse(storedProfile) : null;
};

// Save user profile
export const saveUserProfile = (profile: UserProfile): void => {
  // Ensure enrolledClasses is always an array, even if it's undefined
  if (!profile.enrolledClasses) {
    profile.enrolledClasses = [];
  }
  
  localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
};
