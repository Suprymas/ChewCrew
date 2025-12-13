import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/AuthService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getSession().then(({ user }) => {
      setUser(user);
      setLoading(false);
    });

    const subscription = authService.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    const { user: newUser, error } = await authService.signUp(email, password);
    return { data: { user: newUser }, error };
  };

  const signIn = async (email, password) => {
    const { user: signedInUser, error } = await authService.signIn(email, password);
    return { data: { user: signedInUser }, error };
  };

  const signOut = async () => {
    const { success, error } = await authService.signOut();
    return { error };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};