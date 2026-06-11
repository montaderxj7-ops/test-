"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    try {
      if (!supabase) {
        setLoadingUser(false);
        return;
      }

      // Fetch initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoadingUser(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoadingUser(false);
      });

      return () => subscription.unsubscribe();
    } catch (e) {
      console.error("Supabase auth initialization error:", e);
      setLoadingUser(false);
    }
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  
  const logout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthModalOpen, 
      openAuthModal, 
      closeAuthModal,
      user,
      loadingUser,
      logout
    }}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
