
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@/context/AuthContext';
import App from './App.tsx'
import './index.css'
import { initializeClassrooms } from './utils/storage/classrooms/initialize.ts';
import { initializeAssignments } from './utils/storage/assignments.ts';

// Initialize local storage before rendering
const initApp = async () => {
  try {
    // Initialize storage
    await initializeClassrooms();
    initializeAssignments();
    
    // Render app
    createRoot(document.getElementById("root")!).render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
  } catch (error) {
    console.error("Failed to initialize app:", error);
    // Fallback rendering even if initialization fails
    createRoot(document.getElementById("root")!).render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
  }
};

initApp();
