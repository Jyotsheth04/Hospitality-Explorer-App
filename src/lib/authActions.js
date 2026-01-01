import { supabase } from './supabaseClient';

export const handleSignUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const handleLogin = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Logout error:", error.message);
};