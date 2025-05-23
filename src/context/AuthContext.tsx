
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);


interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: { display_name: string } | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ display_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error checking session:', error);
          return;
        }

        if (data?.session) {
          const { data: userData } = await supabase.auth.getUser();
          setUser(userData.user);
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', userData.user.id)
            .single();

          if (profileData && !profileError) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error || !data.user) {
        toast({
          title: 'Sign up failed',
          description: error?.message ?? 'Unknown error',
          variant: 'destructive',
        });
        return;
      }

      await supabase.from('profiles').insert([
        {
          id: data.user.id,
          display_name: displayName,
        },
      ]);

      toast({
        title: 'Account created',
        description: 'Your account was created successfully',
      });
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: 'Sign up failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (data?.user) {
        setUser(data.user);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', data.user.id)
          .single();
        if (profileData && !profileError) {
          setProfile(profileData);
        }
        toast({
          title: 'Login successful',
          description: 'Welcome to the admin panel',
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, profile, signIn, signOut, signUp }}>
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

export const supabaseClient = supabase;
