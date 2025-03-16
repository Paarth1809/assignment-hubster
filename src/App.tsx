
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import CreateClass from "./pages/CreateClass";
import JoinClass from "./pages/JoinClass";
import ClassroomDetails from "./pages/ClassroomDetails";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-class" element={<CreateClass />} />
            <Route path="/join-class" element={<JoinClass />} />
            <Route path="/classroom/:id" element={<ClassroomDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
