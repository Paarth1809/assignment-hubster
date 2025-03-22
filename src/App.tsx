import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Account from './pages/Account';
import Settings from './pages/Settings';
import JoinClass from './pages/JoinClass';
import CreateClass from './pages/CreateClass';
import Classroom from './pages/Classroom';
import Classes from './pages/Classes';

function App() {
  const { loading } = useAuth();
  const [showToaster, setShowToaster] = useState(true);

  useEffect(() => {
    // Delay the appearance of the Toaster to avoid initial layout shift
    const timer = setTimeout(() => {
      setShowToaster(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {showToaster && <Toaster />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/join-class" element={<JoinClass />} />
        <Route path="/create-class" element={<CreateClass />} />
        <Route path="/classroom/:classId" element={<Classroom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
