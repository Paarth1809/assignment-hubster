
import { Classroom } from "../../types";
import { getLocalStorage, setLocalStorage } from "../base";
import { getClassrooms } from "./getClassrooms";

// Storage key
export const CLASSROOMS_STORAGE_KEY = 'classrooms';

// Initialize classrooms
export const initializeClassrooms = async (): Promise<Classroom[]> => {
  try {
    if (!localStorage.getItem(CLASSROOMS_STORAGE_KEY)) {
      localStorage.setItem(CLASSROOMS_STORAGE_KEY, JSON.stringify([]));
    }
    return await getClassrooms();
  } catch (error) {
    console.error("Error initializing classrooms:", error);
    // Fallback if async initialization fails
    return [];
  }
};
