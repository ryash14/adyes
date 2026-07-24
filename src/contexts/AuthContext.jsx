/**
 * Authentication Context
 * Firebase-based authentication state management
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import toast from 'react-hot-toast';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 const [profile, setProfile] = useState(null);
 const [loading, setLoading] = useState(true);

 const fetchProfile = useCallback(async (userId) => {
 try {
 const { data, error } = await userService.getUser(userId);
 if (error) {
 console.error('Error fetching profile:', error);
 setProfile(null);
 } else {
 setProfile(data);
 }
 } catch (error) {
 console.error('Error fetching profile:', error);
 setProfile(null);
 } finally {
 setLoading(false);
 }
 }, []);

 useEffect(() => {
  // Check for redirect result from OAuth
  authService.checkRedirectResult().then(({ error }) => {
    if (error) toast.error(error);
  });

  // Subscribe to auth state changes
  const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
  setUser(firebaseUser);
  
  if (firebaseUser) {
  await fetchProfile(firebaseUser.uid);
  userService.updatePresence(firebaseUser.uid, 'online');
  } else {
  setProfile(null);
  setLoading(false);
  }
  });

 const handleFocus = () => {
 const currentUser = authService.getCurrentUser();
 if (currentUser) {
 userService.updatePresence(currentUser.uid, 'online');
 }
 };

 const handleBlur = () => {
 const currentUser = authService.getCurrentUser();
 if (currentUser) {
 userService.updatePresence(currentUser.uid, 'offline');
 }
 };

 window.addEventListener('focus', handleFocus);
 window.addEventListener('blur', handleBlur);
 window.addEventListener('beforeunload', handleBlur);

 return () => {
 unsubscribe();
 window.removeEventListener('focus', handleFocus);
 window.removeEventListener('blur', handleBlur);
 window.removeEventListener('beforeunload', handleBlur);
 };
 }, [fetchProfile]);

  const registerWithEmail = useCallback(async (email, password) => {
    const { user: firebaseUser, error } = await authService.registerWithEmail(email, password);
    if (error) {
      toast.error(error);
      return { user: null, error };
    }
    toast.success('Account created successfully!');
    return { user: firebaseUser, error: null };
  }, []);

  const loginWithEmail = useCallback(async (email, password) => {
    const { user: firebaseUser, error } = await authService.loginWithEmail(email, password);
    if (error) {
      toast.error(error);
      return { user: null, error };
    }
    toast.success('Successfully logged in!');
    return { user: firebaseUser, error: null };
  }, []);

 const signInWithGoogle = useCallback(async () => {
 const { user: firebaseUser, error } = await authService.signInWithGoogle();
 if (error) {
 toast.error(error);
 return { user: null, error };
 }
 if (firebaseUser) {
 toast.success('Welcome!');
 }
 return { user: firebaseUser, error: null };
 }, []);

 const signInWithGithub = useCallback(async () => {
 const { user: firebaseUser, error } = await authService.signInWithGithub();
 if (error) {
 toast.error(error);
 return { user: null, error };
 }
 if (firebaseUser) {
 toast.success('Welcome!');
 }
 return { user: firebaseUser, error: null };
 }, []);

 const signOut = useCallback(async () => {
 if (user) {
 await userService.updatePresence(user.uid, 'offline');
 }
 const { error } = await authService.signOut();
 if (error) {
 toast.error(error);
 return { error };
 }
 setUser(null);
 setProfile(null);
 toast.success('Signed out successfully');
 return { error: null };
 }, []);

 const updateProfile = useCallback(async (updates) => {
 if (!user) {
 return { data: null, error: 'No user logged in' };
 }

 try {
 const { data, error } = await userService.updateUser(user.uid, updates);
 if (error) {
 toast.error('Failed to update profile');
 return { data: null, error };
 }
 setProfile(data);
 toast.success('Profile updated successfully');
 return { data, error: null };
 } catch (error) {
 console.error('Error updating profile:', error);
 toast.error('Failed to update profile');
 return { data: null, error: error.message };
 }
 }, [user]);

 const completeProfile = useCallback(async (profileData) => {
 if (!user) {
 return { data: null, error: 'No user logged in' };
 }

 try {
 const { data, error } = await userService.completeProfile(user.uid, profileData);
 if (error) {
 toast.error('Failed to complete profile');
 return { data: null, error };
 }
 setProfile(data);
 toast.success('Profile completed successfully!');
 return { data, error: null };
 } catch (error) {
 console.error('Error completing profile:', error);
 toast.error('Failed to complete profile');
 return { data: null, error: error.message };
 }
 }, [user]);

 const refreshProfile = useCallback(() => {
 if (user) {
 return fetchProfile(user.uid);
 }
 }, [user, fetchProfile]);

  const value = useMemo(
  () => ({
  user,
  profile,
  loading,
  registerWithEmail,
  loginWithEmail,
  signInWithGoogle,
  signInWithGithub,
  signOut,
  updateProfile,
  completeProfile,
  refreshProfile,
  }),
  [user, profile, loading, registerWithEmail, loginWithEmail, signInWithGoogle, signInWithGithub, signOut, updateProfile, completeProfile, refreshProfile]
  );

 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
