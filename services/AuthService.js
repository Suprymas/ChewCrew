import {supabase} from "../lib/supabase";

class AuthService {

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error };
    }
  }


  async signUp(email, password, displayName) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName, 
          },
        },
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error };
    }
  }

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      return { user: session?.user ?? null, error: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { user: null, error };
    }
  }

  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;

      return { user, error: null };
    } catch (error) {
      console.error('Get user error:', error);
      return { user: null, error };
    }
  }
}

export default new AuthService();