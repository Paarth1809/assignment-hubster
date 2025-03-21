
import { LiveClass } from "../types";
import { getLocalStorage, setLocalStorage } from "./base";

// Live Classes
const LIVE_CLASSES_STORAGE_KEY = 'classroom_live_classes';

// Initialize live classes
export const initializeLiveClasses = () => {
  if (!localStorage.getItem(LIVE_CLASSES_STORAGE_KEY)) {
    localStorage.setItem(LIVE_CLASSES_STORAGE_KEY, JSON.stringify([]));
  }
  return getLiveClasses();
};

// Get all live classes
export const getLiveClasses = (): LiveClass[] => {
  const liveClasses = localStorage.getItem(LIVE_CLASSES_STORAGE_KEY);
  return liveClasses ? JSON.parse(liveClasses) : [];
};

// Get live classes for a specific classroom
export const getLiveClassesForClassroom = (classId: string): LiveClass[] => {
  const liveClasses = getLiveClasses();
  return liveClasses.filter(liveClass => liveClass.classId === classId);
};

// Create a new live class
export const createLiveClass = (liveClass: LiveClass): LiveClass => {
  const liveClasses = getLiveClasses();
  liveClasses.push(liveClass);
  localStorage.setItem(LIVE_CLASSES_STORAGE_KEY, JSON.stringify(liveClasses));
  return liveClass;
};

// Update a live class
export const updateLiveClass = (updatedLiveClass: LiveClass): LiveClass => {
  const liveClasses = getLiveClasses();
  const index = liveClasses.findIndex(lc => lc.id === updatedLiveClass.id);
  
  if (index !== -1) {
    liveClasses[index] = updatedLiveClass;
    localStorage.setItem(LIVE_CLASSES_STORAGE_KEY, JSON.stringify(liveClasses));
  }
  
  return updatedLiveClass;
};

// Delete a live class
export const deleteLiveClass = (liveClassId: string): void => {
  const liveClasses = getLiveClasses();
  const filteredLiveClasses = liveClasses.filter(lc => lc.id !== liveClassId);
  localStorage.setItem(LIVE_CLASSES_STORAGE_KEY, JSON.stringify(filteredLiveClasses));
};
